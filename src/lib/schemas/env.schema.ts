import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

  JWT_SECRET: z.coerce
    .string()
    .min(32, { message: 'JWT_SECRET must be at least 32 characters long' }),

  DB_HOST: z.coerce
    .string()
    .default('localhost'),

  DB_PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(5432),

  DB_USERNAME: z.coerce
    .string()
    .min(1, { message: 'DB_USERNAME is required' }),

  DB_PASSWORD: z.coerce
    .string()
    .min(1, { message: 'DB_PASSWORD is required' }),

  DB_NAME: z.coerce
    .string()
    .min(1, { message: 'DB_NAME is required' }),
});

export type Env = z.infer<typeof EnvSchema>;