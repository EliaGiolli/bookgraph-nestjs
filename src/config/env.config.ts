import { EnvSchema } from "../lib/schemas/env.schema.js";

export const env = EnvSchema.parse({
    PORT: process.env.PORT,
});