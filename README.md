# Spacelift Backstage Plugins

[![Maintainability](https://api.codeclimate.com/v1/badges/65206b49b30dfc4e2312/maintainability)](https://codeclimate.com/github/scott-the-programmer/backstage-plugin-spacelift/maintainability)

backstage-plugin-spacelift: [![npm version](https://badge.fury.io/js/%40scott-the-programmer%2Fbackstage-plugin-spacelift.svg)](https://www.npmjs.com/package/@scott-the-programmer/backstage-plugin-spacelift)

backstage-plugin-spacelift-backend: [![npm version](https://badge.fury.io/js/%40scott-the-programmer%2Fbackstage-plugin-spacelift-backend.svg)](https://www.npmjs.com/package/@scott-the-programmer/backstage-plugin-spacelift-backend)

An unofficial Backstage plugin for [Spacelift](https://spacelift.io) to view statuses of runs and stacks through [Backstage](https://backstage.io)

This repository contains two Backstage plugins for integrating with the Spacelift platform:

- `spacelift`: a plugin that displays a table of all Spacelift stacks and runs
- `spacelift-backend`: a plugin that provides a simple wrapper for the Spacelift API.

*Disclaimer: I do not work for Spacelift.io. I am simply interested in the tool and want to make a part of it accessible by backstage*

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

Feel free to contribute to this project in any shape or form, whether it's raising issues, feature requests, or even creating PRs yourself. 

Any help is appreciated!

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
