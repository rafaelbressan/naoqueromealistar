import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import {
  DURATION,
  EASE,
  EASE_KEYWORD,
  DISTANCE,
  SCALE,
  BLUR,
  STACK,
  SWIPE,
} from '@/lib/motion';

/**
 * The motion scale lives in two places by necessity: CSS custom properties for
 * anything CSS drives, and plain numbers in lib/motion.ts because Framer Motion
 * cannot read var(). Nothing stops the two from drifting apart except this
 * file.
 *
 * The failure mode it guards against is quiet: someone retunes
 * --duration-fast in CSS, lib/motion.ts keeps the old value, and half the UI
 * animates off-tempo forever. Too small to spot in isolation, big enough to
 * make the app feel unsystematic.
 */

const CSS_PATH = path.resolve(__dirname, '../app/globals.css');

/**
 * Collect custom properties from top-level `:root` blocks, skipping any
 * at-rule body. That skip is what keeps the reduced-motion block — which
 * zeroes these very tokens — from being read as the real values.
 */
function parseRootTokens(css: string): Record<string, string> {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens: Record<string, string> = {};

  let i = 0;
  while (i < withoutComments.length) {
    const atRule = withoutComments.indexOf('@media', i);
    const rootRule = withoutComments.indexOf(':root', i);

    // No more :root blocks to read.
    if (rootRule === -1) break;

    // An @media comes first — jump over its whole balanced body.
    if (atRule !== -1 && atRule < rootRule) {
      const open = withoutComments.indexOf('{', atRule);
      if (open === -1) break;
      let depth = 1;
      let j = open + 1;
      while (j < withoutComments.length && depth > 0) {
        if (withoutComments[j] === '{') depth++;
        else if (withoutComments[j] === '}') depth--;
        j++;
      }
      i = j;
      continue;
    }

    const open = withoutComments.indexOf('{', rootRule);
    const close = withoutComments.indexOf('}', open);
    if (open === -1 || close === -1) break;

    const body = withoutComments.slice(open + 1, close);
    for (const decl of body.split(';')) {
      const match = decl.match(/^\s*(--[\w-]+)\s*:\s*(.+?)\s*$/);
      if (match) tokens[match[1]] = match[2];
    }

    i = close + 1;
  }

  return tokens;
}

const tokens = parseRootTokens(readFileSync(CSS_PATH, 'utf-8'));

/** Strip a unit suffix and return the number. */
function num(name: string, unit: string): number {
  const raw = tokens[name];
  expect(raw, `${name} is missing from app/globals.css`).toBeDefined();
  expect(
    raw.endsWith(unit),
    `${name} should be expressed in "${unit}" but globals.css has "${raw}"`
  ).toBe(true);
  return parseFloat(raw);
}

/** Assert a TS constant matches its CSS counterpart, naming both on failure. */
function expectMatch(tsPath: string, tsValue: number, cssName: string, cssValue: number) {
  expect(
    tsValue,
    `Motion token drift: ${tsPath} is ${tsValue} but ${cssName} in app/globals.css is ${cssValue}. ` +
      `Update both or neither.`
  ).toBe(cssValue);
}

