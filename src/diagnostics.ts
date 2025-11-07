import * as vscode from "vscode";
import { kqlKeywords } from "./kqlKeyword";

export function createKqlDiagnostics(context: vscode.ExtensionContext): vscode.DiagnosticCollection {
    const kqlDiagnostics = vscode.languages.createDiagnosticCollection("kql");
    context.subscriptions.push(kqlDiagnostics);
    function getIgnoredRanges(line: string, lineIndex: number): vscode.Range[] {
        const ranges: vscode.Range[] = [];
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        let match: RegExpExecArray | null;
        while ((match = stringRegex.exec(line)) !== null) {
            ranges.push(new vscode.Range(new vscode.Position(lineIndex, match.index), new vscode.Position(lineIndex, match.index + match[0].length)));
        }
        const verbatimRegex = /@["'].*?["']/g;
        while ((match = verbatimRegex.exec(line)) !== null) {
            ranges.push(new vscode.Range(new vscode.Position(lineIndex, match.index), new vscode.Position(lineIndex, match.index + match[0].length)));
        }
        const commentIndex = line.indexOf("//");
        if (commentIndex >= 0) ranges.push(new vscode.Range(new vscode.Position(lineIndex, commentIndex), new vscode.Position(lineIndex, line.length)));
        return ranges;
    }

    function distanceCount(a: string, b: string): number {
        const sourceLength = a.length;
        const targetLength = b.length;
        const distanceTable: number[][] = Array(sourceLength + 1)
            .fill(0)
            .map(() => Array(targetLength + 1).fill(0));
        for (let i = 0; i <= sourceLength; i++) distanceTable[i][0] = i;
        for (let j = 0; j <= targetLength; j++) distanceTable[0][j] = j;
        for (let i = 1; i <= sourceLength; i++) {
            for (let j = 1; j <= targetLength; j++) {
                if (a[i - 1] === b[j - 1]) distanceTable[i][j] = distanceTable[i - 1][j - 1];
                else distanceTable[i][j] = 1 + Math.min(distanceTable[i - 1][j - 1], distanceTable[i - 1][j], distanceTable[i][j - 1]);
            }
        }
        return distanceTable[sourceLength][targetLength];
    }

    function getClosestKeyword(word: string): string | null {
        let closest: string | null = null;
        let minDistance = Infinity;
        for (const key of Object.keys(kqlKeywords)) {
            const distance = distanceCount(word.toLowerCase(), key.toLowerCase());
            if (distance < minDistance) {
                minDistance = distance;
                closest = key;
            }
        }
        if (!closest) return null;
        const threshold = Math.max(2, Math.floor(closest.length / 3));
        return minDistance <= threshold ? closest : null;
    }

    function updateDiagnostics(document: vscode.TextDocument) {
        if (document.languageId !== "kql") return;
        const diagnostics: vscode.Diagnostic[] = [];
        const lines = document.getText().split(/\r?\n/);
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const ignoredRanges = getIgnoredRanges(line, lineIndex);
            const summarizeVarRegex = /\b([\w_]+)\s*=/g;
            const summarizeVars = new Set<string>();
            lines.forEach(line => {
                let match: RegExpExecArray | null;
                while ((match = summarizeVarRegex.exec(line)) !== null) {
                    summarizeVars.add(match[1]);
                }
            });
            const wordRegex = /\$?\w+(?:\[[^\]]*\])?\([^)]*\)|\$?\w+(?:\[[^\]]*\])?/g;
            let match: RegExpExecArray | null;
            while ((match = wordRegex.exec(line)) !== null) {
                const start = match.index;
                const end = start + match[0].length;
                const wordRange = new vscode.Range(new vscode.Position(lineIndex, start), new vscode.Position(lineIndex, end));
                if (ignoredRanges.some(r => r.contains(wordRange.start))) continue;
                const word = match[0];
                const prevWordMatch = line.substring(0, start).trim().split(/\s+/).pop() ?? "";
                if (
                    /^\w+\(.*\)$/.test(word) ||
                    /^\w+\[\s*\d+\s*\]$/.test(word) ||
                    summarizeVars.has(word) ||
                    (/^\d+$/.test(word) && ["take", "top", "limit"].includes(prevWordMatch)) ||
                    word.startsWith("$") ||
                    /^\d+[dhms]$/.test(word)
                )
                    continue;
                const key = Object.keys(kqlKeywords).find(k => k.toLowerCase() === word.toLowerCase());
                if (!key) {
                    const suggestion = getClosestKeyword(word);
                    const message = suggestion ? `Unknown keyword "${word}". Did you mean "${suggestion}"?` : `Unknown keyword "${word}"`;
                    const diagnostic = new vscode.Diagnostic(wordRange, message, vscode.DiagnosticSeverity.Warning);
                    diagnostics.push(diagnostic);
                }
            }
        }
        kqlDiagnostics.set(document.uri, diagnostics);
    }
    let updateTimer: NodeJS.Timeout | undefined;
    function scheduleUpdate(document: vscode.TextDocument) {
        if (updateTimer) clearTimeout(updateTimer);
        updateTimer = setTimeout(() => updateDiagnostics(document), 300);
    }
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(doc => scheduleUpdate(doc)),
        vscode.workspace.onDidChangeTextDocument(e => scheduleUpdate(e.document)),
        vscode.workspace.onDidCloseTextDocument(doc => kqlDiagnostics.delete(doc.uri))
    );
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            "kql",
            {
                provideCodeActions(document, range, context) {
                    const actions: vscode.CodeAction[] = [];
                    for (const diagnostic of context.diagnostics) {
                        const match = diagnostic.message.match(/Did you mean "(.+)"\?/);
                        if (match) {
                            const suggestion = match[1];
                            const action = new vscode.CodeAction(`Replace with "${suggestion}"`, vscode.CodeActionKind.QuickFix);
                            action.edit = new vscode.WorkspaceEdit();
                            action.edit.replace(document.uri, diagnostic.range, suggestion);
                            action.diagnostics = [diagnostic];
                            actions.push(action);
                        }
                    }
                    return actions;
                },
            },
            { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
        )
    );
    return kqlDiagnostics;
}
