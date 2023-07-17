import { knex as setup, Knex } from 'knex';
import { env } from '../env';

const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
  },
  useNullAsDefault: true,
};

const knex = setup(config);

export { knex, config };
