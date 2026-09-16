/** AI Harness — Class 9: Build a Real AI Engineering Harness. */

export const ahBuildHarness = {
  slug: 'build-harness',
  title: 'Class 9 — Build a Real AI Engineering Harness',
  subtitle:
    'Hero project: a miniature Claude-Code-like AI engineering harness — CLI, tool registry, agent loop, memory, guardrails, MCP, then a manager with architect / developer / tester / reviewer.',
  byline: 'AI Harness Masterclass · Class 9 of 10 · ~1h 50m read · Advanced',
  interviewTip:
    'Students should finish having built a miniature version of the architecture behind modern AI coding agents — not another chat wrapper.',
  sections: [
    {
      id: 'arch',
      title: 'Project Architecture',
      html: `
        <pre><code>                 Developer
                     ↓
                CLI / Web UI
                     ↓
                AI Harness
                     ↓
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
   Context        Tool Engine    Memory
   Engine             ↓             ↓
       ↓          Tool Registry    State
       └─────────────┼─────────────┘
                     ↓
                    LLM
                     ↓
                Agent Loop
                     ↓
                Guardrails
                     ↓
                Observability</code></pre>
        <p>Suggested layout:</p>
        <pre><code>ai-harness/
  src/cli.ts
  src/loop.ts
  src/context.ts
  src/tools/*.ts
  src/policy.ts
  src/memory.ts
  src/mcp.ts
  src/subagents.ts
  src/log.ts
  HARNESS.md</code></pre>
      `,
    },
    {
      id: 'cli',
      title: 'Build CLI',
      html: `
        <pre><code>ai-harness "Add DELETE /todos/:id with tests"
ai-harness --plan-only "..."
ai-harness --resume run_01a3
ai-harness --grant 2           # tests/build, not prod</code></pre>
        <pre><code>#!/usr/bin/env node
import { Harness } from "./harness";
const h = await Harness.fromCwd();
const report = await h.loop.run({ prompt: process.argv.slice(2).join(" ") });
console.log(report.summary);
process.exit(report.ok ? 0 : 1);</code></pre>
      `,
    },
    {
      id: 'reg',
      title: 'Build Tool Registry',
      html: `
        <p>Implement: <code>read_file</code>, <code>search</code>, <code>write_file</code>, <code>run_command</code>, <code>run_test</code>, <code>git_diff</code>. Start with allowlisted <code>run_command</code> (test/build only) rather than a raw shell.</p>
      `,
    },
    {
      id: 'loop',
      title: 'Build Agent Loop',
      html: `
        <pre><code>while task_not_complete:
    get_context()
    ask_model()
    if tool_required:
        execute_tool()
    observe_result()
    continue</code></pre>
        <p>Stop conditions: COMPLETE + verify OK, budget (steps/tokens), loop detector, human abort. Persist memory every iteration.</p>
      `,
    },
    {
      id: 'mem',
      title: 'Add Memory',
      html: `
        <p>Persist: task, plan, tool results (paths), decisions, progress, errors — <code>.ai-harness/runs/{id}/state.json</code>.</p>
      `,
    },
    {
      id: 'guard',
      title: 'Add Guardrails',
      html: `
        <pre><code>Tool Request → Policy Engine → Allowed?
                         ↙          ↘
                       YES          NO
                        ↓            ↓
                     Execute       Reject</code></pre>
        <p>Wire Class 5 policies. Secret paths deny. <code>run_command</code> denylist: <code>rm -rf</code>, <code>git push --force</code>, <code>curl | sh</code>.</p>
      `,
    },
    {
      id: 'mcp2',
      title: 'Add MCP',
      html: `
        <p>Connect one read-only knowledge or GitHub server. Register via hydrateRegistry. Log every call.</p>
      `,
    },
    {
      id: 'sub2',
      title: 'Add Subagents',
      html: `
        <pre><code>Manager
 ├── Architect
 ├── Developer
 ├── Tester
 └── Reviewer</code></pre>
        <p>Flag <code>--team</code> runs sequential architect → developer → tester → reviewer. Default stays single-agent.</p>
        <p><strong>Acceptance of the class:</strong> on a toy Todo repo, the harness can explore, implement DELETE, run tests, refuse a production DROP, resume after kill, and optionally run the team pipeline.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> Finish this class having built a miniature version of the architecture behind modern AI coding agents.</p></div>
      `,
    },
  ],
  sourceNote: 'Keep the MVP tiny. Depth is the loop + policy + persistence, not framework count.',
};
