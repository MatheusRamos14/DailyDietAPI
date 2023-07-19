import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';

export async function UsersRoute(app: FastifyInstance) {
  app.get('/', async () => {
    const users = knex('users').select();

    return users;
  });

  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const { email, name } = createUserSchema.parse(request.body);

    const userId = await knex('users')
      .insert({
        email,
        name,
      })
      .returning('id');

    reply.setCookie('userId', String(userId[0].id), {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return reply.status(201).send();
  });
}
