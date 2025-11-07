# KQL Tool README

This extension provides syntax highlighting, code snippets, and formatting for KQL (Kusto Query Language). Bundled with Webpack

> **Note:** Color highlighting and formatting settings will be automatically added to `settings.json` when the extension is activated.

> *You can change the predefined colors and the formatter via settings.json*
```json
{
  "scope": "variable.system.kql",
  "settings": {
    "foreground": "#7FDBFF",
    "fontStyle": "bold"
  }
},
{
  "scope": "keyword.logical.kql",
  "settings": {
    "foreground": "#d22020",
    "fontStyle": "bold"
  }
},
{
  "scope": "keyword.clause.kql",
  "settings": {
    "foreground": "#887fff",
    "fontStyle": "bold"
  }
},
{
  "scope": "keyword.operator.symbol.kql",
  "settings": {
    "foreground": "#ef25ce",
    "fontStyle": "bold"
  }
},
{
  "scope": "variable.other.kql",
  "settings": {
    "foreground": "#FFA07A"
  }
},
{
  "scope": "builtin.function.kql",
  "settings": {
    "foreground": "#DDA0DD"
  }
},
{
  "scope": "builtin.aggregation_function.kql",
  "settings": {
    "foreground": "##1E90FF",
  }
},
{
  "scope": "keyword.define.kql",
  "settings": {
    "foreground": "#90EE90",
    "fontStyle": "bold"
  }
},
{
  "scope": "keyword.flowcontrol.kql",
  "settings": {
    "foreground": "#3d31ec",
    "fontStyle": "bold"
  }
},
{
  "scope": "keyword.query.kql",
  "settings": {
    "foreground": "#FFD580"
  }
},
{
  "scope": "type.data.kql",
  "settings": {
    "foreground": "#B0E0E6"
  }
},
{
  "scope": "constant.numeric.kql",
  "settings": {
    "foreground": "#87CEFA"
  }
},
{
  "scope": "comment.singleline.kql, comment.block.kql",
  "settings": {
    "foreground": "#A9A9A9",
    "fontStyle": "italic"
  }
},
{
  "scope": "string.doublequote.kql, string.singlequote.kql",
  "settings": {
    "foreground": "#66FF66",
    "fontStyle": "bold"
  }
},
{
  "scope": "string.verbatim.doublequote.kql, string.verbatim.singlequote.kql",
  "settings": {
    "foreground": "#228B22"
  }
}
```

```json
  "[kql]": {
    "editor.defaultFormatter": "fangweij.kql-tools-vscode",
    "editor.formatOnSave": true
  },
```

### Code Snippets
<p align='center'><img src='https://raw.githubusercontent.com/ESJiang/KQL/refs/heads/main/Resources/code_snippet.png' width='50%' height='50%' /></p>

> I created severval customized code snippets => try typing "inv"

### Diagnostics
<p align='center'><img src='https://raw.githubusercontent.com/ESJiang/KQL/refs/heads/main/Resources/diagnostics.png' width='50%' height='50%' /></p>

## Reference

[Microsoft Learn: KQL Quick Reference](https://learn.microsoft.com/en-us/kusto/query/kql-quick-reference?view=microsoft-fabric)

[Microsoft Learn: deviceprocessevents table](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table)

[Microsoft Sentinel security alert schema reference](https://learn.microsoft.com/en-us/azure/sentinel/security-alert-schema)

Feel free to **open an issue** or **send a pull request** to help improve this extension :slightly_smiling_face:.