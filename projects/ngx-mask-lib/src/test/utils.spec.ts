import { expect } from 'vitest';

import { digitsOf, escapeRegExp } from '../lib/ngx-mask.utils';

describe('ngx-mask.utils', () => {
    describe('escapeRegExp', () => {
        const regexSpecialChars = [...'.*+?^${}()|[]\\/-'];

        it.each(regexSpecialChars)('matches %s literally', (char) => {
            expect(new RegExp(escapeRegExp(char)).test(char)).toBe(true);
            expect(new RegExp(`^${escapeRegExp(char)}$`).test(`x${char}`)).toBe(false);
        });

        it.each(regexSpecialChars)('matches %s literally inside a character class', (char) => {
            expect(new RegExp(`[${escapeRegExp(char)}]`).test(char)).toBe(true);
            expect(new RegExp(`^[${escapeRegExp(char)}]$`).test('a')).toBe(false);
        });

        it('leaves letters, digits and whitespace untouched', () => {
            expect(escapeRegExp('aZ09 _@#')).toBe('aZ09 _@#');
        });

        it('escapes every occurrence in a multi-character string', () => {
            expect(escapeRegExp('$&')).toBe('\\$&');
            expect(new RegExp(escapeRegExp('(.)'), 'g').test('(.)')).toBe(true);
            expect(escapeRegExp('')).toBe('');
        });
    });

    describe('digitsOf', () => {
        it('returns the digits in order and skips everything else', () => {
            expect(digitsOf('a1b2-3 (4)')).toEqual(['1', '2', '3', '4']);
        });

        it('returns an empty array when there are no digits', () => {
            expect(digitsOf('')).toEqual([]);
            expect(digitsOf('abc.-')).toEqual([]);
        });

        it('returns a fresh array on every call', () => {
            expect(digitsOf('12')).not.toBe(digitsOf('12'));
        });
    });
});
