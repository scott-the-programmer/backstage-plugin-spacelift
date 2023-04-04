import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';

export const spaceliftApiRef = createApiRef<SpaceliftApi>({
  id: 'plugin.spacelift.service',
});

export interface SpaceliftApi {
  getProjects(): Promise<any[]>;
  getUrl(): Promise<string>;
  getRuns(stackId: string): Promise<any[]>;
}

export class SpaceliftApiClient implements SpaceliftApi {
  private discoveryApi: DiscoveryApi;

  constructor(discoveryApi: DiscoveryApi) {
    this.discoveryApi = discoveryApi;
  }

  async getProjects(): Promise<any[]> {
    const url = await this.discoveryApi.getBaseUrl('spacelift');
    try {
      const response = await fetch(`${url}/projects`);
      if (!response.ok) {
        return [];
      }
      const res = await response.json();
      return res;
    } catch (error) {
      return [];
    }
  }
  async getUrl(): Promise<string> {
    const url = await this.discoveryApi.getBaseUrl('spacelift');
    try {
      const response = await fetch(`${url}/url`);
      return (await response.json()).url;
    } catch (error) {
      return '';
    }
  }

  async getRuns(stackId: string): Promise<any[]> {
    const url = await this.discoveryApi.getBaseUrl('spacelift');
    try {
      const response = await fetch(`${url}/runs/${stackId}`);
      if (!response.ok) {
        return [];
      }
      const res = await response.json();
      return res;
    } catch (error) {
      return [];
    }
  }
}
