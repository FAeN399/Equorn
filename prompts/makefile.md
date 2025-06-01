# ================================================================
#  Equorn – Developer Task Wrapper
#  ---------------------------------------------------------------
#  Common usage:
#     make setup      # one-time dependency install
#     make run        # start dev dashboard
#     make test       # run unit + e2e tests
#     make build      # compile TypeScript & web bundle
#     make lint       # lint & type-check
#     make format     # auto-format codebase
#     make docker     # build & run container locally
#     make clean      # remove artefacts & caches
# ================================================================

# ----- Config ----------------------------------------------------
PNPM        ?= pnpm           # override with `make PNPM=yarn`
NODE_ENV    ?= development
DIST_DIR    := dist
DOCKER_TAG  := equorn:latest

# ----- Meta targets ----------------------------------------------
.PHONY: setup run test build lint format docker docker-build docker-up clean help

help:
	@grep -E '^[a-zA-Z_-]+:.*?##' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?##"}; {printf " \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ----- Dependency bootstrap --------------------------------------
setup: ## Install Node deps & prepare hooks
	@echo "▶ Installing dependencies with $(PNPM)…"
	$(PNPM) install --frozen-lockfile
	@echo "▶ Husky install"
	$(PNPM) dlx husky-init -y && $(PNPM) husky install

# ----- Build & Run -----------------------------------------------
run: ## Launch dev dashboard (Next.js + tRPC)
	@NODE_ENV=$(NODE_ENV) $(PNPM) dev

build: ## Compile TypeScript packages & web assets
	$(PNPM) build

# ----- Quality gates ---------------------------------------------
lint: ## Run ESLint + TypeScript type-checking
	$(PNPM) lint && $(PNPM) typecheck

format: ## Prettier write
	$(PNPM) format

test: ## Execute all tests (unit + e2e)
	$(PNPM) test

# ----- Container helpers -----------------------------------------
docker: docker-build docker-up ## Build image & start container

docker-build: ## Build multi-stage Docker image
	docker build -t $(DOCKER_TAG) .

docker-up: ## Run container on port 3000
	docker run --init -p 3000:3000 --env-file .env $(DOCKER_TAG)

# ----- House-keeping ---------------------------------------------
clean: ## Delete build artefacts & caches
	@echo "▶ Cleaning $(DIST_DIR), coverage, and pnpm store…"
	rm -rf $(DIST_DIR) .turbo node_modules .coverage
	$(PNPM) store prune

