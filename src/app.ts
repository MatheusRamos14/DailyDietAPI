import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/users', async () => {
  const users = knex('users').select();

  return users;
});

export { app };
