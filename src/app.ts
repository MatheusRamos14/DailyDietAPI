import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { UsersRoute } from './routes/users.route';
import { getUserSession } from './middlewares/getUserSession';
import { MealsRouter } from './routes/meals.route';

const app = fastify();

app.register(cookie);

app.register(UsersRoute, { prefix: 'users' });

app.addHook('preHandler', getUserSession);

app.register(MealsRouter, { prefix: 'meals' });

export { app };
