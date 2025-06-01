# Equorn

![Version](https://img.shields.io/badge/version-4.4.1-blue.svg)

**Current Version: 4.4.1**


> **The castle’s blueprint**: everything you need to understand, install, and build upon **Equorn**.
>
> *“Grow the code, guard the myth.”*

---

## 1. Project Title & Description  
**Equorn** is an **open‑source generative myth‑engine**—it turns structured narrative blueprints into runnable game modules, interactive art pieces, or lore documents with a single command.  It bridges the gap between narrative design and playable prototype so world‑builders can iterate at mythic scale **without wrestling low‑level boilerplate**.

---

## 2. Motivation / Background  
- **Why this exists:** Storytellers and indie devs waste days wiring up the same project scaffolding before they can test an idea.  Equorn removes that friction by auto‑growing a fully‑scaffolded forest of assets, scripts, and docs from a single *seed file*.
- **Goals:**
  - *Primary*: Generate proof‑of‑concept game scenes or lore hubs in **< 5 min** from declarative YAML/JSON seeds.
  - *Secondary*: Plug seamlessly into popular engines (Godot, Unity) and static‑site generators for transmedia releases.
- **Inspiration / Prior Art:** Inspired by Yeoman, Tracery, and Ink; tempered with lessons from D&D SRD tooling and the *Zettelkasten* method.

---

## 3. Installation / Setup

### 3.1 Prerequisites
- **OS:** Windows • macOS • Linux  
- **Runtime:** Node.js ≥ 20 LTS (TypeScript bundled)  
- **Package Manager:** pnpm (recommended) or npm ≥ 10  
- **Optional:** Docker v24+ for hermetic builds

### 3.2 Quick Start (Local)
```bash
# 1 — Clone the repo
$ git clone https://github.com/equorn/equorn.git
$ cd equorn

# 2 — Install dependencies (pnpm prefers monorepos)
$ pnpm install

# 3 — Bootstrap your first project from the default template
$ pnpm equorn seed my‑myth.yaml

# 4 — Or use the API to generate a Godot 4.4.1 project directly (see section 4.2)
$ node examples/use-api.js

# 5 — Launch the dev dashboard
$ pnpm dev

# 5 — Open http://localhost:3000 to explore the generated realm
```

### 3.3 Docker (Optional)
```bash
# Build the image
$ docker build -t equorn:latest .

# Run (stand-alone)
$ docker run --init -p 3000:3000 --env-file .env equorn

# Or, with Postgres & hot-reload dev workflow
$ docker compose up --build
```
This spins up the Equorn builder, a Postgres lore‑store, and a hot‑reload web UI.

---

## 4. Usage

### 4.1 CLI Example
```bash
# Convert a seed file into a Godot 4 project folder
$ pnpm equorn seed ./seeds/forest‑guardian.yaml --target godot

# Export the same seed as a static lore site
$ pnpm equorn seed ./seeds/forest‑guardian.yaml --target docs
```

### 4.2 Programmatic API (TypeScript)

Equorn's core functionality is available as a programmatic API, making it easy to integrate into your own tools and workflows.

#### Basic Usage

```ts
import { buildGuardian } from "@equorn/core";

// Generate a Godot 4.4.1 project from a seed file
const result = await buildGuardian({
  seedPath: "./seeds/forest‑guardian.yaml",
  target: "godot",
  outputDir: "./output",
  verbose: true,
});

console.log(`Generated ${result.files.length} files at ${result.outputPath}`);
```

#### API Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `seedPath` | `string` | *required* | Path to the YAML/JSON seed file |
| `target` | `'godot' \| 'unity' \| 'web' \| 'docs'` | `'godot'` | Target platform for generation |
| `outputDir` | `string` | `'./output'` | Directory where files will be generated |
| `verbose` | `boolean` | `false` | Enable detailed console logging |

#### Return Value

The `buildGuardian` function returns a Promise that resolves to a `GenerationResult` object:

```ts
interface GenerationResult {
  // Absolute path to the generated project directory
  outputPath: string;
  
  // List of paths to all generated files
  files: string[];
  
  // Generation metadata and statistics
  metadata: {
    target: string;       // Target platform used
    seedFile: string;     // Path to source seed file
    generatedAt: Date;    // Timestamp of generation
    duration: number;     // Duration in milliseconds
  };
}
```

#### Generated Project Structure (Godot)

For Godot targets (4.4.1), the generated project includes:

```
output/godot/
├─ project.godot        # Godot project configuration
├─ scenes/
│  └─ main.tscn         # Main scene with Guardian node
├─ scripts/
│  └─ guardian.gd       # GDScript with properties from seed
├─ assets/              # Directory for game assets
└─ README.md            # Project documentation
```

The project can be opened directly in Godot Engine 4.4.1 and will include properties and abilities defined in your seed file.

### 4.3 Web Interface
1. Run `pnpm dev` to start the dashboard.  
2. Drag‑and‑drop a seed file onto the canvas.  
3. Tweak parameters; watch the preview update in real time.

---

## 5. Repository Structure
```text
equorn/
├─ .github/          # CI / CD workflows & issue templates
├─ docs/             # MkDocs site with design deep‑dives
├─ packages/
│  ├─ core/          # Seed parser & generator engine
│  ├─ cli/           # Thin wrapper around core for terminal use
│  ├─ web/           # Next.js dashboard (tRPC + Tailwind)
│  └─ templates/     # Official seed & project templates
├─ test/             # Vitest unit & integration suites
├─ docker/           # Container build context
├─ .env.example      # Sample environment variables
├─ pnpm-workspace.yaml
└─ README.md         # ← you are here
```
*(Monorepo powered by `pnpm` workspaces.)*

---

## 6. Contributing
We **welcome pull requests, issues, and lore!**

1. **Fork** → `git checkout -b feat/<topic>`  
2. **Code & commit** following Conventional Commits.  
3. **Test** via `pnpm test` (unit) & `pnpm test:e2e` (end‑to‑end).  
4. **Open a PR** against `main`; fill out the template and sign the CLA.

First‑time contributor? Check `docs/CONTRIBUTING.md` for a step‑by‑step guide.

---

## 7. License & Credits
- **License:** MIT. See [`LICENSE`](LICENSE) for full text.  
- **Core Team / Maintainers:** @milo‑miles, @orb‑weaver, @cortex‑ai.  
- **Acknowledgements:** Yeoman, Tracery, Ink, the Godot community, and every myth‑maker who seeds new worlds.

---

> *Happy forging—may your stories take root and your branches never wither.*
