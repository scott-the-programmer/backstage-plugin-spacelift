# Spacelift Backstage Plugins

[![Maintainability](https://api.codeclimate.com/v1/badges/65206b49b30dfc4e2312/maintainability)](https://codeclimate.com/github/scott-the-programmer/backstage-plugin-spacelift/maintainability)

backstage-plugin-spacelift: [![npm version](https://badge.fury.io/js/%40scott-the-programmer%2Fbackstage-plugin-spacelift.svg)](https://www.npmjs.com/package/@scott-the-programmer/backstage-plugin-spacelift)

backstage-plugin-spacelift-backend: [![npm version](https://badge.fury.io/js/%40scott-the-programmer%2Fbackstage-plugin-spacelift-backend.svg)](https://www.npmjs.com/package/@scott-the-programmer/backstage-plugin-spacelift-backend)

A backstage plugin for spacelift, cobbled together one Sunday afternoon by @scott-the-programmer using ChatGPT

This repository contains two Backstage plugins for integrating with the Spacelift platform:

- `spacelift`: a plugin that displays a table of all Spacelift stacks and runs
- `spacelift-api`: a plugin that provides a simple wrapper for the Spacelift API.

![Stacks](https://raw.githubusercontent.com/scott-the-programmer/backstage-plugin-spacelift/main/docs/stacks.png)

![Runs](https://raw.githubusercontent.com/scott-the-programmer/backstage-plugin-spacelift/main/docs/runs.png)

## Installation

To use these plugins, you'll first need to install them in your Backstage app.

```console
yarn add @scott-the-programmer/backstage-plugin-spacelift @scott-the-programmer/backstage-plugin-spacelift-backend
```

### Backend

Create the following file under `packages/backend/src/plugins/spacelift.ts`

```typescript
import { createRouter } from '@scott-the-programmer/backstage-plugin-spacelift-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({ logger: logger, config: config });
}
```

Add the following snippets to `packages/backend/src/index.ts`

```typescript
import spacelift from './plugins/spacelift';
...
const spaceliftEnv = useHotMemoize(module, () => createEnv('spacelift'));
...
  apiRouter.use('/spacelift', await spacelift(spaceliftEnv));
```

### Frontend

Add the following snippets to packages/app/src/App.tsx

```tsx
import { SpaceliftPage } from '@scott-the-programmer/backstage-plugin-spacelift';
...
<Route path="/spacelift" element={<SpaceliftPage />} />
```

Add the following snippets to Root.tsx to add spacelift to the home sidebar

```tsx
<SidebarItem icon={LibraryBooks} to="spacelift" text="Spacelift" />
```

### Config

Add the following config to your app-config.yaml

```
spacelift:
  org: your-spacelift-org
  id: your-spacelift-id
  secret: your-spacelift-secret
```

## Contributing
We appreciate your interest in contributing to our project! To ensure a smooth contribution process, please follow the guidelines below.

Please be patient while waiting for your pull request to be reviewed. We'll do our best to provide feedback as soon as possible.

Thank you for contributing!

### Getting Started
Fork the repository to your own GitHub account.

Clone the forked repository to your local machine:

```console
git clone https://github.com/<your-username>/backstage-plugin-spacelift.git
```

Add the original repository as a remote called 'upstream':

```console
git remote add upstream https://github.com/scott-the-programmer/backstage-plugin-spacelift.git
```

### Install Dependencies

Install the frontend dependencies:

```console
make install-frontend
```
Install the backend dependencies:

```console
make install-backend
```

### Development

Run the frontend development server:

```console
make run-frontend
```

Run the backend development server:

```console
make run-backend
```

Testing and Linting
Run the frontend tests:

```console
make test-frontend
```

Run the backend tests:

```console
make test-backend
```

Lint the frontend code:

```console
make lint-frontend
```

Lint the backend code:

```console
make lint-backend
```

Automatically fix linting issues in the frontend code:

```console
make fix-frontend
```

Automatically fix linting issues in the backend code:

```console
make fix-backend
```
