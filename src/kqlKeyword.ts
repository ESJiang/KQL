export interface KqlKeyword {
    type: "keyword" | "function" | "table" | "field" | "snippet" | "operator";
    description: string;
    body?: string;
}

export const kqlKeywords: Record<string, KqlKeyword> = {
    ":": {
        type: "operator",
        description: "Matches individual terms or exact values stored in the property database or index.",
        body: ": ",
    },
    "=": {
        type: "operator",
        description: "Exact match with the specified value. Avoid combining = with * when doing exact matching.",
        body: "= ",
    },
    "==": {
        type: "operator",
        description: "Returns results where the property value is equal to the specified value.",
        body: "== ${1:value}",
    },
    "!=": {
        type: "operator",
        description: "Returns results where the property value is not equal to the specified value.",
        body: "!= ${1:value}",
    },
    "<": {
        type: "operator",
        description: "Returns results where the property value is less than the specified value.",
        body: "< ",
    },
    ">": {
        type: "operator",
        description: "Returns results where the property value is greater than the specified value.",
        body: "> ",
    },
    "<=": {
        type: "operator",
        description: "Returns results where the property value is less than or equal to the specified value.",
        body: "<= ",
    },
    ">=": {
        type: "operator",
        description: "Returns results where the property value is greater than or equal to the specified value.",
        body: ">= ",
    },
    "<>": {
        type: "operator",
        description: "Returns results where the property value does not equal the specified value.",
        body: "<> ",
    },
    "..": {
        type: "operator",
        description: "Specifies a range from A to B (inclusive). For dates, it means from the start of A to the end of B.",
        body: "..",
    },
    Timestamp: { type: "field", description: "Date and time when the event was recorded" },
    print: { type: "field", description: "Outputs a single row with one or more scalar expressions", body: "print [ColumnName =] ScalarExpression [',' ...]" },
    ago: {
        type: "function",
        description: "Returns the time offset relative to the time the query executes. For example, `ago(1h)` is one hour before the current clock's reading",
        body: "ago(${1:a_timespan})",
    },
    now: {
        type: "function",
        description: "Returns the current datetime optionally adjusted by a timespan, e.g., `now(-1h)` means one hour ago",
        body: "now(${1:a_timespan})",
    },
    tolower: {
        type: "function",
        description: "Converts a string to lowercase",
        body: "tolower(a_string)",
    },
    has_any: {
        type: "keyword",
        description: "Returns true if the left-hand side value matches any of the values in the provided list",
        body: "a_field has_any (value1, value2, ...)",
    },
    by: {
        type: "keyword",
        description: "Used to group results in aggregation, e.g., summarize count() by ColumnName",
        body: "by ${1:ColumnName}",
    },
    dynamic: {
        type: "function",
        description: "Converts a literal array or object to a dynamic type",
        body: "dynamic([${1:item1}, ${2:item2}])",
    },
    dcount: { type: "function", description: "Count distinct values of a column", body: "dcount(${1:ColumnName})" },
    EmailEvents: { type: "table", description: "Email address associated with the event" },
    IdentityLogonEvents: { type: "table", description: "Table storing logon events for identities" },
    IdentityQueryEvents: { type: "table", description: "Table storing identity query events" },
    IdentityDirectoryEvents: { type: "table", description: "Table storing changes in identity directories" },
    DeviceProcessEvents: { type: "table", description: "Table storing process creation and termination events on devices" },
    DeviceNetworkEvents: { type: "table", description: "Table storing network activity events from devices" },
    DeviceFileEvents: { type: "table", description: "Table storing file creation, modification, and deletion events" },
    DeviceRegistryEvents: { type: "table", description: "Table storing registry changes on devices" },
    DeviceLogonEvents: { type: "table", description: "Table storing device logon and logoff events" },
    DeviceImageLoadEvents: { type: "table", description: "Table storing loaded executable or DLL images on devices" },
    DeviceEvents: { type: "table", description: "Table storing general device events" },
    BehaviorEntities: { type: "table", description: "Table storing entities related to detected behaviors" },
    from: { type: "keyword", description: "Specifies start of range", body: "from " },
    to: { type: "keyword", description: "Specifies end of range", body: "to " },
    step: { type: "keyword", description: "Specifies step size", body: "step " },
    range: {
        type: "keyword",
        description: "Generates a table with an arithmetic series of values",
        body: "range ${1:ColumnName} from ago(${2:7d}) to now() step ${3:1d}",
    },
    invoke: {
        type: "keyword",
        description: "Runs the function on the table that it receives as input",
        body: "invoke ${1:function}(${2:param1}${3:, ${4:param2} ...})",
    },
    evaluate: {
        type: "keyword",
        description: "Evaluates query language extensions (plugins)",
        body: "evaluate ${1:[evaluateParameters]} ${2:PluginName}(${3:PluginArg1}${4:, ${5:PluginArg2} ...})",
    },
    lookup: {
        type: "keyword",
        description: "Extends the columns of a fact table with values looked-up in a dimension table",
        body: `\${1:Table1}
| lookup [kind=\${2|leftouter,inner|}] (\${3:Table2}) on \${4:Attribute1}, \${5:Attribute2}`,
    },
    let: {
        type: "keyword",
        description:
            "Binds a name to expressions that can refer to its bound value. Values can be lambda expressions to create query-defined functions as part of the query. Use `let` to create expressions over tables whose results look like a new table",
        body: "let ${1:Name} = ${2:Expression}",
    },
    where: { type: "keyword", description: "Filters on a specific predicate", body: "where ${1:Predicate}" },
    summarize: {
        type: "keyword",
        description: "Groups the rows according to the `by` group columns, and calculates aggregations over each group",
        body: "summarize ${1:[Column =] Aggregation}${2:, ...}${3: by ${4:[Column =] GroupExpression}${5:, ...}}",
    },
    project: {
        type: "keyword",
        description: "Selects the columns to include in the order specified",
        body: "project ${1:ColumnName}${2: = ${3:Expression}}${4:, ...}",
    },
    "project-away": {
        type: "keyword",
        description: "Selects the columns to exclude from the output",
        body: "project-away ${1:ColumnNameOrPattern}${2:, ${3:AnotherColumn} ...}",
    },
    "project-keep": {
        type: "keyword",
        description: "Selects the columns to keep in the output",
        body: "project-keep ${1:ColumnNameOrPattern}${2:, ${3:AnotherColumn} ...}",
    },
    "project-rename": {
        type: "keyword",
        description: "Renames columns in the result output",
        body: "project-rename ${1:new_column_name} = ${2:column_name}",
    },
    "project-reorder": {
        type: "keyword",
        description: "Reorders columns in the result output",
        body: "project-reorder ${1:Col1}${2:, ${3:Col2}}${4: ...}${5: asc|desc}",
    },
    extend: {
        type: "keyword",
        description: "Creates a calculated column and adds it to the result set",
        body: "extend ${1:ColumnName} = ${2:Expression}${3:, ${4:AnotherColumn} = ${5:Expression} ...}",
    },
    true: {
        type: "keyword",
        description: "Boolean literal true, used in expressions or filters",
        body: "true",
    },
    false: {
        type: "keyword",
        description: "Boolean literal false, used in expressions or filters",
        body: "false",
    },
    join: {
        type: "keyword",
        description:
            "Merges the rows of two tables to form a new table by matching values of the specified column(s) from each table. Supports a full range of join types: `fullouter`, `inner`, `innerunique`, `leftanti`, `leftantisemi`, `leftouter`, `leftsemi`, `rightanti`, `rightantisemi`, `rightouter`, `rightsemi`",
        body: "LeftTable | join [JoinParameters] ( RightTable ) on Attributes",
    },
    union: {
        type: "keyword",
        description: "Combines two or more tables and returns all rows. Optionally specify kind (inner/outer) and withsource column.",
        body: `\${1:Table1}
| union \${kind=\${2|outer,inner|}} withsource="\${3:Source}" (\${4:Table2}\${5})`,
    },
    top: {
        type: "keyword",
        description: "Returns the first N rows of the dataset when the dataset is sorted using `by`",
        body: "top ${1:numberOfRows} by ${2:expression} ${3|asc,desc|} ${4|nulls first,nulls last|}",
    },
    on: { type: "keyword", description: "Specifies the key columns used to join two tables", body: "TableA | join TableB on KeyColumn" },
    order: { type: "keyword", description: "Sort rows by a column" },
    sort: {
        type: "keyword",
        description: "Sort the rows of the input table by one or more columns in ascending or descending order",
        body: "sort by ${1:expression1} ${2|asc,desc|}${3:, ${4:expression2} ${5|asc,desc|} ...}",
    },
    render: {
        type: "keyword",
        description: "Renders results as a graphical output",
        body: "render ${1:Visualization}${2: with (${3:PropertyName} = ${4:PropertyValue}${5:, ...})}",
    },
    "mv-expand": { type: "keyword", description: "Turns dynamic arrays into rows (multi-value expansion)", body: "mv-expand ${1:Column}" },
    make_set: { type: "function", description: "Aggregate values into a dynamic array", body: "make_set(${1:ColumnName})" },
    make_list: {
        type: "function",
        description: "Aggregates values into a dynamic array, can combine multiple fields using `pack()`",
        body: "make_list(pack('${1:Field1Name}', ${2:Field1}, '${3:Field2Name}', ${4:Field2}))",
    },
    count: {
        type: "function",
        description: `Counts records in the input table (for example, T). This operator is shorthand for \`summarize count()\``,
        body: "count(${1:ColumnOrExpression})",
    },
    countif: { type: "function", description: "Count rows that meet a condition", body: "countif()" },
    AlertEvents: { type: "table", description: "Table storing security alert events" },
    DeviceName: { type: "field", description: "Fully qualified domain name (FQDN) of the device" },
    FileName: { type: "field", description: "Name of the file that the recorded action was applied to" },
    InitiatingProcessFileName: {
        type: "field",
        description:
            "Name of the process file that initiated the event; if unavailable, the name of the process that initiated the event might be shown instead",
    },
    InitiatingProcessFileSize: { type: "field", description: "Size of the file that ran the process responsible for the event" },
    InitiatingProcessVersionInfoCompanyName: {
        type: "field",
        description: "Company name from the version information of the process (image file) responsible for the event",
    },
    InitiatingProcessVersionInfoProductName: {
        type: "field",
        description: "Product name from the version information of the process (image file) responsible for the event",
    },
    InitiatingProcessVersionInfoProductVersion: {
        type: "field",
        description: "Product version from the version information of the process (image file) responsible for the event",
    },
    InitiatingProcessVersionInfoInternalFileName: {
        type: "field",
        description: "Internal file name from the version information of the process (image file) responsible for the event",
    },
    InitiatingProcessVersionInfoOriginalFileName: {
        type: "field",
        description: "Original file name from the version information of the process (image file) responsible for the event",
    },
    InitiatingProcessVersionInfoFileDescription: {
        type: "field",
        description: "Description from the version information of the process (image file) responsible for the event",
    },
    LogonId: { type: "field", description: "	Identifier for a logon session. This identifier is unique on the same device only between restarts" },
    ProcessId: { type: "field", description: "Process ID (PID) of the newly created process" },
    ProcessCommandLine: { type: "field", description: "Command line used to create the new process" },
    ProcessIntegrityLevel: {
        type: "field",
        description:
            "Integrity level of the newly created process. Windows assigns integrity levels to processes based on certain characteristics, such as if they were launched from an internet downloaded. These integrity levels influence permissions to resources",
    },
    ProcessTokenElevation: {
        type: "field",
        description:
            "Indicates the type of token elevation applied to the newly created process. Possible values: TokenElevationTypeLimited (restricted), TokenElevationTypeDefault (standard), and TokenElevationTypeFull (elevated)",
    },
    ReportId: {
        type: "field",
        description:
            "Event identifier based on a repeating counter. To identify unique events, this column must be used in conjunction with the DeviceName and Timestamp columns",
    },
    AppGuardContainerId: {
        type: "field",
        description: "Identifier for the virtualized container used by Application Guard to isolate browser activity",
    },
    TimeGenerated: { type: "field", description: "Timestamp when the event occurred" },
    RemoteIP: { type: "field", description: "IP address of the remote endpoint" },
    RemoteUrl: { type: "field", description: "URL of the remote endpoint or request" },
    RemoteIPCountry: { type: "field", description: "Country of the remote IP address" },
    IPAddress: { type: "field", description: "IP address involved in the event" },
    MD5: { type: "field", description: "MD5 hash of the file that the recorded action was applied to" },
    AccountUpn: {
        type: "field",
        description:
            "User principal name (UPN) of the account; if the device is registered in Microsoft Entra ID, the Entra ID UPN of the account might be shown instead",
    },
    AccountObjectId: { type: "field", description: "Unique identifier for the account in Microsoft Entra ID" },
    AccountName: {
        type: "field",
        description:
            "	User name of the account; if the device is registered in Microsoft Entra ID, the Entra ID user name of the account might be shown instead",
    },
    ActionType: {
        type: "field",
        description:
            "Type of activity that triggered the event. See the [in-portal schema reference](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-schema-tables#get-schema-information-in-the-security-center) for details",
    },
    AccountSid: { type: "field", description: "Security Identifier (SID) of the account" },
    LogonType: { type: "field", description: "Specifies the logon type for the event (e.g., interactive, network)" },
    EventType: { type: "field", description: "The type of event recorded (e.g., login, logout, file access)" },
    AlertSeverity: { type: "field", description: "Severity level of a security alert" },
    EventID: { type: "field", description: "Unique identifier for the event type" },
    DeviceType: { type: "field", description: "Type of the device (e.g., server, workstation, mobile)" },
    AccountDomain: { type: "field", description: "Domain of the account" },
    iif: { type: "function", description: "Inline if statement for conditional logic", body: "iif(condition, trueValue, falseValue)" },
    case: {
        type: "function",
        description: "Adds a condition statement, similar to if/then/elseif in other systems",
        body: "case(predicate_1, then_1, predicate_2, then_2, predicate_3, then_3, else)",
    },
    parse: {
        type: "keyword",
        description: "Evaluates a string expression and parses its value into one or more calculated columns. Use for structuring unstructured data",
        body: "parse ${1:kind=${2|regex,simple,relaxed|}} ${3:Expression} with ${4:StringConstant} ${5:ColumnName}${6::${7:ColumnType}}${8: ...}",
    },
    parse_json: { type: "function", description: "Parse JSON string into a structured object", body: "parse_json(ColumnName)" },
    parse_csv: { type: "function", description: "Parse CSV formatted string into columns", body: "parse_csv(ColumnName)" },
    distinct: {
        type: "keyword",
        description: "Produces a table with the distinct combination of the provided columns of the input table",
        body: "distinct [ColumnName], [ColumnName]",
    },
    "make-series": {
        type: "function",
        description: "Creates series of specified aggregated values along a specified axis",
        body: "make-series ${1:Aggregation} on ${2:AxisColumn} from ${3:start} to ${4:end} step ${5:step}${6: by ${7:GroupExpression}}",
    },
    moving_avg: { type: "function", description: "Compute moving average over time series", body: "moving_avg(ColumnName, interval)" },
    substring: { type: "function", description: "Extract a substring from a column", body: "substring(ColumnName, start, length)" },
    format_datetime: { type: "function", description: "Returns data in various date formats", body: "format_datetime(datetime , format)" },
    bin: { type: "function", description: "Rounds all values in a timeframe and groups them", body: "bin(value,roundTo)" },
    search: {
        type: "keyword",
        description: "Searches all columns in the table for the value",
        body: "[${1:TabularSource} |] search [kind=${2:CaseSensitivity}] [in (${3:TableSources})] ${4:SearchPredicate}",
    },
    take: {
        type: "keyword",
        description: `Returns the specified number of records. Use to test a query **Note**: \`take\` and \`limit\` are synonyms`,
        body: "take ${1:NumberOfRows}",
    },
    contains: { type: "keyword", description: "Looks for any substring match", body: "where ${1:col1} contains/has ${2:[search term]}" },
    has: { type: "keyword", description: "Looks for a specific word (better performance)", body: "where ${1:col1} ${2|contains,has|} ${3:[search term]}" },
    startswith: { type: "function", description: "Filter rows where a column starts with a value", body: "ColumnName startswith 'value'" },
    in: { type: "function", description: "Filter rows where a column matches one of a list of values", body: "ColumnName in ('value1', 'value2')" },
    between: { type: "function", description: "Filter rows where a column is between two values", body: "ColumnName between (start, end)" },
    datetime: { type: "function", description: "Manipulate or extract datetime values", body: "datetime('YYYY-MM-DD hh:mm:ss')" },
    datetime_diff: {
        type: "function",
        description: "Compute difference between two datetime columns",
        body: "datetime_diff(${1:ColumnName1}, ${2:ColumnName2})",
    },
    round: { type: "function", description: "Round numeric values to specified decimals", body: "round(${1:ColumnName}, ${2:value})" },
    substringof: { type: "function", description: "Check if substring exists in a string", body: "substringof('${1:value}', ${2:ColumnName})" },
    externaldata: { type: "function", description: "Import external data from files or URLs", body: "externaldata(Column1:Type1, Column2:Type2) [with (...)]" },
    "render table": { type: "keyword", description: "Render the query results as a table" },
    "render timechart": { type: "keyword", description: "Render the results as a time chart" },
    "render barchart": { type: "keyword", description: "Render the results as a bar chart" },
    "render piechart": { type: "keyword", description: "Render the results as a pie chart" },
    "render columnchart": { type: "keyword", description: "Render the results as a column chart" },
    asc: { type: "keyword", description: "Sort column in ascending order", body: "asc" },
    desc: { type: "keyword", description: "Sort column in descending order", body: "desc" },
    SenderFromAddress: { type: "field", description: "The email address of the sender of the message" },
    SenderFromDomain: { type: "field", description: "The domain part of the sender's email address" },
    RecipientEmailAddress: { type: "field", description: "The email address of the recipient of the message" },
    InitiatingProcessSessionId: { type: "field", description: "Windows session ID of the initiating process" },
    IsInitiatingProcessRemoteSession: {
        type: "field",
        description: "Device name of the remote device from which the initiating process's RDP session was initiated",
    },
    ProcessRemoteSessionIP: {
        type: "field",
        description: "	IP address of the remote device from which the created process's RDP session was initiated",
    },
    ProcessUniqueId: {
        type: "field",
        description: "Unique identifier of the process; this is equal to the Process Start Key in Windows devices",
    },
    InitiatingProcessUniqueId: {
        type: "field",
        description: "Unique identifier of the initiating process; this is equal to the Process Start Key in Windows devices",
    },
    InitiatingProcessRemoteSessionIP: {
        type: "field",
        description: "IP address of the remote device from which the initiating process's RDP session was initiated",
    },
    CreatedProcessSessionId: {
        type: "field",
        description: "Windows session ID of the created process",
    },
    IsProcessRemoteSession: {
        type: "field",
        description: "Indicates whether the created process was run under a remote desktop protocol (RDP) session (true) or locally (false)",
    },
    ProcessRemoteSessionDeviceName: {
        type: "field",
        description: "Device name of the remote device from which the created process's RDP session was initiated",
    },
    InitiatingProcessRemoteSessionDeviceName: {
        type: "field",
        description: "Device name of the remote device from which the initiating process's RDP session was initiated",
    },
    Subject: { type: "field", description: "The subject line of the email message" },
    AdditionalFields: { type: "field", description: "Additional information about the event in JSON array format" },
    NetworkMessageId: { type: "field", description: "Unique identifier for the network message" },
    EmailAttachmentInfo: { type: "field", description: "Information about attachments included in the email" },
    FileType: { type: "field", description: "The type of the file (e.g., .exe, .pdf, .docx)" },
    FileSize: { type: "field", description: "Size of the file in bytes" },
    SHA1: {
        type: "field",
        description: "SHA-1 of the file that the recorded action was applied to",
    },
    SHA256: {
        type: "field",
        description: "SHA-256 of the file that the recorded action was applied to. This field is usually not populated — use the SHA1 column when available",
    },
    DetectionMethods: { type: "field", description: "Methods or rules that detected the file or event" },
    leftouter: { type: "keyword", description: "KQL join type that returns all records from the left table and matching records from the right table" },
    Url: { type: "field", description: "The URL involved in the event or email message" },
    InitiatingProcessAccountName: {
        type: "field",
        description:
            "User name of the account that ran the process responsible for the event; if the device is registered in Microsoft Entra ID, the Entra ID user name of the account that ran the process responsible for the event might be shown instead",
    },
    InitiatingProcessAccountDomain: {
        type: "field",
        description: "Domain of the account that ran the process responsible for the event",
    },
    InitiatingProcessAccountSid: {
        type: "field",
        description: "Security Identifier (SID) of the account that ran the process responsible for the event",
    },
    InitiatingProcessAccountUpn: {
        type: "field",
        description:
            "User principal name (UPN) of the account that ran the process responsible for the event; if the device is registered in Microsoft Entra ID, the Entra ID UPN of the account that ran the process responsible for the event might be shown instead",
    },
    InitiatingProcessAccountObjectId: {
        type: "field",
        description: "Microsoft Entra object ID of the user account that ran the process responsible for the event",
    },
    InitiatingProcessLogonId: {
        type: "field",
        description:
            "Identifier for a logon session of the process that initiated the event. This identifier is unique on the same device only between restarts",
    },
    InitiatingProcessIntegrityLevel: {
        type: "field",
        description:
            "Integrity level of the process that initiated the event. Windows assigns integrity levels to processes based on certain characteristics, such as if they were launched from an internet download. These integrity levels influence permissions to resources",
    },
    InitiatingProcessTokenElevation: {
        type: "field",
        description:
            "Token type indicating the presence or absence of User Access Control (UAC) privilege elevation applied to the process that initiated the event",
    },
    InitiatingProcessSHA1: {
        type: "field",
        description: "SHA-1 hash of the process (image file) that initiated the event",
    },
    InitiatingProcessSHA256: {
        type: "field",
        description: "SHA-256 of the process (image file) that initiated the event. This field is usually not populated — use the SHA1 column when available",
    },
    InitiatingProcessMD5: {
        type: "field",
        description: "MD5 hash of the process (image file) that initiated the event",
    },
    ProcessVersionInfoCompanyName: { type: "field", description: "Company name from the version information of the newly created process" },
    ProcessVersionInfoProductName: { type: "field", description: "Product name from the version information of the newly created process" },
    ProcessVersionInfoProductVersion: { type: "field", description: "Product version from the version information of the newly created process" },
    ProcessVersionInfoInternalFileName: { type: "field", description: "Internal file name from the version information of the newly created process" },
    ProcessVersionInfoOriginalFileName: { type: "field", description: "Original file name from the version information of the newly created process" },
    ProcessVersionInfoFileDescription: { type: "field", description: "Description from the version information of the newly created process" },
    InitiatingProcessCommandLine: { type: "field", description: "Command line used to run the process that initiated the event" },
    InitiatingProcessParentFileName: { type: "field", description: "Name of the parent process that spawned the process responsible for the event" },
    InitiatingProcessParentCreationTime: { type: "field", description: "Date and time when the parent of the process responsible for the event was started" },
    InitiatingProcessSignerType: { type: "field", description: "Type of file signer of the process (image file) that initiated the event" },
    InitiatingProcessSignatureStatus: {
        type: "field",
        description: "	Information about the signature status of the process (image file) that initiated the event",
    },
    ISP: { type: "field", description: "ISP field" },
    Location: { type: "field", description: "Location field" },
    FailureReason: { type: "field", description: "FailureReason field" },
    Application: { type: "field", description: "Application field" },
    OSPlatform: { type: "field", description: "OSPlatform field" },
    EmailUrlInfo: { type: "field", description: "EmailUrlInfo field" },
    UrlDomain: { type: "field", description: "UrlDomain field" },
    DeviceId: { type: "field", description: "Unique identifier for the device in the service" },
    InitiatingProcessId: { type: "field", description: "Process ID (PID) of the process that initiated the event" },
    ProcessCreationTime: { type: "field", description: "Date and time the process was created" },
    InitiatingProcessCreationTime: { type: "field", description: "Date and time when the process that initiated the event was started" },
    InitiatingProcessFolderPath: { type: "field", description: "Folder containing the process (image file) that initiated the event" },
    InitiatingProcessParentId: { type: "field", description: "Process ID (PID) of the parent process that spawned the process responsible for the event" },
    RemoteDnsCanonicalNames: { type: "field", description: "Canonical DNS names of the remote host involved in the connection" },
    RemotePort: { type: "field", description: "Network port on the remote host that was used in the connection" },
    Protocol: { type: "field", description: "Network protocol used for the connection (e.g., TCP, UDP)" },
    and: { type: "keyword", description: "Logical AND operator used to combine multiple conditions" },
    or: { type: "keyword", description: "Logical OR operator used to combine multiple conditions" },
    FolderPath: { type: "field", description: "Folder containing the file that the recorded action was applied to" },
    FileOriginReferrerUrl: { type: "field", description: "The URL that referred the file download or event" },
    FileOriginIP: { type: "field", description: "The IP address from which the file originated or was downloaded" },
    FileOriginUrl: { type: "field", description: "The original URL from which the file was downloaded or accessed" },

    InvestigatePasswordSpray: {
        type: "snippet",
        description: "Investigate password spray attempts in IdentityLogonEvents",
        body: `IdentityLogonEvents
| where Timestamp >= ago(\${1:variable})
| where AccountUpn == "\${2:variable}"
| where ISP != "INTERNAL_NETWORK"
| where Location != "\${3:variable}"
| where IPAddress != ''
| summarize
    FailedAttempts = count(),
    action = make_set(ActionType),
    isp = make_set(ISP),
    reason = make_set(FailureReason),
    Apps = make_set(Application),
    logontype = make_set(LogonType),
    devicetype = make_set(DeviceType),
    platform = make_set(OSPlatform),
    addinfo = make_set(AdditionalFields)
    by IPAddress
| order by FailedAttempts desc`,
    },
    InvestigateEmailEvents: {
        type: "snippet",
        description: "Investigate EmailEvents with attachments and URLs",
        body: `EmailEvents
| where SenderIPv4 == "\${1:x.x.x.x}"
| project Timestamp, SenderFromAddress, SenderFromDomain, RecipientEmailAddress, Subject, AdditionalFields

let Emails = EmailEvents
| where SenderIPv4 == "\${1:x.x.x.x}"
| project NetworkMessageId, Timestamp, SenderFromAddress, RecipientEmailAddress, Subject;
let Attachments = EmailAttachmentInfo
| project NetworkMessageId, FileName, FileType, SHA256, FileSize, DetectionMethods;
let Urls = EmailUrlInfo
| project NetworkMessageId, Url, UrlDomain;
Emails
| join kind = leftouter Attachments on NetworkMessageId
| join kind = leftouter Urls on NetworkMessageId
| project Timestamp, SenderFromAddress, RecipientEmailAddress, Subject,
          FileName, FileType, FileSize, SHA256,
          Url, UrlDomain
| order by Timestamp desc`,
    },
    InvestigateFileEvent: {
        type: "snippet",
        description: "Investigate DeviceFileEvents for Mshta.exe or specific files",
        body: `DeviceFileEvents
| where Timestamp > ago(\${1:7d})
| where DeviceName contains "\${2:WORKSTATION01}"
| where FileName =~ "\${3:Test.bat}" and FolderPath has @"C:\\Users\\\${4:ember}\\Downloads"
| project Timestamp, DeviceName, ActionType, FolderPath, FileName, FileOriginReferrerUrl, FileOriginIP, FileOriginUrl, AdditionalFields, InitiatingProcessFileName, InitiatingProcessCommandLine`,
    },
    InvestigateNetworkEvent_RemoteURL: {
        type: "snippet",
        description: "Investigate DeviceNetworkEvents by RemoteUrl or DNS name",
        body: `DeviceNetworkEvents
| where Timestamp >= ago(\${1:30d})
| where DeviceName has "\${2:workstation}"
| where tolower(RemoteUrl) has "\${3:keyword}" or tolower(RemoteDnsCanonicalNames) has "\${4:keyword}"
| project
    Timestamp,
    DeviceName,
    DeviceId,
    InitiatingProcessFileName,
    InitiatingProcessCommandLine,
    InitiatingProcessId,
    InitiatingProcessCreationTime,
    RemoteUrl,
    RemoteDnsCanonicalNames,
    RemoteIP,
    RemotePort,
    Protocol
| order by Timestamp desc`,
    },

    InvestigateNetworkEvent_InitiatingProcessFileName: {
        type: "snippet",
        description: "Investigate DeviceNetworkEvents by initiating process name",
        body: `DeviceNetworkEvents
| where Timestamp >= ago(\${1:30d})
| where InitiatingProcessFileName has "\${2:pdf}"
| where ActionType in ("Allowed", "ConnectionSuccess")
| summarize
    Devices = make_set(DeviceName),
    DeviceCount = dcount(DeviceName),
    Processes = make_set(InitiatingProcessFileName),
    ActionTypes = make_set(ActionType),
    ConnectionCount = count()
    by RemoteIP, RemoteUrl
| order by ConnectionCount desc`,
    },

    InvestigateC2Sites: {
        type: "snippet",
        description: "Hunt for C2 IOCs across browsers and extensions",
        body: `let IOCs = dynamic(["\${1:malicious_domain1}", "\${2:malicious_domain2}"]);
let BrowserExecs = dynamic(["chrome.exe", "msedge.exe", "firefox.exe", "brave.exe", "opera.exe", "Safari"]);
let BrowserPaths = dynamic([
    @"Google\\Chrome\\User Data\\Default\\Extensions",
    @"Microsoft\\Edge\\User Data\\Default\\Extensions",
    @"BraveSoftware\\Brave-Browser\\User Data\\Default\\Extensions",
    @"Opera Software\\Opera Stable\\Extensions",
    @"Mozilla\\Firefox\\Profiles"
]);

DeviceNetworkEvents
| where RemoteUrl has_any(IOCs)
| project Timestamp, DeviceName, InitiatingProcessFileName, InitiatingProcessCommandLine, InitiatingProcessParentFileName, InitiatingProcessAccountName, RemoteUrl, RemoteIP, RemotePort, ActionType
| order by Timestamp desc

let BrowserNet = DeviceNetworkEvents
| where InitiatingProcessFileName in (BrowserExecs)
| where RemoteUrl has_any(IOCs)
| project Timestamp, DeviceName, InitiatingProcessFileName, InitiatingProcessCommandLine, InitiatingProcessParentFileName, InitiatingProcessAccountName, RemoteUrl, RemoteIP, RemotePort, ActionType;

let ExtensionEvents = DeviceFileEvents
| where FolderPath contains BrowserPaths[0]
    or FolderPath contains BrowserPaths[1]
    or FolderPath contains BrowserPaths[2]
    or FolderPath contains BrowserPaths[3]
    or FolderPath contains BrowserPaths[4]
| project Timestamp, DeviceName, FileName, FolderPath, InitiatingProcessFileName;

BrowserNet
| join kind=leftouter ExtensionEvents on DeviceName
| summarize
    UserSet = make_set(InitiatingProcessAccountName),
    Initiators = make_set(InitiatingProcessFileName),
    NetworkEvents = make_list(pack('Timestamp', Timestamp, 'CmdLine', InitiatingProcessCommandLine, 'RemoteUrl', RemoteUrl, 'Action', ActionType)),
    ExtensionEvents = make_list(pack('FolderPath', FolderPath, 'FileName', FileName))
  by DeviceName
| project DeviceName, UserSet, Initiators, NetworkEvents, ExtensionEvents`,
    },

    InvestigateLDAPActivity: {
        type: "snippet",
        description: "Detect LDAP activity involving privileged groups",
        body: `DeviceEvents
| where Timestamp > ago(\${1:7d})
| where DeviceName == "\${2:workstation1}"
| where ActionType contains "ldap"
| where AdditionalFields has_any ("\${3:Schema Admins}", "\${4:Domain Admins}", "\${5:Enterprise Admins}", "\${6:Organization Management}", "\${7:Recipient Management}")
| project
    Timestamp,
    DeviceName,
    InitiatingProcessFileName,
    InitiatingProcessCommandLine,
    InitiatingProcessAccountName
| order by Timestamp desc`,
    },
    InvestigateAADConnectReplication: {
        type: "snippet",
        description: "Check AAD Connect for replication or directory actions",
        body: `DeviceEvents
| where Timestamp > ago(\${1:7d})
| where DeviceName == "\${2:AADConnectServer}"
| where ActionType contains "replication" or ActionType contains "directory"
| where InitiatingProcessAccountName contains "\${3:MSOL}"
| project
    Timestamp,
    DeviceName,
    InitiatingProcessFileName,
    InitiatingProcessCommandLine,
    InitiatingProcessAccountName,
    AdditionalFields
| order by Timestamp desc`,
    },

    InvestigateSingleAccountDevice: {
        type: "snippet",
        description: "Query all events for one account on one device",
        body: `let deviceName = "\${1:xxx}";
let accountname = "\${2:xxx}";
union isfuzzy=true
(
    IdentityLogonEvents,
    IdentityQueryEvents,
    IdentityDirectoryEvents,
    DeviceProcessEvents,
    DeviceNetworkEvents,
    DeviceFileEvents,
    DeviceRegistryEvents,
    DeviceLogonEvents,
    DeviceImageLoadEvents,
    DeviceEvents,
    BehaviorEntities
)
| where Timestamp between (ago(\${3:1d}) .. now())
| where DeviceName == deviceName and AccountName == accountname
| extend EventTable = \\$table
| order by Timestamp desc
| take 800`,
    },

    InvestigateLogonActivityUsingSID: {
        type: "snippet",
        description: "Query DeviceLogonEvents by specific Account SID",
        body: `DeviceLogonEvents
| where AccountSid == "\${1:s-x-x-xx-xxxx-xxx-xxx-xxxxx}"
| project
    Timestamp,
    DeviceName,
    AccountName,
    AccountDomain,
    AccountSid,
    ActionType,
    LogonType,
    RemoteIP
| extend EventType = "\${2:Logon}"`,
    },
};
