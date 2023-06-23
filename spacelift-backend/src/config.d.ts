export interface Config {
  spacelift: {
    /**
     * The organization name in Spacelift.
     * @visibility backend
     */
    org: string;

    /**
     * The client ID for the Spacelift API.
     * @visibility backend
     */
    id: string;

    /**
     * Spacelift API token.
     * @visibility secret
     */
    secret: string;
  }
}