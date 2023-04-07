import React from 'react';
import {
  render as rtlRender,
  waitFor,
  screen,
  act,
} from '@testing-library/react';
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

const Wrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => <ApiProvider apis={apiRegistry}>{children}</ApiProvider>;

const customRender = (ui: React.ReactElement, options?: any) =>
  rtlRender(ui, { wrapper: Wrapper, ...options });

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

    await act(async () => {
      customRender(<SpaceliftRuns stackId="stack" url="url" />);
    });

    await waitFor(() =>
      expect(mockSpaceliftApi.getRuns).toHaveBeenCalledTimes(1),
    );

    await waitFor(() => {
      expect(screen.getByText('Runs')).toBeInTheDocument();
      expect(screen.getByText('FINISHED')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: mockRuns[0].commit.hash.slice(0, 7) }),
      ).toHaveAttribute('href', 'https://github.com/some/project/commit');
      expect(screen.getByText('author')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: mockRuns[0].commit.hash.slice(0, 7) }),
      ).toBeInTheDocument();
    });
  });
});
