import { Router } from "express";
import { ConfigReader } from "@backstage/config";
import { createSpaceliftRouter } from "./spacelift-router";
import SpaceliftApiClient from "./spacelift/spacelift-api-client";
import request from "supertest";
import express from "express";

jest.mock("./spacelift/spacelift-api-client");

const mockSpaceliftApiClient = SpaceliftApiClient as jest.MockedClass<
  typeof SpaceliftApiClient
>;

describe("SpaceliftRouter", () => {
  let app: express.Express;
  let config: ConfigReader;
  let router: Router;

  beforeEach(() => {
    config = new ConfigReader({
      spacelift: {
        org: "test-org",
        id: "test-id",
        secret: "test-secret",
      },
    });
    router = createSpaceliftRouter(config);
    app = express().use(router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("GET /projects returns projects list", async () => {
    const projects = [{ id: "project-1" }, { id: "project-2" }];
    mockSpaceliftApiClient.prototype.fetchStacks.mockImplementation(() =>
      Promise.resolve(projects)
    );

    const response = await request(app).get("/projects");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(projects);
  });

  test("GET /projects returns error on fetch failure", async () => {
    mockSpaceliftApiClient.prototype.fetchStacks.mockImplementation(() =>
      Promise.reject(new Error("Test error"))
    );

    const response = await request(app).get("/projects");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error fetching projects" });
  });

  test("GET /url returns spacelift url", async () => {
    const url = "https://example.com/spacelift";
    mockSpaceliftApiClient.prototype.getSpaceliftUrl.mockImplementation(() => {
      return { url: url };
    });

    const response = await request(app).get("/url");

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual({ url: url });
  });

  test("GET /url returns error on fetch failure", async () => {
    mockSpaceliftApiClient.prototype.getSpaceliftUrl.mockImplementation(() => {
      throw new Error("Test error");
    });

    const response = await request(app).get("/url");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error retrieving spacelift url" });
  });

  test("GET /runs/:stackId returns runs for a given stack", async () => {
    const runs = [{ id: "run-1" }, { id: "run-2" }];
    mockSpaceliftApiClient.prototype.fetchRuns.mockImplementation(() =>
      Promise.resolve(runs)
    );
    const stackId = "stack-1";

    const response = await request(app).get(`/runs/${stackId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(runs);
    expect(mockSpaceliftApiClient.prototype.fetchRuns).toHaveBeenCalledWith(
      stackId
    );
  });

  test("GET /runs/:stackId returns error on fetch failure", async () => {
    mockSpaceliftApiClient.prototype.fetchRuns.mockImplementation(() =>
      Promise.reject(new Error("Test error"))
    );
    const stackId = "stack-1";

    const response = await request(app).get(`/runs/${stackId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error retrieving spacelift url" });
  });
});
