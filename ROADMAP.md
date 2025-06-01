🏰 EQUORN PROJECT ROADMAP & TASK TRACKER
Master checklist and guidance system for transforming Equorn from vision to reality

"From myth to code, one commit at a time."

📊 PROJECT STATUS OVERVIEW (2025-05-31 Update)
| Component         | Current State                                   | Target State              | Priority | ETA    |
|-------------------|-------------------------------------------------|---------------------------|----------|--------|
| Core Engine       | 60% - Modularized, type/lint errors fixed, tests run but fail due to mocking issues | 100% - Full generation    | 🔥 P0    | 1 week |
| CLI Interface     | 15% - Structure only                            | 100% - Working commands   | 🔥 P0    | 1 week |
| Example Seeds     | 0% - Missing                                    | 100% - 5+ examples        | 🔥 P0    | 3 days |
| Godot Generator   | 40% - Modularized, generates structure, needs richer scenes | 100% - Rich scenes        | 🔥 P0    | 1 week |
| Web Dashboard     | 60% - UI exists                                 | 100% - Integrated         | ⚠️ P1    | 3 weeks|
| Documentation     | 80% - Well written                              | 100% - Matches reality    | ⚠️ P1    | 1 week |
| Testing Suite     | 50% - Modular test infra, most core tests present, mocking issues remain | 90% - Comprehensive       | 🔷 P2    | 2 weeks|

🎯 PHASE 1: CORE FUNCTIONALITY (WEEKS 1-3)
🚨 CRITICAL PATH - Must Complete First

#### Task Group A: Foundation (Week 1)
- [ ] **A1: Create Working Example Seed Files**
    - [ ] seeds/forest-guardian.yaml - Main example from README
    - [ ] seeds/haunted-tavern.yaml - Atmospheric example
    - [ ] seeds/dragon-lair.yaml - Combat/encounter example
    - [ ] seeds/simple-test.yaml - Minimal test case
    - [ ] Document seed file schema with comments
    - _A1 is complete when you can run cat seeds/forest-guardian.yaml and see a valid YAML structure matching the README examples._

- [ ] **A2: Implement Basic CLI Commands**
    - [ ] Fix index.ts to export working commands
    - [ ] Implement seed command with argument parsing
    - [ ] Add --target flag support (godot, unity, web, docs)
    - [ ] Add --output flag for custom output directories
    - [ ] Add proper error handling and user feedback
    - _A2 is complete when pnpm equorn seed --help shows proper usage and pnpm equorn seed seeds/simple-test.yaml runs without errors._

- [x] **A3: Core Generator Factory (MODULARIZED, TYPE/LINT FIXES, TEST INFRA)**
    - [x] Create generator.ts main entry point
    - [x] Implement generateFromSeed(seedPath, options) function
    - [x] Add target resolution (godot -> GodotGenerator class)
    - [x] Add file system utilities (createDir, writeFile, copyTemplate)
    - [x] Modularized architecture in place
    - [x] TypeScript/ESM/lint issues fixed
    - [x] Markdown generation improved
    - [ ] **Tests passing with mocks** _(BLOCKED: fs-extra mocks not registering calls)_
    - [ ] Finalize backward compatibility checks
    - _A3 is complete when the core engine can route seed files to appropriate generators, create output directories, and all generator tests pass (including fs mocking)._


### 🟢 Immediate Next Steps (as of 2025-05-31)
1. **Fix fs-extra Mocking:**
   - Refactor test mocks so that `fs.ensureDir`, `fs.writeFile`, etc., are correctly spied upon and register calls.
   - Ensure the mocks are not shadowed or replaced after spies are set.
2. **Test Pass Verification:**
   - Once mocks work, ensure all modular generator tests pass.
   - Add/expand tests for edge cases and uncovered modules.
3. **CLI & Example Seeds:**
   - Begin work on CLI commands and seed file examples as soon as core generator tests pass.
4. **Documentation:**
   - Update README and CLI usage docs to match new modular structure and usage.

---

🔄 WEEKLY REVIEW TEMPLATE
Week X Review (Date: ____))
Completed Tasks:

<input disabled="" type="checkbox"> List completed tasks from above checklist
<input disabled="" type="checkbox"> Note any blockers that were resolved
<input disabled="" type="checkbox"> Document lessons learned

<input disabled="" type="checkbox"> Identify top 3 tasks for next week
<input disabled="" type="checkbox"> Note any dependencies or blockers
<input disabled="" type="checkbox"> Update timeline estimates if needed
Metrics:

Lines of code written: ____
Tests passing: ____
Documentation pages updated: ____
User feedback received: ____
Decisions Made:

Technical decisions and rationale
Scope changes and justification
Timeline adjustments and reasons
Remember: Progress over perfection. Ship working functionality before polishing infrastructure. The goal is to transform Equorn from "impressive vision" to "useful tool" as quickly as possible. 🚀

Current Phase: Foundation Building Next Milestone: First Working CLI Command Ultimate Goal: README examples work as advertised