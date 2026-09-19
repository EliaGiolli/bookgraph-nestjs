// Duration strings in the "<number><unit>" form accepted by @nestjs/jwt's
// `expiresIn`. Exported so the env schema can reject malformed values at
// bootstrap instead of letting JwtModule fail on the first signed token.
export const DURATION_PATTERN = /^(\d+)(s|m|h|d)$/;

const UNIT_IN_MS = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
} as const;

type DurationUnit = keyof typeof UNIT_IN_MS;

// Narrower than `string`, and structurally compatible with the `StringValue`
// that @nestjs/jwt expects for `signOptions.expiresIn`.
export type Duration = `${number}${DurationUnit}`;

// Converts '60s' / '15m' / '1d' into milliseconds, so the login cookie can be
// given the same lifetime as the JWT it carries.
export function durationToMs(duration: string): number {
  const match = DURATION_PATTERN.exec(duration);

  if (!match) {
    throw new Error(
      `Invalid duration "${duration}". Expected a value like "60s", "15m", "2h" or "1d".`,
    );
  }

  return Number(match[1]) * UNIT_IN_MS[match[2] as DurationUnit];
}
