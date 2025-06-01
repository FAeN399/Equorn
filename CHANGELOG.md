# Changelog

All notable changes to the Equorn project will be documented in this file.

## [4.4.1] - 2025-05-31

### Added
- Initial public release with full versioning
- `buildGuardian` API implementation that works as promised in README section 4.2
- Complete Godot 4.4.1 project generation from YAML seed files
- Generated projects include:
  - `project.godot` configuration file
  - Main scene with Guardian node
  - GDScript with properties from seed file
  - Project README

### Changed
- Updated all version references to 4.4.1
- Improved Godot project structure to match Godot 4.4.1 requirements
- Created standalone implementation to bypass TypeScript build errors

### Fixed
- Implemented missing `buildGuardian` functionality
- Made README examples actually work as documented
- Fixed project.godot format for latest Godot compatibility

## [0.1.0] - Prior Development

- Initial concept and structure
- Early implementation of generators
- README with ambitious promises
