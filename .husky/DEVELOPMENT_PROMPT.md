# 🏰 Equorn Development Prompt - Phase 1 Completion

## Context & Current Status

**Project**: Equorn - An open-source generative myth-engine  
**Version**: 4.4.1  
**Current Score**: 7.5/10  
**Phase**: Foundation Building (Core Functionality)

Equorn transforms structured narrative blueprints (YAML/JSON seeds) into runnable game modules, interactive art, and documentation. The project has excellent architecture and beautiful UI but needs core functionality completion.

## Critical Path - Immediate Priorities (1-2 weeks)

### 🚨 P0 - Foundation Completion

#### 1. Fix Test Infrastructure
**Problem**: fs-extra mocking issues preventing test suite from passing
**Location**: `test/core/` directory, particularly `buildGuardian.test.ts` and `generators.test.ts`
**Action Required**:
```typescript
// Fix mocking strategy for fs-extra in tests
// Ensure fs.ensureDir, fs.writeFile, fs.readFile are properly mocked
// Verify mock calls are registered and assertions pass
// Target: 80% line coverage, 70% branch coverage
```

#### 2. Complete CLI Implementation
**Problem**: Commands exist but are not functional  
**Location**: `packages/cli/src/commands/seed.js`  
**Action Required**:
```bash
# Make this command fully functional:
pnpm equorn seed ./seeds/forest-guardian.yaml --target godot --output ./output

# Requirements:
- Proper argument parsing and validation
- Error handling with user-friendly messages  
- Integration with core generator functions
- Support for all targets: godot, unity, web, docs
- Verbose output option working
```

#### 3. Create Working Example Seeds
**Problem**: Limited functional examples  
**Location**: `seeds/` directory  
**Action Required**:
- Ensure `forest-guardian.yaml` works end-to-end
- Create `simple-test.yaml` for minimal testing
- Validate all seed files generate expected outputs
- Document seed schema with inline comments

#### 4. Core API Integration
**Problem**: Gap between documented API and implementation  
**Location**: `packages/core/src/standalone.js` and `packages/core/src/api/`  
**Action Required**:
```typescript
// Ensure this README example works exactly as documented:
import { buildGuardian } from "@equorn/core";

const result = await buildGuardian({
  seedPath: "./seeds/forest-guardian.yaml",
  target: "godot",
  outputDir: "./output",
  verbose: true,
});
```

## Architecture Requirements

### Type Safety & Interfaces
```typescript
// Ensure these core interfaces are fully implemented:
interface SeedConfig {
  name: string;
  version: string;
  author: string;
  description: string;
  entity?: EntityConfig;
  environment?: EnvironmentConfig;
  quests?: QuestConfig[];
  export?: ExportConfig;
}

interface GenerationResult {
  outputPath: string;
  files: string[];
  metadata: {
    target: string;
    seedFile: string;
    generatedAt: Date;
    duration: number;
  };
}
```

### Generator Targets
Each generator must produce functional output:

1. **Godot (Primary)**:
   ```
   output/godot/
   ├── project.godot        # Godot 4.4.1 config
   ├── scenes/main.tscn     # Scene with Guardian node
   ├── scripts/guardian.gd  # GDScript with seed properties
   └── assets/              # Asset directory
   ```

2. **Web (Secondary)**:
   ```
   output/web/
   ├── index.html          # Styled presentation
   ├── css/style.css       # Cosmic theme styling
   └── js/app.js          # Interactive features
   ```

3. **Docs (Tertiary)**:
   ```
   output/docs/
   ├── README.md          # Generated documentation
   ├── assets/            # Images and resources
   └── index.html         # Web presentation
   ```

## Success Criteria

### Functional Requirements
- [ ] `pnpm equorn seed seeds/forest-guardian.yaml` runs without errors
- [ ] Generated Godot project opens successfully in Godot 4.4.1
- [ ] Generated web output displays correctly in browser
- [ ] All tests pass with proper coverage (80% lines, 70% branches)
- [ ] API matches documentation exactly

### Quality Requirements
- [ ] TypeScript compilation with no errors
- [ ] ESLint passes with no warnings
- [ ] Git hooks (husky) run successfully
- [ ] Docker build completes successfully
- [ ] All example seeds validate and generate output

## Technical Constraints

### Dependencies
- Node.js ≥20 LTS
- pnpm package manager
- TypeScript with strict mode
- Godot 4.4.1 compatibility
- Cross-platform support (Windows, macOS, Linux)

### Code Standards
- Conventional Commits format
- Comprehensive JSDoc comments
- Error handling with meaningful messages
- Consistent naming conventions
- Modular, testable architecture

## Expected Outputs

After completing Phase 1, these commands should work flawlessly:

```bash
# Basic generation
pnpm equorn seed seeds/forest-guardian.yaml

# Target-specific generation  
pnpm equorn seed seeds/mystic-tower.yaml --target godot --output ./my-game

# Verbose output
pnpm equorn seed seeds/ocean-depths.yaml --target web --verbose

# Programmatic API
node -e "
import { buildGuardian } from '@equorn/core';
const result = await buildGuardian({
  seedPath: './seeds/epic-quest.yaml',
  target: 'godot'
});
console.log('Generated:', result.files.length, 'files');
"
```

## Next Phase Preview (P1 Priorities)

Once Phase 1 is complete, focus shifts to:
- Web dashboard integration with core engine
- Enhanced Godot generators with richer scenes
- Unity generator implementation
- Plugin system architecture
- Performance optimization and caching

## Development Environment Setup

```bash
# Clone and setup
git clone https://github.com/equorn/equorn.git
cd equorn
pnpm install

# Run tests
pnpm test

# Start development
pnpm dev

# Build all packages
pnpm build
```

## Debugging & Troubleshooting

### Common Issues
1. **Import/Export Issues**: Ensure consistent ESM usage across packages
2. **Mock Problems**: Use vi.mock() correctly for fs-extra operations  
3. **Path Resolution**: Use path.resolve() for cross-platform compatibility
4. **Type Errors**: Maintain strict TypeScript compliance

### Verification Steps
```bash
# Verify CLI installation
pnpm equorn --help

# Test core functionality
pnpm test packages/core

# Validate seed files
node -c seeds/*.yaml

# Check build output
pnpm build && ls packages/*/dist
```

---

## 🎯 Success Definition

**Phase 1 Complete** when a new user can:
1. Clone the repository
2. Run `pnpm install`
3. Execute `pnpm equorn seed seeds/forest-guardian.yaml`
4. Open the generated Godot project successfully
5. See their myth come to life in the engine

*"From myth to code, one commit at a time."* 