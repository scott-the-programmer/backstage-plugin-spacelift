import fetch from 'node-fetch';
import { request, gql } from 'graphql-request';
import jwt, {JwtPayload} from 'jsonwebtoken';

class SpaceliftApiClient {
  private apiUrl: string;
  private clientId: string;
  private clientSecret: string;
  private apiToken?: string;

  constructor(org: string, clientId: string, clientSecret: string) {
    this.apiUrl = `https://${org}.app.spacelift.io`;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getSpaceliftToken(): Promise<string> {
    const getSpaceliftTokenMutation = gql`
      mutation GetSpaceliftToken($keyId: ID!, $keySecret: String!) {
        apiKeyUser(id: $keyId, secret: $keySecret) {
          id
          jwt
        }
      }
    `;

    const variables = {
      keyId: this.clientId,
      keySecret: this.clientSecret,
    };

    try {
      const response = await request<any>(
        `${this.apiUrl}/graphql`,
        getSpaceliftTokenMutation,
        variables,
      );
      return response.apiKeyUser.jwt;
    } catch (error) {
      console.error('Error fetching JWT:', error);
      throw error;
    }
  }

  async getApiToken(): Promise<string> {
    if (!this.apiToken || (await this.isTokenExpired(this.apiToken))) {
      this.apiToken = await this.getSpaceliftToken();
    }
    return this.apiToken;
  }

  async setApiToken(token: string) {
    this.apiToken = token;
  }

  isJwtPayload(payload: unknown): payload is JwtPayload {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'exp' in payload &&
      typeof (payload as JwtPayload).exp === 'number'
    );
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const decoded = jwt.decode(token, { complete: true, json: true });
      if (decoded && decoded.payload && this.isJwtPayload(decoded.payload)) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return currentTimestamp >= decoded.payload.exp!;
      }
      return false;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      throw error;
    }
  }
  async fetchRuns(stackId: string) {
    const apiToken = await this.getApiToken();

    const response = await fetch(`${this.apiUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        query: `
          { 
            stack(id: "${stackId}")
            {
              id
              runs { id,  branch, state, createdAt, commit { url, authorName,timestamp, hash}}
            }
          }
          `,
      }),
    });

    const { data } = await response.json();
    return data.stack.runs;
  }

  async fetchStacks() {
    const apiToken = await this.getApiToken();

    const response = await fetch(`${this.apiUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        query: `
        { 
          stacks
          {
            id
            name,
            description,
            apiHost,
            branch,
            repository,
            projectRoot,
            namespace,	
            space,
            state,
          }
        }
        `,
      }),
    });

    const { data } = await response.json();
    return data.stacks;
  }

  getSpaceliftUrl() {
    const url = {
      url: this.apiUrl,
    };
    return url;
  }
}

export default SpaceliftApiClient;
