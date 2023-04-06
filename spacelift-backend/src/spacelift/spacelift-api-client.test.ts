import jwt from 'jsonwebtoken';
import SpaceliftApiClient from './spacelift-api-client';

// Mock the `fetch` and `request` functions
jest.mock('node-fetch', () => jest.fn());
jest.mock('graphql-request', () => ({
  gql: jest.fn(str => str),
  request: jest.fn(),
}));

const fetch = require('node-fetch');
const { request } = require('graphql-request');

describe('SpaceliftApiClient', () => {
  const org = 'test-org';
  const clientId = 'test-client-id';
  const clientSecret = 'test-client-secret';

  beforeEach(() => {
    fetch.mockReset();
    request.mockReset();
  });

  test('getSpaceliftToken', async () => {
    const mockJwt = 'test-jwt';
    request.mockResolvedValue({ apiKeyUser: { jwt: mockJwt } });

    const client = new SpaceliftApiClient(org, clientId, clientSecret);
    const newJwt = await client.getSpaceliftToken();

    expect(newJwt).toBe(mockJwt);
    expect(request).toHaveBeenCalledTimes(1);
  });

  test('fetchRuns', async () => {
    const mockApiToken = 'test-api-token';
    const mockRuns = [
      {
        id: 'run-1',
        branch: 'main',
        state: 'completed',
        createdAt: '2023-04-01T00:00:00Z',
      },
    ];
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: { stack: { runs: mockRuns } } }),
    });
    request.mockResolvedValue({ apiKeyUser: { jwt: mockApiToken } });

    const client = new SpaceliftApiClient(org, clientId, clientSecret);
    const runs = await client.fetchRuns('stack-1');

    expect(runs).toEqual(mockRuns);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('fetchStacks', async () => {
    const mockApiToken = 'test-api-token';
    const mockStacks = [{ id: 'stack-1', name: 'test-stack' }];
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: { stacks: mockStacks } }),
    });
    request.mockResolvedValue({ apiKeyUser: { jwt: mockApiToken } });

    const client = new SpaceliftApiClient(org, clientId, clientSecret);
    const stacks = await client.fetchStacks();

    expect(stacks).toEqual(mockStacks);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('fetchRuns does not use expired JWT', async () => {
    const expiredToken = jwt.sign({}, 'secret', { expiresIn: '-1s' });
    const validToken = jwt.sign({}, 'secret', { expiresIn: '1h' });
    request.mockResolvedValueOnce({ apiKeyUser: { jwt: validToken } });

    const mockRuns = [
      {
        id: 'run-1',
        branch: 'main',
        state: 'completed',
        createdAt: '2023-04-01T00:00:00Z',
      },
    ];
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: { stack: { runs: mockRuns } } }),
    });

    const client = new SpaceliftApiClient(org, clientId, clientSecret);
    client.setApiToken(expiredToken);
    const runs = await client.fetchRuns('stack-1');

    expect(runs).toEqual(mockRuns);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledTimes(1);
  });

  test('fetchRuns does not rerequest on valid token', async () => {
    const validToken = jwt.sign({}, 'secret', { expiresIn: '1h' });
    request.mockResolvedValueOnce({ apiKeyUser: { jwt: validToken } });

    const mockRuns = [
      {
        id: 'run-1',
        branch: 'main',
        state: 'completed',
        createdAt: '2023-04-01T00:00:00Z',
      },
    ];
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: { stack: { runs: mockRuns } } }),
    });

    const client = new SpaceliftApiClient(org, clientId, clientSecret);
    client.setApiToken(validToken);
    const runs = await client.fetchRuns('stack-1');

    expect(runs).toEqual(mockRuns);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledTimes(0);
  });

  test('fetchStacks does not use expired JWT', async () => {
    const expiredToken = jwt.sign({}, 'secret', { expiresIn: '-1s' });
    const validToken = jwt.sign({}, 'secret', { expiresIn: '1h' });
    request.mockResolvedValueOnce({ apiKeyUser: { jwt: validToken } });

    const mockStacks = [{ id: 'stack-1', name: 'test-stack' }];
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: { stacks: mockStacks } }),
    });

    const client = new SpaceliftApiClient(org, clientId, clientSecret);
    client.setApiToken(expiredToken);
    const stacks = await client.fetchStacks();

    expect(stacks).toEqual(mockStacks);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledTimes(1);
  });

  test('fetchStacks does not rerequest on valid token', async () => {
    const validToken = jwt.sign({}, 'secret', { expiresIn: '1h' });
    request.mockResolvedValueOnce({ apiKeyUser: { jwt: validToken } });

    const mockStacks = [{ id: 'stack-1', name: 'test-stack' }];
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: { stacks: mockStacks } }),
    });

    const client = new SpaceliftApiClient(org, clientId, clientSecret);
    client.setApiToken(validToken);
    const stacks = await client.fetchStacks();

    expect(stacks).toEqual(mockStacks);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledTimes(0);
  });
});
