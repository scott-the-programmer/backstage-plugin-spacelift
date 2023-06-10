import fetch from 'node-fetch';
import { request, gql } from 'graphql-request';

interface SpaceliftTokenClaims {
  aud: string[];
  exp: number;
  jti: string;
  iat: number;
  iss: string;
  nbf: number;
  sub: string;
  adm: boolean;
  avt: string;
  cip: string;
  psa: string;
  IsMachineUser: boolean;
  AwaitsEmailConfirmation: boolean;
  subdomain: string;
}

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
    if (!this.apiToken || this.isTokenExpired(this.apiToken)) {
      this.apiToken = await this.getSpaceliftToken();
    }
    return this.apiToken;
  }

  async setApiToken(token: string) {
    this.apiToken = token;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeSpaceliftToken(token);
      if (decoded) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return currentTimestamp >= decoded.exp;
      }
      return false;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      throw error;
    }
  }

  // Spacelift signs their token against a self-signed certificate,
  // so we can't verify the integrity. Instead, let's just decode the payload
  // and check the expiration date ourselves.
  decodeSpaceliftToken(token: string): SpaceliftTokenClaims | null {
    try {
      const payloadBase64Url = token.split('.')[1];
      const payloadBase64 = payloadBase64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      const claims = <SpaceliftTokenClaims>JSON.parse(payloadJson);
      return claims;
    } catch (error) {
      console.error('Error decoding JWT payload:', error);
      return null;
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
              runs { 
                id, 
                branch, 
                state, 
                createdAt, 
                commit 
                { 
                  url, 
                  authorName,
                  timestamp, 
                  hash
                }
              }
            }
          }
          `,
      }),
    });

    const { data } = await response.json() as any;
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

    const { data } = await response.json() as any;
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
