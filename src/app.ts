import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { UsersRoute } from './routes/users.route';

const app = fastify();

app.register(cookie);

app.register(UsersRoute, { prefix: 'users' });

export { app };
