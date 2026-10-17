import { describe, expect, it } from 'vitest';

import {
    findDateTimeFieldAt,
    isFieldOverflowing,
    leadZeroDateTimeCaret,
    overwriteDateSlot,
} from '../../lib/caret/date-overflow';
import { MaskExpression } from '../../lib/ngx-mask-expression.enum';
import type { NgxMaskService } from '../../lib/ngx-mask.service';

describe('findDateTimeFieldAt', () => {
    it('locates the field a caret sits in, up to the separator after it', () => {
        expect(findDateTimeFieldAt('d0/M0/0000', 1)).toMatchObject({
            token: 'd',
            start: 0,
            end: 2,
        });
        expect(findDateTimeFieldAt('d0/M0/0000', 2)).toMatchObject({
            token: 'd',
            start: 0,
            end: 2,
        });
        expect(findDateTimeFieldAt('d0/M0/0000', 4)).toMatchObject({
            token: 'M',
            start: 3,
            end: 5,
        });
    });

    it('treats Hh as one combined hour field', () => {
        expect(findDateTimeFieldAt('Hh:m0', 1)).toMatchObject({ token: 'H', start: 0, end: 2 });
        expect(findDateTimeFieldAt('Hh:m0', 4)).toMatchObject({ token: 'm', start: 3, end: 5 });
    });

    it('treats hh as one combined hour field too', () => {
        expect(findDateTimeFieldAt('hh:m0', 1)).toMatchObject({ token: 'h', start: 0, end: 2 });
        expect(findDateTimeFieldAt('hh:m0', 4)).toMatchObject({ token: 'm', start: 3, end: 5 });
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

describe('overwriteDateSlot', () => {
    type Svc = Parameters<typeof overwriteDateSlot>[0];
    const service = (mask: string, options: Partial<Svc> = {}): Svc => ({
        maskExpression: mask,
        specialCharacters: ['/', '.', ':', ' ', '-'],
        _checkSymbolMask: ((symbol: string, maskChar: string) =>
            /\d/.test(symbol) && /[0dMHhms]/.test(maskChar)) as NgxMaskService['_checkSymbolMask'],
        prefix: '',
        suffix: '',
        keepCharacterPositions: false,
        leadZeroDateTime: true,
        apm: false,
        ...options,
    });
    /** Types `key` at `caret` of the full display `before`; `to` makes it a selection `caret`-`to`. */
    const type = (svc: Svc, before: string, caret: number, key: string, to = caret) =>
        overwriteDateSlot(
            svc,
            before,
            before.slice(0, caret) + key + before.slice(to),
            caret + 1,
            `Digit${key}`
        );

    it('overwrites the next digit slot, skipping separators', () => {
        const svc = service('d0/M0/0000');
        expect(type(svc, '15/06/2020', 1, '9')).toMatchObject({
            value: '19/06/2020',
            position: 2,
        });
        expect(type(svc, '15/06/2020', 2, '1')).toMatchObject({
            value: '15/10/2020',
            position: 4,
        });
        expect(type(svc, '15/06/2020', 5, '7')).toMatchObject({
            value: '15/06/7020',
            position: 7,
        });
        expect(type(svc, '15/06/2020', 6, '1')).toMatchObject({
            value: '15/06/1020',
            position: 7,
        });
    });

    it('zero-fills a tens digit that would push the field out of range', () => {
        const svc = service('d0/M0/0000');
        expect(type(svc, '15/06/2020', 0, '3')).toMatchObject({
            value: '30/06/2020',
            position: 1,
        });
        expect(type(svc, '15/06/2020', 3, '1')).toMatchObject({
            value: '15/10/2020',
            position: 4,
        });
    });

    it('makes a digit that cannot be a tens digit the whole field', () => {
        const svc = service('d0/M0/0000');
        expect(type(svc, '15/06/2020', 0, '4')).toMatchObject({
            value: '04/06/2020',
            position: 2,
        });
        expect(type(svc, '15/06/2020', 4, '9')).toMatchObject({
            value: '15/09/2020',
            position: 5,
        });
        expect(type(svc, '31/12/2020', 1, '5')).toMatchObject({
            value: '05/12/2020',
            position: 2,
        });
    });

    it('makes a digit typed over a whole selected field the whole field', () => {
        const svc = service('d0/M0/0000');
        expect(type(svc, '15/06/2020', 3, '1', 5)).toMatchObject({
            value: '15/01/2020',
            position: 5,
        });
        expect(type(svc, '15/06/2020', 0, '3', 2)).toMatchObject({
            value: '03/06/2020',
            position: 2,
        });
    });

    it('reports the last index the edit touches, none for a rejected key', () => {
        const svc = service('d0/M0/0000');
        expect(type(svc, '15/06/2020', 1, '9')?.end).toBe(2);
        expect(type(svc, '15/06/2020', 3, '1', 5)?.end).toBe(5);
        expect(type(svc, '15/06/2020', 1, 'a')?.end).toBe(-1);
    });

    it('uses the limits of the time fields of a composite mask', () => {
        const svc = service('d0/M0/0000 Hh:m0:s0');
        const before = '15/06/2020 12:30:45';
        expect(type(svc, before, 11, '9')?.value).toBe('15/06/2020 09:30:45');
        expect(type(svc, before, 14, '7')?.value).toBe('15/06/2020 12:07:45');
        expect(type(svc, before, 17, '9')?.value).toBe('15/06/2020 12:30:09');
        expect(type(svc, before, 18, '7')?.value).toBe('15/06/2020 12:30:47');
        expect(type(svc, before, 11, '2')?.value).toBe('15/06/2020 22:30:45');
    });

    it('uses the twelve hour limit with apm', () => {
        const svc = service('d0/M0/0000 Hh:m0:s0', { apm: true });
        expect(type(svc, '15/06/2020 12:30:45', 11, '2')?.value).toBe('15/06/2020 02:30:45');
        expect(type(svc, '15/06/2020 12:30:45', 11, '1')?.value).toBe('15/06/2020 12:30:45');
    });

    it('finds the day of a mask without separators at a field boundary', () => {
        const svc = service('0000M0d0');
        expect(type(svc, '20201231', 6, '4')).toMatchObject({ value: '20201204', position: 8 });
        expect(type(svc, '20201231', 4, '4')).toMatchObject({ value: '20200431', position: 6 });
    });

    it('leaves a year digit as it is, with no range', () => {
        expect(type(service('0000.M0.d0'), '2020.12.31', 3, '9')?.value).toBe('2029.12.31');
    });

    it('does not repair a field without leadZeroDateTime', () => {
        const svc = service('d0/M0/0000', { leadZeroDateTime: false });
        expect(type(svc, '15/06/2020', 1, '9')?.value).toBe('19/06/2020');
        expect(type(svc, '15/06/2020', 0, '4')).toBeNull();
        expect(type(svc, '15/06/2020', 3, '5', 5)).toBeNull();
    });

    it('rejects a key the slot does not accept and keeps the display', () => {
        const svc = service('d0/M0/0000');
        expect(type(svc, '15/06/2020', 1, 'a')).toMatchObject({
            value: '15/06/2020',
            position: 1,
        });
        expect(type(svc, '15/06/2020', 3, 'a', 5)).toMatchObject({
            value: '15/06/2020',
            position: 3,
        });
    });

    it('stays out of an edit that is not a typed digit into a full date', () => {
        const svc = service('d0/M0/0000');
        const edited = '151/06/2020';
        expect(
            overwriteDateSlot(svc, '15/06/2020', edited, 3, MaskExpression.BACKSPACE)
        ).toBeNull();
        expect(overwriteDateSlot(svc, '15/06/2020', edited, 3, MaskExpression.DELETE)).toBeNull();
        expect(type(svc, '15/06/20', 1, '9')).toBeNull();
        expect(type(service('Hh:m0:s0'), '12:30:45', 1, '9')).toBeNull();
        expect(overwriteDateSlot(svc, '15/06/2020', '9', 1, 'Digit9')).toBeNull();
        expect(type(svc, '15/06/2020', 1, '9', 4)).toBeNull();
        expect(type(svc, '15/06/2020', 6, '9', 8)).toBeNull();
        expect(overwriteDateSlot(svc, '15/06/2020', '25/06/2020', 2, 'Digit2')).toBeNull();
    });

    it('stays out of prefix, suffix and keepCharacterPositions masks', () => {
        const before = '15/06/2020';
        expect(type(service('d0/M0/0000', { prefix: '+ ' }), before, 1, '9')).toBeNull();
        expect(type(service('d0/M0/0000', { suffix: ' x' }), before, 1, '9')).toBeNull();
        expect(
            type(service('d0/M0/0000', { keepCharacterPositions: true }), before, 1, '9')
        ).toBeNull();
    });
});
