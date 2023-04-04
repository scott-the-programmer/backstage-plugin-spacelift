import { Router } from 'express';
import { Config } from '@backstage/config';
import SpaceliftApiClient from './spacelift/spacelift-api-client';

export function createSpaceliftRouter(config: Config): Router {
  const router = Router();
  const spaceliftClient = new SpaceliftApiClient(
    config.getOptionalString('spacelift.org') || process.env.SPACELIFT_ORG!,
    config.getOptionalString('spacelift.id') || process.env.SPACELIFT_ID!,
    config.getOptionalString('spacelift.secret') ||
      process.env.SPACELIFT_SECRET!,
  );

  router.get('/projects', async (_, res) => {
    try {
      const projects = await spaceliftClient.fetchStacks();
      res.send(projects);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Error fetching projects' });
    }
  });

  router.get('/url', async (_, res) => {
    try {
      const projects = await spaceliftClient.getSpaceliftUrl();
      res.send(projects);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Error retrieving spacelift url' });
    }
  });

  router.get('/runs/:stackId', async (req, res) => {
    const { stackId } = req.params;

    try {
      const projects = await spaceliftClient.fetchRuns(stackId);
      res.send(projects);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Error retrieving spacelift url' });
    }
  });

  return router;
}
