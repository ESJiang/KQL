import { workspace, ConfigurationTarget } from "vscode";

export function injectFormatSettings() {
    const config = workspace.getConfiguration();
    const existingKqlConfig = config.get<any>("[kql]") || {};
    const newKqlConfig = { ...existingKqlConfig };
    if (!("editor.defaultFormatter" in existingKqlConfig)) newKqlConfig["editor.defaultFormatter"] = "fangweij.kql-tools-vscode";
    if (!("editor.formatOnSave" in existingKqlConfig)) newKqlConfig["editor.formatOnSave"] = true;
    if (JSON.stringify(newKqlConfig) !== JSON.stringify(existingKqlConfig)) {
        config.update("[kql]", newKqlConfig, ConfigurationTarget.Global).then(
            () => console.log("write successful [kql] format settings"),
            err => console.error("write unsuccessful:", err)
        );
    }
}

interface KqlBlock {
    type: "statement" | "pipe" | "function" | "comment" | "string";
    text: string;
    children?: KqlBlock[];
    footer?: string;
}

const noIndentKeywords = [
    "let",
    "Emails",
    "IdentityLogonEvents",
    "IdentityQueryEvents",
    "IdentityDirectoryEvents",
    "DeviceProcessEvents",
    "DeviceNetworkEvents",
    "DeviceFileEvents",
    "DeviceRegistryEvents",
    "DeviceLogonEvents",
    "DeviceImageLoadEvents",
    "DeviceEvents",
    "BehaviorEntities",
];

function addSpacesAroundOperators(text: string): string {
    text = text.replace(/=~/g, "__EQUAL_TILDE__");
    text = text.replace(/(==|!=|>=|<=)/g, " $1 ");
    text = text.replace(/([^<>=!])=([^=])/g, "$1 = $2");
    text = text.replace(/__EQUAL_TILDE__/g, "=~");
    text = text.replace(/\s+/g, " ");
    return text.trim();
}

function parseKqlBlocks(lines: string[]): KqlBlock[] {
    const blocks: KqlBlock[] = [];
    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();
        if (!line) continue;
        if (line.startsWith("//") || line.startsWith("/*")) {
            blocks.push({ type: "comment", text: rawLine });
            continue;
        }
        if (line.startsWith("'''") || line.startsWith('"""')) {
            blocks.push({ type: "string", text: rawLine });
            continue;
        }
        if (line.startsWith("|")) {
            const head = rawLine;
            const children: KqlBlock[] = [];
            let j = i + 1;
            while (j < lines.length && !lines[j].trim().startsWith("|")) {
                const nextLine = lines[j].trim();
                if (!nextLine) {
                    j++;
                    continue;
                }
                if (nextLine.startsWith("//") || nextLine.startsWith("/*")) break;
                children.push({ type: "statement", text: lines[j] });
                j++;
            }
            if (children.length > 0) {
                blocks.push({ type: "pipe", text: head, children });
                i = j - 1;
            } else blocks.push({ type: "pipe", text: head });
            continue;
        }
        if (!line.startsWith("|") && line.includes("|")) {
            const [left, ...rest] = line.split("|");
            const right = "|" + rest.join("|");
            blocks.push({ type: "statement", text: left.trim() });
            blocks.push({ type: "pipe", text: right.trim() });
            continue;
        }
        if (line === "(" && blocks.length > 0) {
            const prevBlock = blocks.pop()!;
            const head = prevBlock.text + " (";
            const children: KqlBlock[] = [];
            let j = i + 1;
            while (j < lines.length && !lines[j].trim().startsWith(")")) {
                children.push({ type: "statement", text: lines[j] });
                j++;
            }
            let footer: string | undefined;
            if (j < lines.length && lines[j].trim().startsWith(")")) footer = lines[j];
            blocks.push({ type: "function", text: head, children, footer });
            i = j;
            continue;
        }
        if (line.endsWith("(")) {
            const head = rawLine;
            const children: KqlBlock[] = [];
            let j = i + 1;
            while (j < lines.length && !lines[j].trim().startsWith(")")) {
                children.push({ type: "statement", text: lines[j] });
                j++;
            }
            let footer: string | undefined;
            if (j < lines.length && lines[j].trim().startsWith(")")) footer = lines[j];
            blocks.push({ type: "function", text: head, children, footer });
            i = j;
            continue;
        }
        if (line.includes("(") && line.includes(")")) {
            blocks.push({ type: "function", text: rawLine });
            continue;
        }
        blocks.push({ type: "statement", text: rawLine });
    }
    return blocks;
}

