.PHONY: install-frontend install-backend lint-frontend lint-backend fix-frontend fix-backend \
        build-frontend build-backend test-frontend test-backend \
        install lint lint-fix build test

install: install-frontend install-backend
run: run-frontend run-backend
lint: lint-frontend lint-backend
lint-fix: fix-frontend fix-backend
build: build-frontend build-backend
test: test-frontend test-backend

install-frontend:
	@cd spacelift && yarn

install-backend:
	@cd spacelift-backend && yarn

lint-frontend:
	@cd spacelift && yarn prettier:check

lint-backend:
	@cd spacelift-backend && yarn prettier:check

fix-frontend:
	@cd spacelift && yarn prettier:fix

fix-backend:
	@cd spacelift-backend && yarn prettier:fix

build-frontend:
	@cd spacelift && yarn tsc && yarn build && yarn prepublishOnly

build-backend:
	@cd spacelift-backend && yarn tsc && yarn build && yarn prepublishOnly

run-frontend:
	@cd spacelift && yarn start

run-backend:
	@cd spacelift-backend && yarn start

test-frontend:
	@cd spacelift && CI=true yarn test

test-backend:
	@cd spacelift-backend && CI=true yarn test
