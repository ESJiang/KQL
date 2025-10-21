import * as vscode from "vscode";
import { formatKqlDocument, injectFormatSettings } from "./formatter";
import { kqlKeywords } from "./kqlKeyword";
import { injectTextMateRules, kqlRules } from "./color";
import { createKqlDiagnostics } from "./diagnostics";
import { mapCompletionItemKind } from "./utils";

export function activate(context: vscode.ExtensionContext) {
    // --- FormattingProvider ---
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
    injectFormatSettings();

    // --- HoverProvider---
    context.subscriptions.push(
        vscode.languages.registerHoverProvider("kql", {
            provideHover(document, position) {
                const range = document.getWordRangeAtPosition(position, /[\w-:.=<>]+|\.\./);
                if (!range) return undefined;
                const word = document.getText(range);
                const key = Object.keys(kqlKeywords).find(k => k.toLowerCase() === word.toLowerCase());
                if (!key) return undefined;
                const keyword = kqlKeywords[key];
                let markdown = `**${key}** (${keyword.type})\n\n${keyword.description}`;
                if (keyword.body) markdown += `\n\n\`\`\`kql\n${keyword.body}\n\`\`\``;
                return new vscode.Hover(markdown, range);
            },
        })
    );

    // --- CompletionItemProvider ---
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            "kql",
            {
                provideCompletionItems(document, position) {
                    const completionItems: vscode.CompletionItem[] = [];
                    for (const [key, keyword] of Object.entries(kqlKeywords)) {
                        const item = new vscode.CompletionItem(key, mapCompletionItemKind(keyword.type));
                        item.detail = keyword.description;
                        if (keyword.body) item.insertText = new vscode.SnippetString(keyword.body);
                        item.documentation = new vscode.MarkdownString(`**${keyword.type}**\n\n${keyword.description}`);
                        if (["<>", "..", "<=", ">="].includes(key)) {
                            item.sortText = "000";
                            item.preselect = true;
                        } else {
                            item.sortText = "zzz";
                        }
                        completionItems.push(item);
                    }
                    return completionItems;
                },
            },
            ":",
            "=",
            "==",
            "<",
            ">",
            "!=",
            ">=",
            "<="
        )
    );

    // --- TextMateRules ---
    injectTextMateRules(kqlRules);

    // --- Diagnostics ---
    createKqlDiagnostics(context);
}
