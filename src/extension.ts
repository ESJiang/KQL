import * as vscode from "vscode";
import { formatKqlDocument, injectFormatSettings } from "./formatter";
import { kqlKeywords } from "./kqlKeyword";
import { injectTextMateRules, TextMateRule } from "./color";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider("kql", {
            provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
                return [
                    vscode.TextEdit.replace(
                        new vscode.Range(document.lineAt(0).range.start, document.lineAt(document.lineCount - 1).range.end),
                        formatKqlDocument(document.getText())
                    ),
                ];
            },
        })
    );

    context.subscriptions.push(
        vscode.languages.registerHoverProvider("kql", {
            provideHover(document, position) {
                const range = document.getWordRangeAtPosition(position, /\b[\w-]+\b/);
                if (!range) return undefined;
                const word = document.getText(range);
                const key = Object.keys(kqlKeywords).find(k => k.toLowerCase() === word.toLowerCase());
                if (!key) return undefined;
                const keyword = kqlKeywords[key];
                let markdown = `**${key}** (${keyword.type})\n\n${keyword.description}`;
                if (keyword.body) {
                    markdown += `\n\n\`\`\`kql\n${keyword.body}\n\`\`\``;
                }
                return new vscode.Hover(markdown, range);
            },
        })
    );
    const kqlRules: TextMateRule[] = [
        { scope: "variable.system.kql", settings: { foreground: "#7FDBFF", fontStyle: "bold" } },
        { scope: "keyword.logical.kql", settings: { foreground: "#d22020", fontStyle: "bold" } },
        { scope: "keyword.clause.kql", settings: { foreground: "#887fff", fontStyle: "bold" } },
        { scope: "keyword.operator.symbol.kql", settings: { foreground: "#ef25ce", fontStyle: "bold" } },
        { scope: "variable.other.kql", settings: { foreground: "#FFA07A" } },
        { scope: "builtin.function.kql", settings: { foreground: "#DDA0DD" } },
        { scope: "keyword.define.kql", settings: { foreground: "#90EE90", fontStyle: "bold" } },
        { scope: "keyword.flowcontrol.kql", settings: { foreground: "#3d31ec", fontStyle: "bold" } },
        { scope: "keyword.query.kql", settings: { foreground: "#FFD580" } },
        { scope: "type.data.kql", settings: { foreground: "#B0E0E6" } },
        { scope: "constant.numeric.kql", settings: { foreground: "#87CEFA" } },
        { scope: "comment.singleline.kql, comment.block.kql", settings: { foreground: "#A9A9A9", fontStyle: "italic" } },
        { scope: "string.doublequote.kql, string.singlequote.kql", settings: { foreground: "#66FF66", fontStyle: "bold" } },
        { scope: "string.verbatim.doublequote.kql, string.verbatim.singlequote.kql", settings: { foreground: "#228B22" } },
    ];
    injectTextMateRules(kqlRules);
    injectFormatSettings();
}
