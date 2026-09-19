import { durationToMs } from './duration.util.js';

describe('durationToMs', () => {
  it.each([
    ['60s', 60_000],
    ['15m', 900_000],
    ['2h', 7_200_000],
    ['1d', 86_400_000],
  ])('converts %s to %d ms', (duration, expected) => {
    expect(durationToMs(duration)).toBe(expected);
  });

  it.each(['', '1', '1w', 'd1', '1.5d', '-1d', '1 d'])(
    'throws on the malformed value %j',
    (duration) => {
      expect(() => durationToMs(duration)).toThrow(/Invalid duration/);
    },
  );
});
