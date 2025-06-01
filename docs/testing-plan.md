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
  const response = await supertest(server)
    .post("/api/seed")
    .send({ invalid: true });
  
  expect(response.status).toBe(400);
  server.close();
});
```

### 1.3 Strategy & Coverage Goals

- **Approach:** TDD where possible — write generator function tests first.  
- **Coverage:** Focus on % branch coverage instead of lines; aim for 80%+ branch in core generator, parser.
- **E2E:** Use [Playwright](https://playwright.dev) for Web UI tests with realistic human flows.
- **Snapshot:** Compare generated output from key seeds against golden masters.

---

## 2 · Seed Validation

| Test Level                 | Description                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Basic YML/JSON parsing** | Seed files pass initial parse step; syntax errors get reported with line/col.                                                                |
| **Schema validation**      | Required fields present; type validation (string vs. number vs. array, etc).                                                                 |
| **Semantic validation**    | Inner consistency in seed. Example: if entity has `powers[].requires: night`, then does environment have a nighttime phase it could trigger? |
| **LLM-driven expansion**   | Generative tests: seed `{ name: "Forest", entity: { name: "elf" } }` → ask LLM to flesh out details → check format is valid.               |

---

## 3 · Generator Output Testing

| Target          | Artifact Check                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Godot**       | • `.tscn` scene files load without errors<br>• `.gd` script syntax validates<br>• Creatures have AI controller<br>• Camera + controls work   |
| **Unity**       | • `.cs` files compile<br>• GameObjects instantiate<br>• Scene loads<br>• Public API matches expected interface                             |
| **Web**         | • Zero lighthouse errors<br>• ES5 compatibility<br>• Mobile viewport<br>• Accessibility validated<br>• Load < 2.3s on fast 3G                |
| **Docs**        | • Valid MkDocs YAML<br>• All relative links work<br>• Images with alt text<br>• No broken sections                                         |

---

## 4 · CI Integration

| Element                | Details                                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **PR Checks**            | GitHub Action `ci.yml` runs on pull_request: <br>• `pnpm lint && pnpm typecheck`<br>• `pnpm test --run` (unit)<br>• Playwright e2e headless<br>• Prompt tests with mocked LLM |
| **Release Workflow**     | On push tag `v*`: build Docker image, run full test matrix with external LLM (live key but low QPS), then publish artifacts.                                                   |
| **Coverage Gate**        | Upload `vitest --coverage` report; fail if `< 80 %` lines.                                                                                                                     |
| **Nightly Prompt Drift** | Scheduled job calls live LLM with sampled seeds, logs deltas, and alerts on major format drift.                                                                                |

---

## 5 · Manual Testing Checklist

Before each minor release, verify these scenarios with a human:

- [ ] **First Run UX**: Install from empty directory → guided setup.
- [ ] **Development Flow**: Live-reload works for all module types.
- [ ] **Docker Experience**: Container builds & runs correctly.
- [ ] **Common Error Cases**: Helpful messages for known failure modes.
- [ ] **Performance**: 5MB+ seeds parse within 30 sec timeout.