function formatKqlBlocks(blocks: KqlBlock[], indentLevel = 0): string {
    const indentStep = 4;
    let result: string[] = [];
    function pushLine(line: string, opts: { indent?: string; isFirstLine?: boolean; suppressTopLevelSpacing?: boolean } = {}) {
        const { indent = "", isFirstLine = false, suppressTopLevelSpacing = false } = opts;
        if (/^(?:\s*)(\/\/|\/\*|\*\/)/.test(line)) {
            line = line.trimStart();
            if (line.startsWith("//")) line = "// " + line.slice(2).trimStart();
            if (line.startsWith("/*")) line = "/* " + line.slice(2).trimStart();
            if (line.startsWith("*/")) line = "*/" + line.slice(2);
        }
        const isComment = line.startsWith("//") || line.startsWith("/*");
        const startsWithNoIndent = noIndentKeywords.some(k => line.toLowerCase().startsWith(k.toLowerCase())) || isComment;
        if (indentLevel === 0 && /^let\b/i.test(line) && /^\s*\|/.test(result[result.length - 1])) result.push("");
        if (!suppressTopLevelSpacing && result.length > 0 && startsWithNoIndent && !isFirstLine && indentLevel === 0) {
            const prevLine = result[result.length - 1];
            const prevTrimmed = prevLine.trim();
            const prevIsComment = prevTrimmed.startsWith("//") || prevTrimmed.startsWith("/*") || prevTrimmed.startsWith("*/");
            if (prevTrimmed !== "" && !prevIsComment) result.push("");
        }
        const isNewBlock = /^(datatable|union|summarize|project)\b/i.test(line) && indentLevel === 0;
        if (!suppressTopLevelSpacing && result.length > 0 && isNewBlock) result.push("");
        const finalLine = (startsWithNoIndent ? "" : indent) + line;
        result.push(finalLine);
    }
    for (let block of blocks) {
        const indent = " ".repeat(indentLevel * indentStep);
        switch (block.type) {
            case "pipe": {
                let text = block.text.trim();
                text = text.startsWith("|") ? "| " + text.slice(1).replace(/^[.\s]+/, "") : text;
                const isPipeFunc = /^\|?\s*(project|summarize|extend|orderby|join)\b/i.test(text);
                text = isPipeFunc ? text.replace(/,\s*/g, ", ").replace(/, +$/, ",") : text;
                text = addSpacesAroundOperators(text);
                pushLine(text, { indent, isFirstLine: result.length === 0 });
                block.children?.forEach((child, idx) => {
                    let childText = child.text.trim();
                    if (!childText) return;
                    let childNormalized = childText.replace(/^\|?\s*/, "");
                    if (isPipeFunc) childNormalized = childNormalized.replace(/,\s*/g, ", ").replace(/, +$/, ",");
                    childNormalized = addSpacesAroundOperators(childNormalized);
                    pushLine(childNormalized, {
                        indent: " ".repeat((indentLevel + 1) * indentStep),
                        isFirstLine: idx === 0 && result.length === 1,
                        suppressTopLevelSpacing: true,
                    });
                });
                break;
            }
            case "function": {
                pushLine(block.text.trim(), { indent, isFirstLine: result.length === 0 });
                block.children?.forEach(child => {
                    pushLine(child.text.trim(), {
                        indent: " ".repeat((indentLevel + 1) * indentStep),
                        suppressTopLevelSpacing: true,
                    });
                });
                if (block.footer) {
                    pushLine(block.footer.trim(), { indent });
                }
                break;
            }
            case "statement": {
                let text = block.text.trim();
                text = addSpacesAroundOperators(text);
                pushLine(text, { indent, isFirstLine: result.length === 0 });
                break;
            }
            case "comment":
            case "string":
                pushLine(block.text, { indent, isFirstLine: result.length === 0 });
                break;
        }
    }
    return result.join("\n");
}

export const formatKqlDocument = (text: string): string => formatKqlBlocks(parseKqlBlocks(text.split(/\r?\n/)));