describe('motion token parity: lib/motion.ts vs app/globals.css', () => {
  describe('durations', () => {
    // CSS holds ms, TS holds seconds. Normalise before comparing.
    const cases: Array<[keyof typeof DURATION, string]> = [
      ['stagger', '--duration-stagger'],
      ['micro', '--duration-micro'],
      ['quick', '--duration-quick'],
      ['fast', '--duration-fast'],
      ['medium', '--duration-medium'],
      ['slow', '--duration-slow'],
      ['verySlow', '--duration-very-slow'],
    ];

    it.each(cases)('DURATION.%s matches %s', (key, cssName) => {
      expectMatch(
        `DURATION.${key}`,
        Math.round(DURATION[key] * 1000),
        cssName,
        num(cssName, 'ms')
      );
    });
  });

  describe('easings', () => {
    const cases: Array<[keyof typeof EASE, string]> = [
      ['smoothOut', '--ease-smooth-out'],
      ['bounce', '--ease-bounce'],
      ['bounceStrong', '--ease-bounce-strong'],
    ];

    it.each(cases)('EASE.%s matches %s', (key, cssName) => {
      const raw = tokens[cssName];
      expect(raw, `${cssName} is missing from app/globals.css`).toBeDefined();

      const points = raw
        .replace(/^cubic-bezier\(/, '')
        .replace(/\)$/, '')
        .split(',')
        .map((p) => parseFloat(p.trim()));

      expect(
        points,
        `Motion token drift: EASE.${key} is [${EASE[key]}] but ${cssName} in ` +
          `app/globals.css is "${raw}". Update both or neither.`
      ).toEqual([...EASE[key]]);
    });
  });

  describe('keyword easings', () => {
    // Names, not curves — compared against the CSS keyword rather than parsed.
    const cases: Array<[keyof typeof EASE_KEYWORD, string, string]> = [
      ['inOut', '--ease-in-out', 'ease-in-out'],
      ['out', '--ease-out', 'ease-out'],
      ['linear', '--ease-linear', 'linear'],
    ];

    it.each(cases)('EASE_KEYWORD.%s matches %s', (key, cssName, cssValue) => {
      expect(
        tokens[cssName],
        `Motion token drift: EASE_KEYWORD.${key} is "${EASE_KEYWORD[key]}" and expects ` +
          `${cssName} to be "${cssValue}", but app/globals.css has "${tokens[cssName]}".`
      ).toBe(cssValue);
    });
  });

  describe('distances', () => {
    const cases: Array<[keyof typeof DISTANCE, string]> = [
      ['micro', '--distance-micro'],
      ['small', '--distance-small'],
      ['base', '--distance-base'],
      ['medium', '--distance-medium'],
      ['large', '--distance-large'],
    ];

    it.each(cases)('DISTANCE.%s matches %s', (key, cssName) => {
      expectMatch(`DISTANCE.${key}`, DISTANCE[key], cssName, num(cssName, 'px'));
    });
  });

  describe('scales', () => {
    const cases: Array<[keyof typeof SCALE, string]> = [
      ['large', '--scale-large'],
      ['medium', '--scale-medium'],
      ['small', '--scale-small'],
      ['tiny', '--scale-tiny'],
    ];

    it.each(cases)('SCALE.%s matches %s', (key, cssName) => {
      expectMatch(`SCALE.${key}`, SCALE[key], cssName, parseFloat(tokens[cssName]));
    });
  });

  describe('blur', () => {
    const cases: Array<[keyof typeof BLUR, string]> = [
      ['small', '--blur-small'],
      ['medium', '--blur-medium'],
      ['large', '--blur-large'],
    ];

    it.each(cases)('BLUR.%s matches %s', (key, cssName) => {
      expectMatch(`BLUR.${key}`, BLUR[key], cssName, num(cssName, 'px'));
    });
  });

  describe('stack', () => {
    it('STACK.perspective matches --stack-perspective', () => {
      expectMatch('STACK.perspective', STACK.perspective, '--stack-perspective', num('--stack-perspective', 'px'));
    });

    it('STACK.zStep matches --stack-z-step', () => {
      expectMatch('STACK.zStep', STACK.zStep, '--stack-z-step', num('--stack-z-step', 'px'));
    });

    it('STACK.yStep matches --stack-y-step', () => {
      expectMatch('STACK.yStep', STACK.yStep, '--stack-y-step', num('--stack-y-step', 'px'));
    });

    it('STACK.rotateStep matches --stack-rotate-step', () => {
      expectMatch('STACK.rotateStep', STACK.rotateStep, '--stack-rotate-step', num('--stack-rotate-step', 'deg'));
    });

    it('STACK.opacityStep matches --stack-opacity-step', () => {
      expectMatch('STACK.opacityStep', STACK.opacityStep, '--stack-opacity-step', parseFloat(tokens['--stack-opacity-step']));
    });

    it('STACK.depth matches --stack-depth', () => {
      expectMatch('STACK.depth', STACK.depth, '--stack-depth', parseFloat(tokens['--stack-depth']));
    });
  });

  describe('swipe', () => {
    it('SWIPE.commitX matches --swipe-commit-x', () => {
      expectMatch('SWIPE.commitX', SWIPE.commitX, '--swipe-commit-x', num('--swipe-commit-x', 'px'));
    });

    it('SWIPE.commitV matches --swipe-commit-v', () => {
      expectMatch('SWIPE.commitV', SWIPE.commitV, '--swipe-commit-v', parseFloat(tokens['--swipe-commit-v']));
    });

    it('SWIPE.rotateMax matches --swipe-rotate-max', () => {
      expectMatch('SWIPE.rotateMax', SWIPE.rotateMax, '--swipe-rotate-max', num('--swipe-rotate-max', 'deg'));
    });
  });
});

