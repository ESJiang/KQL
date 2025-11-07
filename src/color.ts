import { workspace, ConfigurationTarget } from "vscode";

export type TextMateRule = {
    scope: string | string[];
    settings: { foreground?: string; fontStyle?: string };
};

export const kqlRules: TextMateRule[] = [
    { scope: "variable.system.kql", settings: { foreground: "#7FDBFF", fontStyle: "bold" } },
    { scope: "keyword.logical.kql", settings: { foreground: "#d22020", fontStyle: "bold" } },
    { scope: "keyword.clause.kql", settings: { foreground: "#887fff", fontStyle: "bold" } },
    { scope: "keyword.operator.symbol.kql", settings: { foreground: "#ef25ce", fontStyle: "bold" } },
    { scope: "variable.other.kql", settings: { foreground: "#FFA07A" } },
    { scope: "builtin.function.kql", settings: { foreground: "#DDA0DD" } },
    { scope: "builtin.aggregation_function.kql", settings: { foreground: "#1E90FF" } },
    { scope: "keyword.define.kql", settings: { foreground: "#90EE90", fontStyle: "bold" } },
    { scope: "keyword.flowcontrol.kql", settings: { foreground: "#3d31ec", fontStyle: "bold" } },
    { scope: "keyword.query.kql", settings: { foreground: "#FFD580" } },
    { scope: "type.data.kql", settings: { foreground: "#B0E0E6" } },
    { scope: "constant.numeric.kql", settings: { foreground: "#87CEFA" } },
    { scope: "comment.singleline.kql, comment.block.kql", settings: { foreground: "#A9A9A9", fontStyle: "italic" } },
    { scope: "string.doublequote.kql, string.singlequote.kql", settings: { foreground: "#66FF66", fontStyle: "bold" } },
    { scope: "string.verbatim.doublequote.kql, string.verbatim.singlequote.kql", settings: { foreground: "#228B22" } },
];

export function injectTextMateRules(rules: TextMateRule[]) {
    const editorConfig = workspace.getConfiguration("editor");
    const existingTokenColors: { textMateRules?: TextMateRule[] } = editorConfig.get("tokenColorCustomizations") || {};
    const existingRules: TextMateRule[] = existingTokenColors.textMateRules || [];
    const mergedRules: TextMateRule[] = [];
    const seenScopes = new Set<string>();
    const addRule = (rule: TextMateRule) => {
        const scopeKey = Array.isArray(rule.scope) ? rule.scope.join(",") : rule.scope;
        if (!seenScopes.has(scopeKey)) {
            seenScopes.add(scopeKey);
            mergedRules.push(rule);
        }
    };
    existingRules.forEach(addRule);
    rules.forEach(addRule);
    const updatedTokenColors = {
        ...existingTokenColors,
        textMateRules: mergedRules,
    };
    editorConfig.update("tokenColorCustomizations", updatedTokenColors, ConfigurationTarget.Global).then(
        () => console.log("write successful textMateRules"),
        err => console.error("write unsuccessful:", err)
    );
}
