import { EnvSchema } from './env.schema.js';

const baseEnv = {
  JWT_SECRET: 'a'.repeat(32),
  DB_USERNAME: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_NAME: 'bookgraph',
};

describe('EnvSchema', () => {
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
