import {
  createServiceBuilder,
  loadBackendConfig,
} from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'spacelift-backend' });
  logger.debug('Starting application server...');
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: logger,
  });
  const router = await createRouter({
    logger: logger,
    config: config,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/spacelift', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
