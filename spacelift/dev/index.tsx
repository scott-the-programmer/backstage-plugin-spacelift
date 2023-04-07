import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { spaceliftApiRef } from '../src/api/spaceliftApi';
import { discoveryApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import { spaceliftPlugin, SpaceliftPage } from '../src/plugin';
import { FakeSpaceliftApi } from './fake-spacelift-api';

class StaticDiscoveryApi implements DiscoveryApi {
  async getBaseUrl(_: string): Promise<string> {
    return 'http://localhost:7007/spacelift';
  }
}

const discoveryApi = new StaticDiscoveryApi();

createDevApp()
  .registerPlugin(spaceliftPlugin)
  .registerApi({
    api: spaceliftApiRef,
    deps: { discoveryApi: discoveryApiRef },
    factory: () => new FakeSpaceliftApi(),
  })
  .registerApi({
    api: discoveryApiRef,
    deps: {},
    factory: () => discoveryApi,
  })
  .addPage({
    element: <SpaceliftPage />,
    title: 'Spacelift',
    path: '/spacelift',
  })
  .render();
