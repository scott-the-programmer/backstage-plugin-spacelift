import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { createSpaceliftRouter } from '../spaceliftApi';

export async function createRouter(env: PluginEnvironment): Promise<Router> {
  const router = Router();

  const spaceliftRouter = await createSpaceliftRouter(env.config);
  router.use('/', spaceliftRouter);

  return router;
}
