/** AI Harness — Class 4: Tools, Commands & Tool Calling. */

export const ahTools = {
  slug: 'tools',
  title: 'Class 4 — Tools, Commands & Tool Calling',
  subtitle:
    'Tools are the hands of an AI agent — but every hand needs clearly defined permissions. Registry, schemas, the call loop, validation, errors, security.',
  byline: 'AI Harness Masterclass · Class 4 of 10 · ~1h 35m read · Intermediate',
  interviewTip:
    'A tool is not a string the model prints. It is a typed function the harness executes after schema validation and policy. If the model can invent rm -rf because you concatenated a shell, you do not have tools — you have a footgun.',
  sections: [
    {
      id: 'what',
      title: 'What Is a Tool?',
      html: `
        <pre><code>read_file()
write_file()
search_code()
run_tests()
git_diff()
execute_shell()</code></pre>
        <p>A tool is a <strong>side-effecting or observational function</strong> with a JSON (or equivalent) schema the model can request. Commands in a CLI harness are often thin wrappers that become tools internally.</p>
        <p><strong>Use cases.</strong> Coding: filesystem + tests. Support: <code>lookup_order</code>, <code>issue_refund</code>. DevOps: <code>get_pod_logs</code>, <code>rollback_deploy</code> (level 4 — Class 5). Research: <code>web_search</code>, <code>fetch_url</code>.</p>
      `,
    },
    {
      id: 'call',
      title: 'Tool Calling',
      html: `
        <div class="lesson-flow">User → LLM → Tool Decision → Tool Execution → Tool Result → LLM → Next Action</div>
        <pre><code>type ToolCall = { id: string; name: string; args: unknown };
type ToolResult = { id: string; ok: boolean; output: string; error?: string };

async function step(h: Harness, state: State): Promise&lt;State&gt; {
  const out = await h.model.complete({
    messages: state.messages,
    tools: h.tools.specs(),          // advertised schemas
  });
  if (out.toolCalls?.length) {
    for (const call of out.toolCalls) {
      const parsed = h.tools.parse(call);           // schema
      const gate = h.guardrails.authorize(parsed);  // Class 5
      const result = gate.ok ? await h.tools.execute(parsed) : deny(gate);
      state.messages.push(toolMessage(result));
    }
    return step(h, state);           // observe → think again
  }
  return { ...state, final: out.text };
}</code></pre>
        <p>The model never executes. The harness does. That is why logs and permissions are possible.</p>
      `,
    },
    {
      id: 'registry',
      title: 'Tool Registry',
      html: `
        <pre><code>Tool Registry
 ├── filesystem
 ├── terminal
 ├── git
 ├── search
 ├── test
 └── browser</code></pre>
        <pre><code>class ToolRegistry {
  private tools = new Map&lt;string, Tool&gt;();
  register(t: Tool) { this.tools.set(t.name, t); }
  specs(): ToolSpec[] { return [...this.tools.values()].map(t => t.spec); }
  async execute(call: ToolCall): Promise&lt;ToolResult&gt; {
    const t = this.tools.get(call.name);
    if (!t) return { id: call.id, ok: false, output: "", error: "unknown_tool" };
    return t.run(call.args);
  }
}</code></pre>
        <p>Unknown tool names must fail closed. Do not “helpfully” pass them to a generic shell.</p>
      `,
    },
    {
      id: 'schema',
      title: 'Tool Schemas',
      html: `
        <p>Teach: name, description, input schema, output, validation, error handling.</p>
        <pre><code>const readFile: Tool = {
  spec: {
    name: "read_file",
    description: "Read a UTF-8 file under the project root. Use for source and tests, not binaries.",
    inputSchema: {
      type: "object",
      required: ["path"],
      properties: {
        path: { type: "string", minLength: 1, maxLength: 512 },
        offset: { type: "integer", minimum: 0 },
        limit: { type: "integer", minimum: 1, maximum: 400 },
      },
    },
  },
  async run(args: unknown) {
    const { path, offset = 0, limit = 200 } = validate(this.spec.inputSchema, args);
    const abs = resolveInsideRoot(path);          // path traversal guard
    const text = await fs.readFile(abs, "utf8");
    return ok(sliceLines(text, offset, limit));
  },
};</code></pre>
        <p>Descriptions are part of context engineering: they teach the model <em>when</em> to call. Vague descriptions produce random tools.</p>
      `,
    },
    {
      id: 'sec',
      title: 'Tool Security',
      html: `
        <ul class="lesson-layers">
          <li><strong>Allowlist</strong> — only registered tools exist.</li>
          <li><strong>Denylist</strong> — commands/paths inside a generic shell tool.</li>
          <li><strong>Read-only tools</strong> — default for exploration phases.</li>
          <li><strong>Destructive tools</strong> — delete, migrate, deploy: higher permission level.</li>
          <li><strong>Permission levels</strong> — Class 5’s L0–L4 map onto tools.</li>
          <li><strong>Credentials</strong> — tools receive secrets from a vault, never from the prompt.</li>
        </ul>
        <div class="lesson-callout"><strong>Main zest.</strong> Tools are the hands of an AI agent—but every hand needs clearly defined permissions.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 4',
      html: `
        <ol class="lesson-steps">
          <li>Specify six tools for a coding harness with JSON schemas (no implementation yet).</li>
          <li>Write <code>resolveInsideRoot</code> tests: <code>../.env</code> must fail.</li>
          <li>Design a support-agent registry: which tools are read-only vs money-moving?</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 5.</strong> Guardrails, HITL, policies, prompt injection.</p></div>
      `,
    },
  ],
  sourceNote: 'Tool-calling wire format follows whatever your model provider documents; the registry + validate + execute split is the durable design.',
};
