.PHONY: install-frontend
install-frontend:
	@cd spacelift && yarn

.PHONY: install-backend
install-backend:
	@cd spacelift-backend && yarn

.PHONY: build-frontend
build-frontend:
	@cd spacelift && yarn build

.PHONY: build-backend
build-backend:
	@cd spacelift-backend && yarn build

.PHONY: test-frontend
test-frontend:
	@cd spacelift&& CI=true yarn test

.PHONY: test-backend
test-backend:
	@cd spacelift-backend && CI=true yarn test

.PHONY: install build test
install: install-frontend install-backend
build: build-frontend build-backend
test: test-frontend test-backend