# 🛡️ Equorn – Comprehensive Testing Plan

---

## 1 · Code Tests (Unit & Integration)

### 1.1 Target Areas

| Module (package)    | Core Responsibilities                                    | Test Focus                                                                                |
| ------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **`packages/core`** | Parse seed YAML/JSON → produce AST → generate artifacts. | • AST correctness<br>• Error handling on malformed seeds<br>• Snapshot of generated files |
| **`packages/cli`**  | Wrap core in a CLI; parse flags; handle I/O.             | • Flag parsing<br>• Exit codes<br>• Integration with `core.build()`                       |
| **`packages/web`**  | Next.js dashboard; tRPC API; live preview components.    | • Page renders<br>• API routes<br>• Component props validation                            |
| **`templates/*`**   | Starter blueprints.                                      | • Structural validation (files exist, placeholder vars substituted)                       |

### 1.2 Example Unit Tests (Vitest + TypeScript)

```ts
// packages/core/tests/seed-parser.test.ts
import { parseSeed } from "../src/seed-parser";

describe("parseSeed()", () => {
  it("returns a valid AST for a minimal seed", () => {
    const ast = parseSeed("name: Forest Guardian");
    expect(ast.name).toBe("Forest Guardian");
  });

  it("throws a descriptive error on invalid YAML", () => {
    expect(() => parseSeed(":::")).toThrow(/YAML parse error/);
  });
});
```

```ts
// packages/cli/tests/cli.test.ts
import { execa } from "execa";

it("shows help when no args are passed", async () => {
  const { stdout, exitCode } = await execa("pnpm", ["cli", "--help"]);
  expect(stdout).toMatch(/Usage: equorn/);
  expect(exitCode).toBe(0);
});
```

```ts
// packages/web/tests/api-seed.test.ts
import { createServer } from "http";
import { app } from "../src/server";
import supertest from "supertest";

it("POST /api/seed returns 400 on bad payload", async () => {
  const server = createServer(app);
  await supertest(server)
    .post("/api/seed")
    .send({})            // missing required fields
    .expect(400);
});
```

### 1.3 Integration / End-to-End

* Use **`test/e2e/`** with Playwright:

  1. Spin up `pnpm dev` in a worker thread.
  2. Load the dashboard.
  3. Drop a sample seed file.
  4. Assert that preview panel shows generated scene artifacts.

---

## 2 · Prompt & AI Output Testing

> Equorn ships default **prompt templates** (e.g., “myth-generator”, “npc-namer”). We need lightweight, deterministic checks.

### 2.1 Test Strategy

| Aspect              | Method                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Response format** | Regex or JSON schema validation.                                                                                     |
| **Key content**     | Assert presence of expected tokens/phrases (“Seed Name” echoed back, or `<ELEMENT_TAG>` blocks).                     |
| **Toxicity / PII**  | Pass responses to an open-source safety classifier (e.g., `transformers` detoxify) and assert score below threshold. |
| **Length bounds**   | Check `wordCount` within ±20 % of spec.                                                                              |

### 2.2 Example Test Snippet (Jest + OpenAI Mock)

```ts
// packages/core/tests/prompt.test.ts
import { generateMyth } from "../src/prompt-engine";
import { mockCompletion } from "./helpers/openai-mock";

it("myth prompt includes seed name and three acts", async () => {
  mockCompletion("### Seed: Forest Guardian\n\nAct I...");
  const out = await generateMyth("Forest Guardian");
  expect(out).toMatch(/Seed: Forest Guardian/);
  expect(out.split("Act").length - 1).toBe(3);
});
```

*Mock the LLM client so CI runs off-line and deterministically.*

### 2.3 Golden-Sample Suite

`tests/prompts/golden/`

```
seed_forest_guardian.md   # expected key phrases / schema
seed_clockwork_city.md
```

Automated script:

1. Feed seed to prompt-engine.
2. Compare to golden manifest (`jsonschema + contains`).
3. Fail if any required section missing or safety classifier flags high toxicity.

---

## 3 · Automation & CI

| Stage                    | Action                                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **PR Checks**            | GitHub Action `ci.yml` runs on pull\_request: <br>• `pnpm lint && pnpm typecheck`<br>• `pnpm test --run` (unit)<br>• Playwright e2e headless<br>• Prompt tests with mocked LLM |
| **Release Workflow**     | On push tag `v*`: build Docker image, run full test matrix with external LLM (live key but low QPS), then publish artifacts.                                                   |
| **Coverage Gate**        | Upload `vitest --coverage` report; fail if `< 80 %` lines.                                                                                                                     |
| **Nightly Prompt Drift** | Scheduled job calls live LLM with sampled seeds, logs deltas, and alerts on major format drift.                                                                                |

---

### ✅ Outcome

Implementing this plan ensures:

* **Functional integrity** – code changes break fast in CI.
* **Prompt stability** – templates produce predictable, safe output.
* **Traceable quality** – coverage metrics and scheduled drift checks keep the castle’s defenses strong.
