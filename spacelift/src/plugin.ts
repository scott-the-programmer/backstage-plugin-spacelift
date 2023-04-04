import {
  createPlugin,
  createApiFactory,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { SpaceliftApiClient, spaceliftApiRef } from './api/spaceliftApi';

import { rootRouteRef } from './routes';

export const spaceliftPlugin = createPlugin({
  id: 'spacelift',
  apis: [
    createApiFactory({
      api: spaceliftApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new SpaceliftApiClient(discoveryApi),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const SpaceliftPage = spaceliftPlugin.provide(
  createRoutableExtension({
    name: 'SpaceliftPage',
    component: () => import('./components/Spacelift').then(m => m.Spacelift),
    mountPoint: rootRouteRef,
  }),
);
