import { workspace, ConfigurationTarget } from "vscode";

export type TextMateRule = {
    scope: string | string[];
    settings: { foreground?: string; fontStyle?: string };
};

export function injectTextMateRules(rules: TextMateRule[]) {
    const editorConfig = workspace.getConfiguration("editor");
    const existingConfig = editorConfig.get<{ textMateRules: TextMateRule[] }>("tokenColorCustomizations") || { textMateRules: [] };
    const mergedRules: TextMateRule[] = [];
    const seenScopes = new Set<string>();
    const addRule = (rule: TextMateRule) => {
        const scopeKey = Array.isArray(rule.scope) ? rule.scope.join(",") : rule.scope;
        if (!seenScopes.has(scopeKey)) {
            seenScopes.add(scopeKey);
            mergedRules.push(rule);
        }
    };
    existingConfig.textMateRules.forEach(addRule);
    rules.forEach(addRule);
    editorConfig.update("tokenColorCustomizations", { textMateRules: mergedRules }, ConfigurationTarget.Global).then(
        () => console.log("write successful textMateRules"),
        err => console.error("write unsuccessful:", err)
    );
}
