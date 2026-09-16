/** Claude Code — Class 7: MCP & External Tools. */

export const ccMcp = {
  slug: 'mcp',
  title: 'Class 7 — MCP & External Tools',
  subtitle:
    'Why MCP exists, client/server architecture, tools vs resources vs prompts, installing servers (and when not to), browser automation with a self-correcting visual loop, building a company-knowledge MCP, and security.',
  byline: 'Claude Code Masterclass · Class 7 of 10 · ~1h 40m read · Advanced',
  interviewTip:
    'MCP transforms Claude Code from an AI that works on your code into an AI that can interact with your engineering ecosystem. The skill is knowing which systems deserve a tool, and which should stay copy-paste.',
  sections: [
    {
      id: 'what',
      title: 'What is MCP?',
      html: `
        <div class="lesson-flow">Claude Code → MCP → External Tools / Systems</div>
        <p>The Model Context Protocol is a standard way for an AI client (here, Claude Code) to talk to servers that expose tools, resources and prompts. Instead of a one-off plugin for every SaaS, you speak MCP.</p>
        <p>Session 2 opens with <strong>MCPs, CLIs, and agentic tooling</strong>. MCP is how the agent leaves the git tree without you pasting tickets into the prompt.</p>
      `,
    },
    {
      id: 'why',
      title: 'Why MCP Exists',
      html: `
        <p>Without MCP:</p>
        <div class="lesson-flow">Claude → limited environment</div>
        <p>With MCP:</p>
        <pre><code>Claude
 ↓
MCP
 ├── GitHub
 ├── Database
 ├── Jira
 ├── Slack
 ├── Browser
 ├── Internal APIs
 └── Custom tools</code></pre>
        <p>Session 2 assignment: install MCP servers such as <strong>Figma, Blender, Slack, or Notion</strong> — pick what you actually use — then <strong>build a tool that reads/writes through MCP</strong>.</p>
        <h3 class="lesson-subhead">When not to use it</h3>
        <p>Session 2 is explicit: <strong>install MCP and learn when not to use it</strong>. Skip MCP when:</p>
        <ul class="lesson-layers">
          <li>The CLI already does it well (git, gh, your test runner).</li>
          <li>The data is too sensitive to put behind a tool the model can call.</li>
          <li>You would call it once a month — a paste is cheaper than a server to maintain.</li>
          <li>The server’s tools are vague (“do anything in Notion”) and will thrash.</li>
        </ul>
      `,
    },
    {
      id: 'arch',
      title: 'MCP Architecture',
      html: `
        <ul class="lesson-layers">
          <li><strong>MCP client</strong> — Claude Code, holding the conversation and deciding when to call tools.</li>
          <li><strong>MCP server</strong> — a process that exposes capabilities.</li>
          <li><strong>Tools</strong> — actions (create issue, run query, take screenshot).</li>
          <li><strong>Resources</strong> — readable context (a spec, a design file, a doc page).</li>
          <li><strong>Prompts</strong> — server-provided templates for common jobs.</li>
          <li><strong>Transport</strong> — how client and server talk (stdio, HTTP — check current docs).</li>
          <li><strong>Authentication</strong> — tokens for the upstream system, stored as secrets, not in CLAUDE.md.</li>
        </ul>
      `,
    },
    {
      id: 'browser',
      title: 'Browser automation and the self-correcting chain',
      html: `
        <p>Session 2: <strong>browser automation with /chrome</strong> (or the current browser tool name — version-aware) and the chain:</p>
        <div class="lesson-flow">build → screenshot → fix → verify</div>
        <p>That is visual TDD. The agent implements UI, captures the page, compares to the intent, patches, captures again. Do not skip verify: a screenshot you never look at is as empty as “I fixed it.”</p>
      `,
    },
    {
      id: 'build',
      title: 'Build an MCP Server',
      html: `
        <p>Excellent practical project — custom company knowledge MCP:</p>
        <div class="lesson-flow">Claude Code → MCP Server → Company documentation → Architecture docs → API specs → Engineering standards</div>
        <p>Start tiny: one resource (the architecture doc) and one tool (search headings). Then add write tools only if you have authz and an audit log.</p>
        <p>This is also the Session 2 “connect Claude to the real world” lab, minus the temptation to install twelve servers on day one. One well-permissioned server beats a junk drawer.</p>
      `,
    },
    {
      id: 'sec',
      title: 'MCP Security',
      html: `
        <ul class="lesson-layers">
          <li><strong>Tool permissions</strong> — read vs write vs admin, per server.</li>
          <li><strong>Credentials</strong> — least privilege tokens; rotate; never commit.</li>
          <li><strong>Least privilege</strong> — a docs-search server should not have production DROP.</li>
          <li><strong>Sensitive information</strong> — PII, secrets, customer data: if the tool can fetch it, the model can see it.</li>
          <li><strong>Trust boundaries</strong> — a third-party MCP server is code you did not write, with your token. Review it like a dependency.</li>
        </ul>
        <div class="lesson-callout"><strong>Main zest.</strong> MCP transforms Claude Code from an AI that works on your code into an AI that can interact with your engineering ecosystem.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 7',
      html: `
        <ol class="lesson-steps">
          <li>Install one MCP server you actually use (GitHub, Notion, Slack, Figma, …) and complete one real read task.</li>
          <li>Write down three tasks that should stay CLI, not MCP.</li>
          <li>Sketch (or stub) a knowledge MCP with one resource and one search tool.</li>
          <li>Optional: UI change on Todo + screenshot → fix → verify loop.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 8.</strong> Subagents, agent teams, git worktrees, parallel development, coordination without chaos.</p></div>
      `,
    },
  ],
  sourceNote:
    'MCP is a moving protocol. Confirm server config against current <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">Claude Code</a> and Anthropic MCP docs.',
};
