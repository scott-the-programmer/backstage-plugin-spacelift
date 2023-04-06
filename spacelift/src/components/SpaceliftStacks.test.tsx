import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TestApiRegistry } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';

import { spaceliftApiRef, SpaceliftApi } from '../api/spaceliftApi';
import { SpaceliftStacks } from './SpaceliftStacks';

const mockSpaceliftApi: jest.Mocked<SpaceliftApi> = {
  getProjects: jest.fn(),
  getUrl: jest.fn(),
  getRuns: jest.fn(),
};

const apiRegistry = TestApiRegistry.from([spaceliftApiRef, mockSpaceliftApi]);

const Wrapper: React.FC = ({}) => (
  <ApiProvider apis={apiRegistry}>{}</ApiProvider>
);

describe('Spacelift Stacks', () => {
  beforeEach(() => {
    mockSpaceliftApi.getProjects.mockReset();
    mockSpaceliftApi.getUrl.mockReset();
    mockSpaceliftApi.getRuns.mockReset();
  });

  it('renders without crashing and displays project data', async () => {
    const mockProjects = [
      {
        id: '1',
        name: 'Project 1',
        description: 'Test project 1',
        apiHost: 'https://github.com',
        namespace: 'org',
        repository: 'repo',
        branch: 'main',
        state: 'IN_PROGRESS',
      },
      {
        id: '2',
        name: 'Project 2',
        description: 'Test project 2',
        apiHost: 'https://github.com',
        namespace: 'org',
        repository: 'repo',
        branch: 'main',
        state: 'FINISHED',
      },
    ];

    const mockUrl = 'https://spacelift.example.com';

    mockSpaceliftApi.getProjects.mockResolvedValue(mockProjects);
    mockSpaceliftApi.getUrl.mockResolvedValue(mockUrl);
    mockSpaceliftApi.getRuns.mockResolvedValue([]);

    render(<SpaceliftStacks />, { wrapper: Wrapper });

    await waitFor(() =>
      expect(mockSpaceliftApi.getProjects).toHaveBeenCalledTimes(1),
    );
    await waitFor(() =>
      expect(mockSpaceliftApi.getUrl).toHaveBeenCalledTimes(1),
    );

    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test project 1')).toBeInTheDocument();
    expect(screen.getByText('FINISHED')).toBeInTheDocument();
  });
});
