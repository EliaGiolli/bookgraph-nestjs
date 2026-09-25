import { EnvSchema } from './env.schema.js';

const baseEnv = {
  JWT_SECRET: 'a'.repeat(32),
  DB_USERNAME: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_NAME: 'bookgraph',
};

describe('EnvSchema', () => {
  describe('NODE_ENV', () => {
    it('defaults to development when unset', () => {
      expect(EnvSchema.parse({ ...baseEnv }).NODE_ENV).toBe('development');
    });

    it.each(['development', 'production', 'test'])('accepts %s', (value) => {
      expect(EnvSchema.parse({ ...baseEnv, NODE_ENV: value }).NODE_ENV).toBe(value);
    });

    it('rejects an unrecognised environment name', () => {
      // Fails loudly rather than silently behaving as non-production.
      expect(() => EnvSchema.parse({ ...baseEnv, NODE_ENV: 'staging' })).toThrow();
    });

    it('is declared by the schema, so it survives parsing', () => {
      // EnvSchema.parse strips undeclared keys; SQL logging and the cookie
      // Secure flag both read NODE_ENV, so it must be declared.
      expect(EnvSchema.parse({ ...baseEnv, NODE_ENV: 'production' })).toHaveProperty(
        'NODE_ENV',
        'production',
      );
    });
  });

  describe('JWT_EXPIRATION', () => {
    it('defaults to 1d when unset', () => {
      expect(EnvSchema.parse({ ...baseEnv }).JWT_EXPIRATION).toBe('1d');
    });

    it('keeps a configured duration', () => {
      expect(
        EnvSchema.parse({ ...baseEnv, JWT_EXPIRATION: '15m' }).JWT_EXPIRATION,
      ).toBe('15m');
    });

    it('fails at bootstrap on a malformed duration', () => {
      // Caught here rather than at the first signed token.
      expect(() => EnvSchema.parse({ ...baseEnv, JWT_EXPIRATION: '1 week' })).toThrow();
    });
  });
});
