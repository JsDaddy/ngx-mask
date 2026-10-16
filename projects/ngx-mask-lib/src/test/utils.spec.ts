import { expect } from 'vitest';

import { escapeRegExp } from '../lib/ngx-mask.utils';

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
});
