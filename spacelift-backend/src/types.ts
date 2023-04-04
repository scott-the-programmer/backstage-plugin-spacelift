// plugins/spacelift-backend/src/types.ts
import { Logger } from 'winston';
import { Config } from '@backstage/config';

export interface PluginEnvironment {
  logger: Logger;
  config: Config;
}
