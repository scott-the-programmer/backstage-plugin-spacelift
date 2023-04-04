import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SpaceliftRuns } from './SpaceliftRuns';
import { TestApiRegistry } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';

import { spaceliftApiRef, SpaceliftApi } from '../api/spaceliftApi';

const mockSpaceliftApi: jest.Mocked<SpaceliftApi> = {
  getProjects: jest.fn(),
  getUrl: jest.fn(),
  getRuns: jest.fn(),
};

const apiRegistry = TestApiRegistry.from([spaceliftApiRef, mockSpaceliftApi]);

const Wrapper: React.FC = ({ children }) => (
  <ApiProvider apis={apiRegistry}>{children}</ApiProvider>
);

describe('Spacelift Runs', () => {
  beforeEach(() => {
    mockSpaceliftApi.getProjects.mockReset();
    mockSpaceliftApi.getUrl.mockReset();
    mockSpaceliftApi.getRuns.mockReset();
  });

  it('renders without crashing and displays run data', async () => {
    const mockRuns = [
      {
        id: '01GWXM7RTNM3PZZG9BWJ4SADVH',
        branch: '-',
        state: 'FINISHED',
        createdAt: 1680326517,
        commit: {
          url: 'https://github.com/some/project/commit',
          authorName: 'author',
          timestamp: 1639474722,
          hash: 'some-commit',
        },
      },
    ];

    mockSpaceliftApi.getRuns.mockResolvedValue(mockRuns);

    render(<SpaceliftRuns stackId="stack" url="url" />, { wrapper: Wrapper });

    await waitFor(() =>
      expect(mockSpaceliftApi.getRuns).toHaveBeenCalledTimes(1),
    );

    setTimeout(() => {
      expect(screen.getByText('Runs')).toBeInTheDocument();
      expect(
        screen.getByText('01GWXM7RTNM3PZZG9BWJ4SADVH'),
      ).toBeInTheDocument();
      expect(screen.getByText('FINISHED')).toBeInTheDocument();
      expect(
        screen.getByText('https://github.com/some/project/commit'),
      ).toBeInTheDocument();
      expect(screen.getByText('author')).toBeInTheDocument();
      expect(screen.getByText('some-commit')).toBeInTheDocument();
    }, 200);
  });
});
