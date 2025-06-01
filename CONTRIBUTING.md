# Contributing to Equorn

Thank you for considering contributing to Equorn! This document provides guidelines and instructions to help you get started.

## Project Overview

Equorn is an open-source generative myth-engine that turns narrative blueprints into runnable game modules, interactive art pieces, or lore documents. The project is structured as a monorepo with the following packages:

- **core**: Core functionality for parsing seed files and generating output
- **cli**: Command-line interface for using Equorn
- **web**: Web dashboard for visualizing and interacting with generated content
- **templates**: Template files used by the generators

## Getting Started

### Prerequisites

- Node.js ≥ 20 LTS
- pnpm ≥ 10.0.0 (recommended) or npm ≥ 10
- Docker v24+ (optional, for container builds)

### Setup

```bash
# Clone the repository
git clone https://github.com/equorn/equorn.git
cd equorn

# Install dependencies
pnpm install

# Bootstrap your first project
pnpm equorn seed my-myth.yaml

# Launch the dev dashboard
pnpm dev
```

## Development Workflow

### Branching Strategy

We follow a feature branch workflow:

1. Create a branch from `main` for each new feature or bug fix:
   - Features: `feature/your-feature-name`
   - Bug fixes: `fix/issue-description`
   - Documentation: `docs/what-youre-documenting`

2. Make your changes, following the coding guidelines below.

3. Submit a pull request back to `main`.

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) to make the commit history easier to read and automatically generate changelogs. Each commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Where `type` is one of:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or fixing tests
- **chore**: Changes to the build process or auxiliary tools

Examples:
```
feat(cli): add seed validation command
fix(core): resolve entity generation issue
docs: update installation instructions
```

### Coding Style

- TypeScript is used throughout the project
- We use ESLint and Prettier for code formatting
- Run `pnpm lint` before submitting your PR to ensure your code meets our standards

### Testing

- Write tests for new features and bug fixes
- Run `pnpm test` to run the test suite
- We aim for at least 80% test coverage for critical paths

## Pull Request Process

1. Ensure your code passes all tests and linting
2. Update documentation if necessary
3. Add or update tests as needed
4. Submit your PR with a clear title and description
5. Link any related issues using GitHub keywords (fixes #123, closes #456, etc.)

## Project Structure

```
equorn/
├── packages/
│   ├── core/           # Core functionality
│   │   └── src/
│   │       ├── types.ts               # Type definitions
│   │       ├── parser/                # Seed file parsing
│   │       ├── generator/             # Output generation
│   │       └── builders/              # Entity builders
│   ├── cli/            # Command-line interface
│   ├── web/            # Web dashboard
│   └── templates/      # Template files
├── test/               # Test suite
│   ├── core/
│   └── cli/
├── docs/               # Documentation
├── .github/            # GitHub workflows and templates
└── docker/             # Docker configuration
```

## Need Help?

If you have questions or need help, please:
1. Check existing issues to see if your question has been answered
2. Open a new issue with the "question" label
3. Be specific about what you're trying to accomplish and any errors you're encountering

Thank you for contributing to Equorn!
