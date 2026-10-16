import { expect } from 'vitest';

import {
    activeDecimalMarker,
    containsStarSymbol,
    digitsOf,
    displayToPlainDecimal,
    escapeRegExp,
    retargetSeparatorValue,
    usesCommaDecimal,
} from '../lib/ngx-mask.utils';

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
            expect(escapeRegExp(null)).toBe('');
            // eslint-disable-next-line no-undefined
            expect(escapeRegExp(undefined)).toBe('');
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

describe('separator helpers', () => {
    describe('activeDecimalMarker', () => {
        it('returns a single configured marker as is', () => {
            expect(activeDecimalMarker('1.5', ',', ' ')).toBe(',');
        });

        it('picks the first array marker present in the value', () => {
            expect(activeDecimalMarker('1,5', ['.', ','], ' ')).toBe(',');
            expect(activeDecimalMarker('1.5', ['.', ','], ' ')).toBe('.');
        });

        it('skips an array marker that is the thousandSeparator', () => {
            expect(activeDecimalMarker('1.234', ['.', ','], '.')).toBe(',');
            expect(activeDecimalMarker('1234', ['.', ','], '.')).toBe(',');
        });
    });

    describe('usesCommaDecimal', () => {
        it('reads the active decimal marker', () => {
            expect(usesCommaDecimal('1,5', ',', '.')).toBe(true);
            expect(usesCommaDecimal('1.5', '.', ',')).toBe(false);
            expect(usesCommaDecimal('1,5', ['.', ','], ' ')).toBe(true);
        });
    });

    describe('displayToPlainDecimal', () => {
        it('turns the display format into a plain dot decimal', () => {
            expect(displayToPlainDecimal('1.234,5', ',', '.')).toBe('1234.5');
        });

        it('keeps a value missing the separator or the marker', () => {
            expect(displayToPlainDecimal('1234567.5', ',', '.')).toBe('1234567.5');
            expect(displayToPlainDecimal('1.5', ',', '.')).toBe('1.5');
            expect(displayToPlainDecimal('1.234', ',', '')).toBe('1.234');
        });
    });

    describe('containsStarSymbol', () => {
        it('detects a hidden-character star', () => {
            expect(containsStarSymbol('1*3', '000', ' ')).toBe(true);
            expect(containsStarSymbol('123', '000', ' ')).toBe(false);
        });

        it('ignores a star thousandSeparator of a separator mask', () => {
            expect(containsStarSymbol('1*234', 'separator.2', '*')).toBe(false);
            expect(containsStarSymbol('1*234', '000', '*')).toBe(true);
        });
    });

    describe('retargetSeparatorValue', () => {
        const previous = {
            thousandSeparator: ' ',
            decimalMarker: '.',
            prefix: '',
            suffix: '',
        } as const;
        const current = {
            thousandSeparator: '.',
            decimalMarker: ',',
            prefix: '',
            suffix: '',
        } as const;

        it('re-expresses the number in the current markers', () => {
            expect(retargetSeparatorValue('1 234.5', previous, current)).toBe('1234,5');
        });

        it('swaps the previous prefix and suffix for the current ones', () => {
            expect(
                retargetSeparatorValue(
                    '$ 1 234.5 %',
                    { ...previous, prefix: '$ ', suffix: ' %' },
                    { ...current, prefix: 'EUR ', suffix: ' pct' }
                )
            ).toBe('EUR 1234,5 pct');
        });
    });
});
