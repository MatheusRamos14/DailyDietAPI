import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import supertest from 'supertest';
import { execSync } from 'node:child_process';

import { app } from '../src/app';

describe('Users operations', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('yarn knex -- migrate:rollback --all');
    execSync('yarn knex -- migrate:latest');
  });

  it('should be able to list all users', async () => {
    await supertest(app.server).get('/users').expect(200);
  });
});
