/** AI Harness — Class 7: MCP & External Systems. */

export const ahMcp = {
  slug: 'mcp',
  title: 'Class 7 — MCP & External Systems',
  subtitle:
    'MCP is the standardized tool-connectivity layer between your harness and the engineering world: client, server, discovery, security, and a company-knowledge integration.',
  byline: 'AI Harness Masterclass · Class 7 of 10 · ~1h 35m read · Advanced',
  interviewTip:
    'MCP is not “plugins.” It is a protocol so the harness can discover tools at runtime without a rewrite per SaaS. Security still lives in *your* policy engine.',
  sections: [
    {
      id: 'fund',
      title: 'MCP Fundamentals',
      html: `
        <div class="lesson-flow">AI Harness → MCP Client → MCP Server → External System</div>
        <p>The harness embeds an MCP <strong>client</strong>. Servers speak a standard: tools, resources, prompts. This class connects to your MCP / Agent AI content: here MCP is a <em>layer in the harness</em>, not a product tour.</p>
        <pre><code>type McpClient = {
  connect(server: ServerConfig): Promise&lt;void&gt;;
  listTools(): Promise&lt;ToolSpec[]&gt;;
  call(name: string, args: unknown): Promise&lt;ToolResult&gt;;
};</code></pre>
      `,
    },
    {
      id: 'tools',
      title: 'MCP Tools (use cases)',
      html: `
        <pre><code>GitHub · Jira · Slack · PostgreSQL · Confluence · Internal APIs · Cloud platforms</code></pre>
        <table>
          <thead><tr><th>System</th><th>Read tools</th><th>Write tools (gated)</th></tr></thead>
          <tbody>
            <tr><td>GitHub</td><td>get_pr, list_issues</td><td>comment_pr (L3), merge (L4)</td></tr>
            <tr><td>Jira</td><td>get_issue</td><td>transition (L3)</td></tr>
            <tr><td>Slack</td><td>search</td><td>post_message (L3)</td></tr>
            <tr><td>PostgreSQL</td><td>explain, select (limited)</td><td>DDL (L4, deny prod)</td></tr>
            <tr><td>Confluence</td><td>get_page (untrusted wrap)</td><td>usually none</td></tr>
          </tbody>
        </table>
      `,
    },
    {
      id: 'disc',
      title: 'Tool Discovery',
      html: `
        <div class="lesson-flow">Available MCP servers → Available tools → Tool descriptions → Model decides → Execute</div>
        <pre><code>async function hydrateRegistry(h: Harness) {
  for (const s of h.mcp.allowedServers) {     // policy: allowlist
    await h.mcp.connect(s);
    for (const spec of await h.mcp.listTools()) {
      h.tools.register(wrapMcp(spec, s, h.guardrails));
    }
  }
}</code></pre>
        <p>Wrap every MCP tool with the same authorize() as native tools. A new server must not bypass L4.</p>
      `,
    },
    {
      id: 'sec',
      title: 'MCP Security',
      html: `
        <ul class="lesson-layers">
          <li><strong>Server trust</strong> — third-party servers are code + your token.</li>
          <li><strong>Tool permissions</strong> — per-tool level, not “the Slack server is trusted.”</li>
          <li><strong>Credential isolation</strong> — vault; environment-specific (staging vs prod DSN).</li>
          <li><strong>Data boundaries</strong> — customer PII tools only in the support harness, not the coding harness.</li>
          <li><strong>Audit logging</strong> — every MCP call is a span with server, tool, args hash, actor.</li>
        </ul>
      `,
    },
    {
      id: 'build',
      title: 'Build Your Own MCP Integration',
      html: `
        <pre><code>AI Harness
    ↓
Company Knowledge MCP
    ↓
Architecture Documents → API Documentation → Engineering Standards</code></pre>
        <pre><code>// Minimal knowledge server tool
{ name: "search_standards",
  description: "Search internal ADRs and API specs. Returns quotes with paths.",
  inputSchema: { type: "object", required: ["query"], properties: { query: { type: "string" } } } }</code></pre>
        <p>Start read-only. Wrap results as untrusted data (Class 5). This is the same hero idea as the Claude Code MCP class, from the <em>builder</em> side.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> MCP becomes the standardized tool-connectivity layer between your harness and the external engineering world.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 7',
      html: `
        <ol class="lesson-steps">
          <li>Allowlist three servers you would actually enable on a coding harness vs a support harness.</li>
          <li>Design search_standards: index, ranking, quote length cap.</li>
          <li>Write the audit log schema for an MCP call.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 8.</strong> Subagents: orchestration, not “more agents.”</p></div>
      `,
    },
  ],
  sourceNote: 'MCP protocol details evolve; allowlist + wrap + audit is the harness invariant.',
};