/**
 * Extract the declarations inside the prefers-reduced-motion block.
 * Complements parseRootTokens, which deliberately skips it.
 */
function parseReducedMotionTokens(css: string): Record<string, string> {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const start = withoutComments.indexOf('@media (prefers-reduced-motion: reduce)');
  if (start === -1) return {};

  const open = withoutComments.indexOf('{', start);
  let depth = 1;
  let i = open + 1;
  while (i < withoutComments.length && depth > 0) {
    if (withoutComments[i] === '{') depth++;
    else if (withoutComments[i] === '}') depth--;
    i++;
  }

  const body = withoutComments.slice(open + 1, i - 1);
  const out: Record<string, string> = {};
  for (const decl of body.split(';')) {
    const match = decl.match(/\s*(--[\w-]+)\s*:\s*([^;{}]+?)\s*$/);
    if (match) out[match[1]] = match[2];
  }
  return out;
}

const reducedTokens = parseReducedMotionTokens(readFileSync(CSS_PATH, 'utf-8'));

describe('reduced motion coverage', () => {
  /*
   * Reduced motion strips decoration, never function — see RISK 4. What is
   * asserted here is that nothing new can be added to the scale and quietly
   * skip the guard: every duration declared in :root has to be answered in
   * the reduce block, or someone's next token animates at full speed for a
   * user who asked for stillness.
   */
  const durationTokens = Object.keys(tokens).filter((t) => t.startsWith('--duration-'));

  it('declares at least one duration to check', () => {
    expect(durationTokens.length).toBeGreaterThan(0);
  });

  it.each(durationTokens)('%s is zeroed under reduced motion', (name) => {
    expect(
      reducedTokens[name],
      `${name} is not overridden in the prefers-reduced-motion block of ` +
        `app/globals.css. Every duration token must be answered there.`
    ).toBe('0ms');
  });

  it.each(['--blur-small', '--blur-medium', '--blur-large'])(
    '%s is zeroed under reduced motion',
    (name) => {
      expect(reducedTokens[name]).toBe('0px');
    }
  );

  it.each(['--stack-rotate-step', '--swipe-rotate-max'])(
    '%s is zeroed under reduced motion',
    (name) => {
      expect(reducedTokens[name]).toBe('0deg');
    }
  );

  it('keeps the swipe commit thresholds intact', () => {
    // Swiping is an input method. Zeroing these would make the gesture either
    // impossible or hair-trigger, which is not what "less motion" means.
    expect(reducedTokens['--swipe-commit-x']).toBeUndefined();
    expect(reducedTokens['--swipe-commit-v']).toBeUndefined();
  });
});

describe('parseRootTokens', () => {
  it('ignores the reduced-motion block, which zeroes the same tokens', () => {
    // If the @media body leaked in, every duration would read 0ms and the
    // parity suite above would pass against meaningless values.
    expect(tokens['--duration-fast']).toBe('250ms');
    expect(tokens['--blur-small']).toBe('2px');
    expect(tokens['--swipe-rotate-max']).toBe('12deg');
  });

  it('still reads non-motion :root properties', () => {
    expect(tokens['--background']).toBe('#ffffff');
  });

  it('skips declarations inside any at-rule body', () => {
    const css = `
      :root { --a: 1px; }
      @media (prefers-reduced-motion: reduce) { :root { --a: 0px; --ghost: 9px; } }
      :root { --b: 2px; }
    `;
    const parsed = parseRootTokens(css);
    expect(parsed['--a']).toBe('1px');
    expect(parsed['--b']).toBe('2px');
    expect(parsed['--ghost']).toBeUndefined();
  });
});
