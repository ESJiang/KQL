import * as vscode from "vscode";

export function mapCompletionItemKind(type: string): vscode.CompletionItemKind {
    switch (type) {
        case "function":
            return vscode.CompletionItemKind.Function;
        case "aggregation_function":
            return vscode.CompletionItemKind.Method;
        case "table":
            return vscode.CompletionItemKind.Class;
        case "field":
            return vscode.CompletionItemKind.Field;
        case "keyword":
            return vscode.CompletionItemKind.Keyword;
        case "snippet":
            return vscode.CompletionItemKind.Snippet;
        case "operator":
            return vscode.CompletionItemKind.Operator;
        default:
            return vscode.CompletionItemKind.Text;
    }
}
