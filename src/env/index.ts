import { z } from 'zod';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'test') config({ path: '.env.test' });
else config({ path: '.env.dev' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test']).default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_CLIENT: z.enum(['sqlite3']).default('sqlite3'),
  DATABASE_URL: z.string(),
});

const parsedSchema = envSchema.safeParse(process.env);

if (!parsedSchema.success) {
  const errors = parsedSchema.error.format();
  console.log(errors);

  throw new Error(`Missing environment variables`);
}

export const env = parsedSchema.data;
