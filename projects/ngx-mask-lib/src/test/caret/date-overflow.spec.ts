import { describe, expect, it } from 'vitest';

import {
    findDateTimeFieldAt,
    isFieldOverflowing,
    leadZeroDateTimeCaret,
    overwriteFullDateValue,
} from '../../lib/caret/date-overflow';
import { MaskExpression } from '../../lib/ngx-mask-expression.enum';

describe('findDateTimeFieldAt', () => {
    it('locates the field a caret sits in, up to the separator after it', () => {
        expect(findDateTimeFieldAt('d0/M0/0000', 1)).toEqual({ token: 'd', start: 0, end: 2 });
        expect(findDateTimeFieldAt('d0/M0/0000', 2)).toEqual({ token: 'd', start: 0, end: 2 });
        expect(findDateTimeFieldAt('d0/M0/0000', 4)).toEqual({ token: 'M', start: 3, end: 5 });
    });

    it('treats Hh as one combined hour field', () => {
        expect(findDateTimeFieldAt('Hh:m0', 1)).toEqual({ token: 'H', start: 0, end: 2 });
        expect(findDateTimeFieldAt('Hh:m0', 4)).toEqual({ token: 'm', start: 3, end: 5 });
    });

    it('treats hh as one combined hour field too', () => {
        expect(findDateTimeFieldAt('hh:m0', 1)).toEqual({ token: 'h', start: 0, end: 2 });
        expect(findDateTimeFieldAt('hh:m0', 4)).toEqual({ token: 'm', start: 3, end: 5 });
    });

    it('finds nothing in a mask without date or time tokens, or past the last field', () => {
        expect(findDateTimeFieldAt('000-000', 2)).toBeNull();
        expect(findDateTimeFieldAt('d0/M0/0000', 8)).toBeNull();
    });
});

describe('isFieldOverflowing', () => {
    const day = { token: 'd', start: 0, end: 2 } as const;
    const month = { token: 'M', start: 3, end: 5 } as const;
    const hours = { token: 'H', start: 0, end: 2 } as const;

    it('flags a completed out-of-range two digit value', () => {
        expect(isFieldOverflowing(day, 2, '33', '33', false)).toBe(true);
        expect(isFieldOverflowing(day, 2, '31', '31', false)).toBe(false);
        expect(isFieldOverflowing(month, 5, '12/13', '12/13', false)).toBe(true);
    });

    it('flags a first digit that cannot lead a valid value', () => {
        expect(isFieldOverflowing(day, 1, '4', '4', false)).toBe(true);
        expect(isFieldOverflowing(month, 4, '12/3', '12/3', false)).toBe(true);
        expect(isFieldOverflowing(month, 4, '12/1', '12/1', false)).toBe(false);
    });

    it('uses the twelve hour limits with apm', () => {
        expect(isFieldOverflowing(hours, 2, '13', '13', false)).toBe(false);
        expect(isFieldOverflowing(hours, 2, '24', '24', false)).toBe(true);
        expect(isFieldOverflowing(hours, 2, '10', '10', true)).toBe(false);
        expect(isFieldOverflowing(hours, 2, '12', '12', true)).toBe(false);
        expect(isFieldOverflowing(hours, 2, '13', '13', true)).toBe(true);
    });
});

describe('leadZeroDateTimeCaret', () => {
    it('moves the caret two chars on past an overflowing field', () => {
        expect(leadZeroDateTimeCaret('d0/M0/0000', 1, '4', '4', false)).toBe(3);
    });

    it('keeps the caret otherwise', () => {
        expect(leadZeroDateTimeCaret('d0/M0/0000', 1, '2', '2', false)).toBe(1);
        expect(leadZeroDateTimeCaret('000-000', 1, '9', '9', false)).toBe(1);
    });
});

describe('overwriteFullDateValue', () => {
    it('drops the character after the caret of a full d0/M0/0000 value', () => {
        expect(overwriteFullDateValue('d0/M0/0000', '121/23456', 3, 'Digit1')).toBe('12123456');
    });

    it('leaves the value on backspace, on another mask, or at the end of the date', () => {
        expect(overwriteFullDateValue('d0/M0/0000', '121/23456', 3, MaskExpression.BACKSPACE)).toBe(
            null
        );
        expect(overwriteFullDateValue('Hh:m0:s0', '121/23456', 3, 'Digit1')).toBeNull();
        expect(overwriteFullDateValue('d0/M0/0000', '121/23456', 10, 'Digit1')).toBeNull();
        expect(overwriteFullDateValue('d0/M0/0000', '12', 2, 'Digit1')).toBeNull();
    });
});
