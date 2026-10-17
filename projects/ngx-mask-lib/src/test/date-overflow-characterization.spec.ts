import { afterEach, describe, expect, it, vi } from 'vitest';

import type { EditAction, EditSnapshot } from './utils/characterization-harness';
import { createHarness } from './utils/characterization-harness';
import { pasteTest } from './utils/test-functions.component';
import type { TestMaskComponent } from './utils/test-component.component';

/**
 * Characterization of the date/time overflow handling of `NgxMaskDirective` input processing:
 * the per-field thresholds (day 31, month 12, hour 23 or 12 with apm, minutes and seconds 59),
 * the leadZeroDateTime caret shift and the apm / d0/M0/0000 tweaks. Every expectation records
 * what the directive does TODAY, so a later extraction can be proven behaviour-preserving.
 * Rows marked `// current behaviour` look odd on purpose: they are pinned, not endorsed.
 */

type Config = Partial<{
    [
        K in keyof TestMaskComponent as TestMaskComponent[K] extends { set: unknown } ? K : never
    ]: TestMaskComponent[K] extends { set: (v: infer V) => void } ? V : never;
}>;

type Row = {
    /** Value written through the form control before anything else. */
    initial?: string;
    /** Characters typed key by key at the caret; \b is Backspace. */
    keys?: string;
    /** Value pasted into the input. */
    paste?: string;
    /** One edit at an explicit selection, applied after `initial` / `keys`. */
    edit?: EditAction;
    expected: Pick<EditSnapshot, 'value' | 'caret' | 'model'>;
};

async function run(config: Config, row: Row): Promise<EditSnapshot> {
    const harness = createHarness();
    for (const [key, value] of Object.entries(config)) {
        (harness.component as unknown as Record<string, { set: (v: unknown) => void }>)[key]?.set(
            value
        );
    }
    harness.fixture.detectChanges();
    // Land the configuration's deferred writes before the user acts, as a real page would.
    await harness.settle();
    if (typeof row.initial === 'string') {
        await harness.write(row.initial);
    }
    if (typeof row.paste === 'string') {
        pasteTest(row.paste, harness.fixture);
        await harness.settle();
    }
    if (typeof row.keys === 'string') {
        await harness.type(row.keys);
    }
    return row.edit ? harness.edit(row.edit) : harness.snapshot();
}

function describeRow(row: Row): string {
    if (typeof row.keys === 'string') {
        return `typing ${JSON.stringify(row.keys).replace(/\\\\b/g, '<Backspace>')}`;
    }
    if (typeof row.paste === 'string') {
        return `pasting "${row.paste}"`;
    }
    if (!row.edit) {
        return `writing "${row.initial}"`;
    }
    const { start, end, key } = row.edit;
    return `${row.initial} then ${key} at ${start}${end === start ? '' : `-${end}`}`;
}

function check(config: Config, rows: Row[]): void {
    for (const row of rows) {
        it(describeRow(row), async () => {
            const snap = await run(config, row);
            expect({ value: snap.value, caret: snap.caret, model: snap.model }).toEqual(
                row.expected
            );
        });
    }
}

describe('date overflow characterization', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('d0/M0/0000 typing a date key by key', () => {
        const config: Config = { mask: 'd0/M0/0000', leadZeroDateTime: true };
        check(config, [
            { keys: '1', expected: { value: '1', caret: 1, model: '1' } },
            { keys: '3', expected: { value: '3', caret: 1, model: '3' } },
            { keys: '4', expected: { value: '04', caret: 2, model: '04' } },
            { keys: '9', expected: { value: '09', caret: 2, model: '09' } },
            { keys: '31', expected: { value: '31', caret: 2, model: '31' } },
            { keys: '32', expected: { value: '03/02', caret: 5, model: '0302' } },
            { keys: '35', expected: { value: '03/05', caret: 5, model: '0305' } },
            { keys: '39', expected: { value: '03/09', caret: 5, model: '0309' } },
            { keys: '40', expected: { value: '04/0', caret: 4, model: '040' } },
            // a typed 00 day is clamped to 01 (leadZeroDateTime, user input only)
            { keys: '00', expected: { value: '01', caret: 2, model: '01' } },
            { keys: '0', expected: { value: '0', caret: 1, model: '0' } },
            { keys: '01', expected: { value: '01', caret: 2, model: '01' } },
            { keys: '3112', expected: { value: '31/12', caret: 5, model: '3112' } },
            { keys: '311', expected: { value: '31/1', caret: 4, model: '311' } },
            // current behaviour: an overflowing month is padded to 01 and the next digit becomes the year
            { keys: '3113', expected: { value: '31/01/3', caret: 7, model: '31013' } },
            { keys: '312', expected: { value: '31/02', caret: 5, model: '3102' } },
            { keys: '10', expected: { value: '10', caret: 2, model: '10' } },
            { keys: '13', expected: { value: '13', caret: 2, model: '13' } },
            { keys: '15', expected: { value: '15', caret: 2, model: '15' } },
            { keys: '152', expected: { value: '15/02', caret: 5, model: '1502' } },
            { keys: '1522', expected: { value: '15/02/2', caret: 7, model: '15022' } },
            { keys: '153', expected: { value: '15/03', caret: 5, model: '1503' } },
            { keys: '15062020', expected: { value: '15/06/2020', caret: 10, model: '15062020' } },
            { keys: '3112202099', expected: { value: '31/12/2020', caret: 10, model: '31122020' } },
            { keys: '29022024', expected: { value: '29/02/2024', caret: 10, model: '29022024' } },
            { keys: '41', expected: { value: '04/1', caret: 4, model: '041' } },
            { keys: '4112', expected: { value: '04/11/2', caret: 7, model: '04112' } },
            { keys: '1512', expected: { value: '15/12', caret: 5, model: '1512' } },
            { keys: '15013', expected: { value: '15/01/3', caret: 7, model: '15013' } },
            { keys: '150', expected: { value: '15/0', caret: 4, model: '150' } },
            // a typed 00 month is clamped to 01
            { keys: '1500', expected: { value: '15/01', caret: 5, model: '1501' } },
        ]);
    });

    describe('d0/M0/0000 without leadZeroDateTime', () => {
        const config: Config = { mask: 'd0/M0/0000' };
        check(config, [
            { keys: '4', expected: { value: '4', caret: 1, model: '4' } },
            { keys: '45', expected: { value: '4/5', caret: 3, model: '45' } },
            { keys: '32', expected: { value: '3/2', caret: 3, model: '32' } },
            { keys: '3112', expected: { value: '31/12', caret: 5, model: '3112' } },
            { keys: '3113', expected: { value: '31/1/3', caret: 6, model: '3113' } },
            { keys: '15062020', expected: { value: '15/06/2020', caret: 10, model: '15062020' } },
            { keys: '13', expected: { value: '13', caret: 2, model: '13' } },
        ]);
    });

    describe('d0/M0/0000 editing inside an existing date', () => {
        const config: Config = { mask: 'd0/M0/0000', leadZeroDateTime: true };
        check(config, [
            {
                initial: '15062020',
                edit: { start: 1, end: 1, key: '9' },
                expected: { value: '19/06/2020', caret: 2, model: '19062020' },
            },
            {
                initial: '15062020',
                edit: { start: 1, end: 1, key: '4' },
                expected: { value: '14/06/2020', caret: 2, model: '14062020' },
            },
            // current behaviour: typing inside a full date inserts the digit and shifts the rest, rewriting the month and year
            {
                initial: '15062020',
                edit: { start: 0, end: 0, key: '4' },
                expected: { value: '04/05/0620', caret: 5, model: '04050620' },
            },
            // current behaviour: typing inside a full date inserts the digit and shifts the rest, rewriting the month and year
            {
                initial: '15062020',
                edit: { start: 0, end: 0, key: '3' },
                expected: { value: '03/05/0620', caret: 5, model: '03050620' },
            },
            {
                initial: '15062020',
                edit: { start: 2, end: 2, key: '3' },
                expected: { value: '15/03/0620', caret: 5, model: '15030620' },
            },
            // current behaviour: typing inside a full date inserts the digit and shifts the rest, rewriting the month and year
            {
                initial: '15062020',
                edit: { start: 3, end: 3, key: '3' },
                expected: { value: '15/03/6202', caret: 7, model: '15036202' },
            },
            // current behaviour: typing inside a full date inserts the digit and shifts the rest, rewriting the month and year
            {
                initial: '15062020',
                edit: { start: 3, end: 3, key: '1' },
                expected: { value: '15/01/6202', caret: 7, model: '15016202' },
            },
            {
                initial: '15062020',
                edit: { start: 4, end: 4, key: '3' },
                expected: { value: '15/03/2020', caret: 5, model: '15032020' },
            },
            {
                initial: '15062020',
                edit: { start: 4, end: 4, key: '9' },
                expected: { value: '15/09/2020', caret: 5, model: '15092020' },
            },
            // current behaviour: typing inside a full date inserts the digit and shifts the rest, rewriting the month and year
            {
                initial: '15062020',
                edit: { start: 5, end: 5, key: '7' },
                expected: { value: '15/06/7202', caret: 7, model: '15067202' },
            },
            // current behaviour: typing inside a full date inserts the digit and shifts the rest, rewriting the month and year
            {
                initial: '15062020',
                edit: { start: 6, end: 6, key: '1' },
                expected: { value: '15/06/1020', caret: 7, model: '15061020' },
            },
            {
                initial: '15062020',
                edit: { start: 9, end: 9, key: '7' },
                expected: { value: '15/06/2027', caret: 10, model: '15062027' },
            },
            {
                initial: '15062020',
                edit: { start: 10, end: 10, key: '7' },
                expected: { value: '15/06/2020', caret: 10, model: '15062020' },
            },
            {
                initial: '15062020',
                edit: { start: 0, end: 2, key: '4' },
                expected: { value: '04/06/2020', caret: 4, model: '04062020' },
            },
            {
                initial: '15062020',
                edit: { start: 0, end: 2, key: '3' },
                expected: { value: '30/06/2020', caret: 1, model: '30062020' },
            },
            {
                initial: '15062020',
                edit: { start: 3, end: 5, key: '1' },
                expected: { value: '15/12/020', caret: 4, model: '1512020' },
            },
            {
                initial: '15062020',
                edit: { start: 3, end: 5, key: '4' },
                expected: { value: '15/04/2020', caret: 7, model: '15042020' },
            },
            {
                initial: '1506',
                edit: { start: 1, end: 1, key: '9' },
                expected: { value: '19/05/06', caret: 2, model: '190506' },
            },
            {
                initial: '1506',
                edit: { start: 1, end: 1, key: '4' },
                expected: { value: '14/05/06', caret: 2, model: '140506' },
            },
            {
                initial: '1506',
                edit: { start: 4, end: 4, key: '3' },
                expected: { value: '15/03/6', caret: 5, model: '15036' },
            },
            {
                initial: '1506',
                edit: { start: 5, end: 5, key: '3' },
                expected: { value: '15/06/3', caret: 7, model: '15063' },
            },
            {
                initial: '15',
                edit: { start: 1, end: 1, key: '4' },
                expected: { value: '14/05', caret: 2, model: '1405' },
            },
            {
                initial: '15',
                edit: { start: 2, end: 2, key: '3' },
                expected: { value: '15/03', caret: 5, model: '1503' },
            },
        ]);
    });

    describe('d0/M0/0000 Backspace and Delete', () => {
        const config: Config = { mask: 'd0/M0/0000', leadZeroDateTime: true };
        check(config, [
            {
                initial: '15062020',
                edit: { start: 2, end: 2, key: 'Backspace' },
                expected: { value: '01/06/2020', caret: 1, model: '01062020' },
            },
            {
                initial: '15062020',
                edit: { start: 3, end: 3, key: 'Backspace' },
                expected: { value: '15/06/2020', caret: 2, model: '15062020' },
            },
            {
                initial: '15062020',
                edit: { start: 4, end: 4, key: 'Backspace' },
                expected: { value: '15/06/2020', caret: 3, model: '15062020' },
            },
            {
                initial: '15062020',
                edit: { start: 10, end: 10, key: 'Backspace' },
                expected: { value: '15/06/202', caret: 9, model: '1506202' },
            },
            {
                initial: '15062020',
                edit: { start: 1, end: 1, key: 'Backspace' },
                expected: { value: '05/06/2020', caret: 0, model: '05062020' },
            },
            {
                initial: '15062020',
                edit: { start: 0, end: 0, key: 'Delete' },
                expected: { value: '05/06/2020', caret: 0, model: '05062020' },
            },
            {
                initial: '15062020',
                edit: { start: 2, end: 2, key: 'Delete' },
                expected: { value: '15/06/2020', caret: 4, model: '15062020' },
            },
            {
                initial: '15062020',
                edit: { start: 0, end: 10, key: 'Backspace' },
                expected: { value: '', caret: 0, model: '' },
            },
            {
                initial: '15062020',
                edit: { start: 0, end: 2, key: 'Backspace' },
                expected: { value: '06/02/020', caret: 0, model: '0602020' },
            },
            { keys: '1506\b\b', expected: { value: '15/', caret: 3, model: '15' } },
            { keys: '15062\b\b\b', expected: { value: '15/0', caret: 4, model: '150' } },
            { keys: '31\b', expected: { value: '3', caret: 1, model: '3' } },
            { keys: '4\b', expected: { value: '0', caret: 1, model: '0' } },
            { keys: '3112\b3', expected: { value: '31/01/3', caret: 7, model: '31013' } },
        ]);
    });

    describe('d0/M0/0000 pasting', () => {
        const config: Config = { mask: 'd0/M0/0000', leadZeroDateTime: true };
        check(config, [
            { paste: '15062020', expected: { value: '15/06/2020', caret: 10, model: '15062020' } },
            { paste: '32132020', expected: { value: '03/02/1320', caret: 10, model: '03021320' } },
            { paste: '3', expected: { value: '3', caret: 1, model: '3' } },
            { paste: '45', expected: { value: '04/05', caret: 5, model: '0405' } },
        ]);
    });

    describe('0000.M0.d0 typing a date key by key', () => {
        const config: Config = { mask: '0000.M0.d0', leadZeroDateTime: true };
        check(config, [
            { keys: '2020', expected: { value: '2020', caret: 4, model: '2020' } },
            { keys: '20201', expected: { value: '2020.1', caret: 6, model: '20201' } },
            { keys: '20203', expected: { value: '2020.03', caret: 7, model: '202003' } },
            { keys: '20204', expected: { value: '2020.04', caret: 7, model: '202004' } },
            // an overflowing month is padded to 01 and the next digit becomes the day, as in d0/M0/0000
            { keys: '202013', expected: { value: '2020.01.3', caret: 9, model: '2020013' } },
            { keys: '202012', expected: { value: '2020.12', caret: 7, model: '202012' } },
            { keys: '2020123', expected: { value: '2020.12.3', caret: 9, model: '2020123' } },
            { keys: '2020124', expected: { value: '2020.12.04', caret: 10, model: '20201204' } },
            { keys: '20201231', expected: { value: '2020.12.31', caret: 10, model: '20201231' } },
            { keys: '20201232', expected: { value: '2020.12.03', caret: 10, model: '20201203' } },
            { keys: '20201235', expected: { value: '2020.12.03', caret: 10, model: '20201203' } },
            { keys: '20201240', expected: { value: '2020.12.04', caret: 10, model: '20201204' } },
            { keys: '20200', expected: { value: '2020.0', caret: 6, model: '20200' } },
            { keys: '202000', expected: { value: '2020.01', caret: 7, model: '202001' } },
            { keys: '2020120', expected: { value: '2020.12.0', caret: 9, model: '2020120' } },
            { keys: '20201200', expected: { value: '2020.12.01', caret: 10, model: '20201201' } },
            { keys: '202002', expected: { value: '2020.02', caret: 7, model: '202002' } },
            { keys: '2020021', expected: { value: '2020.02.1', caret: 9, model: '2020021' } },
        ]);
    });

    describe('0000.M0.d0 editing inside an existing date', () => {
        const config: Config = { mask: '0000.M0.d0', leadZeroDateTime: true };
        check(config, [
            {
                initial: '20201231',
                edit: { start: 5, end: 5, key: '0' },
                expected: { value: '2020.01.23', caret: 6, model: '20200123' },
            },
            {
                initial: '20201231',
                edit: { start: 5, end: 5, key: '3' },
                expected: { value: '2020.03.12', caret: 9, model: '20200312' },
            },
            // the month 14 is padded to 01 and the 4 becomes the day (PR2 turns this into an overwrite)
            {
                initial: '20201231',
                edit: { start: 6, end: 6, key: '4' },
                expected: { value: '2020.01.04', caret: 10, model: '20200104' },
            },
            {
                initial: '20201231',
                edit: { start: 6, end: 6, key: '1' },
                expected: { value: '2020.11.23', caret: 7, model: '20201123' },
            },
            {
                initial: '20201231',
                edit: { start: 7, end: 7, key: '4' },
                expected: { value: '2020.12.04', caret: 10, model: '20201204' },
            },
            {
                initial: '20201231',
                edit: { start: 8, end: 8, key: '4' },
                expected: { value: '2020.12.04', caret: 10, model: '20201204' },
            },
            {
                initial: '20201231',
                edit: { start: 8, end: 8, key: '2' },
                expected: { value: '2020.12.23', caret: 9, model: '20201223' },
            },
            {
                initial: '20201231',
                edit: { start: 9, end: 9, key: '5' },
                expected: { value: '2020.12.03', caret: 10, model: '20201203' },
            },
            {
                initial: '20201231',
                edit: { start: 9, end: 9, key: '2' },
                expected: { value: '2020.12.03', caret: 10, model: '20201203' },
            },
            {
                initial: '20201231',
                edit: { start: 10, end: 10, key: '2' },
                expected: { value: '2020.12.31', caret: 10, model: '20201231' },
            },
            {
                initial: '20201231',
                edit: { start: 3, end: 3, key: '9' },
                expected: { value: '2029.01.23', caret: 4, model: '20290123' },
            },
            // current behaviour: month 13 is accepted when a selection is replaced (the stale separator
            // hides the digit pair from the month window); the overwrite of a complete date fixes it
            {
                initial: '20201231',
                edit: { start: 5, end: 7, key: '1' },
                expected: { value: '2020.13.1', caret: 6, model: '2020131' },
            },
            {
                initial: '20201231',
                edit: { start: 8, end: 10, key: '4' },
                expected: { value: '2020.12.04', caret: 10, model: '20201204' },
            },
        ]);
    });

    describe('0000.M0.d0 Backspace', () => {
        const config: Config = { mask: '0000.M0.d0', leadZeroDateTime: true };
        check(config, [
            {
                initial: '20201231',
                edit: { start: 5, end: 5, key: 'Backspace' },
                expected: { value: '2020.12.31', caret: 4, model: '20201231' },
            },
            {
                initial: '20201231',
                edit: { start: 8, end: 8, key: 'Backspace' },
                expected: { value: '2020.12.31', caret: 7, model: '20201231' },
            },
            {
                initial: '20201231',
                edit: { start: 10, end: 10, key: 'Backspace' },
                expected: { value: '2020.12.3', caret: 9, model: '2020123' },
            },
            {
                initial: '20201231',
                edit: { start: 9, end: 9, key: 'Backspace' },
                expected: { value: '2020.12.1', caret: 8, model: '2020121' },
            },
            { keys: '20201231\b\b', expected: { value: '2020.12.', caret: 8, model: '202012' } },
        ]);
    });

    describe('Hh:m0:s0 typing a time key by key', () => {
        const config: Config = { mask: 'Hh:m0:s0', leadZeroDateTime: true };
        check(config, [
            { keys: '1', expected: { value: '1', caret: 1, model: '1' } },
            { keys: '2', expected: { value: '2', caret: 1, model: '2' } },
            { keys: '3', expected: { value: '03', caret: 2, model: '03' } },
            { keys: '9', expected: { value: '09', caret: 2, model: '09' } },
            { keys: '23', expected: { value: '23', caret: 2, model: '23' } },
            // an hour above 23 is padded to 02 and the digit starts the minutes
            { keys: '24', expected: { value: '02:4', caret: 4, model: '024' } },
            { keys: '25', expected: { value: '02:5', caret: 4, model: '025' } },
            { keys: '29', expected: { value: '02:09', caret: 5, model: '0209' } },
            { keys: '30', expected: { value: '03:0', caret: 4, model: '030' } },
            { keys: '00', expected: { value: '00', caret: 2, model: '00' } },
            { keys: '0', expected: { value: '0', caret: 1, model: '0' } },
            { keys: '12', expected: { value: '12', caret: 2, model: '12' } },
            { keys: '123', expected: { value: '12:3', caret: 4, model: '123' } },
            { keys: '126', expected: { value: '12:06', caret: 5, model: '1206' } },
            { keys: '1259', expected: { value: '12:59', caret: 5, model: '1259' } },
            { keys: '125', expected: { value: '12:5', caret: 4, model: '125' } },
            // by design: the 6 can only be a tens-of-minutes digit, so it is padded (like 3113 in dates)
            { keys: '1260', expected: { value: '12:06:0', caret: 7, model: '12060' } },
            { keys: '1261', expected: { value: '12:06:1', caret: 7, model: '12061' } },
            { keys: '12345', expected: { value: '12:34:5', caret: 7, model: '12345' } },
            { keys: '123459', expected: { value: '12:34:59', caret: 8, model: '123459' } },
            { keys: '123456', expected: { value: '12:34:56', caret: 8, model: '123456' } },
            { keys: '1234', expected: { value: '12:34', caret: 5, model: '1234' } },
            { keys: '12346', expected: { value: '12:34:06', caret: 8, model: '123406' } },
            { keys: '123460', expected: { value: '12:34:06', caret: 8, model: '123406' } },
            { keys: '235959', expected: { value: '23:59:59', caret: 8, model: '235959' } },
            { keys: '236000', expected: { value: '23:06:00', caret: 8, model: '230600' } },
            { keys: '246060', expected: { value: '02:46:06', caret: 8, model: '024606' } },
            { keys: '2359599', expected: { value: '23:59:59', caret: 8, model: '235959' } },
            { keys: '1200', expected: { value: '12:00', caret: 5, model: '1200' } },
            { keys: '12000', expected: { value: '12:00:0', caret: 7, model: '12000' } },
        ]);
    });

    describe('Hh:m0:s0 without leadZeroDateTime', () => {
        const config: Config = { mask: 'Hh:m0:s0' };
        check(config, [
            { keys: '3', expected: { value: '3', caret: 1, model: '3' } },
            { keys: '25', expected: { value: '2:5', caret: 3, model: '25' } },
            { keys: '236060', expected: { value: '23:6:06', caret: 7, model: '23606' } },
            { keys: '235959', expected: { value: '23:59:59', caret: 8, model: '235959' } },
        ]);
    });

    describe('Hh:m0:s0 editing inside an existing time', () => {
        const config: Config = { mask: 'Hh:m0:s0', leadZeroDateTime: true };
        check(config, [
            {
                initial: '123456',
                edit: { start: 1, end: 1, key: '9' },
                expected: { value: '19:23:45', caret: 2, model: '192345' },
            },
            {
                initial: '123456',
                edit: { start: 0, end: 0, key: '3' },
                expected: { value: '03:12:34', caret: 4, model: '031234' },
            },
            {
                initial: '123456',
                edit: { start: 0, end: 0, key: '2' },
                expected: { value: '21:23:45', caret: 1, model: '212345' },
            },
            {
                initial: '123456',
                edit: { start: 1, end: 1, key: '5' },
                expected: { value: '15:23:45', caret: 2, model: '152345' },
            },
            {
                initial: '123456',
                edit: { start: 2, end: 2, key: '5' },
                expected: { value: '12:53:45', caret: 4, model: '125345' },
            },
            {
                initial: '123456',
                edit: { start: 3, end: 3, key: '6' },
                expected: { value: '12:06:34', caret: 7, model: '120634' },
            },
            {
                initial: '123456',
                edit: { start: 3, end: 3, key: '1' },
                expected: { value: '12:13:45', caret: 4, model: '121345' },
            },
            {
                initial: '123456',
                edit: { start: 4, end: 4, key: '9' },
                expected: { value: '12:39:45', caret: 5, model: '123945' },
            },
            {
                initial: '123456',
                edit: { start: 4, end: 4, key: '0' },
                expected: { value: '12:30:45', caret: 5, model: '123045' },
            },
            {
                initial: '123456',
                edit: { start: 5, end: 5, key: '7' },
                expected: { value: '12:34:07', caret: 8, model: '123407' },
            },
            {
                initial: '123456',
                edit: { start: 6, end: 6, key: '6' },
                expected: { value: '12:34:06', caret: 8, model: '123406' },
            },
            {
                initial: '123456',
                edit: { start: 7, end: 7, key: '7' },
                expected: { value: '12:34:57', caret: 8, model: '123457' },
            },
            {
                initial: '123456',
                edit: { start: 8, end: 8, key: '0' },
                expected: { value: '12:34:56', caret: 8, model: '123456' },
            },
            {
                initial: '123456',
                edit: { start: 0, end: 2, key: '3' },
                expected: { value: '03:34:56', caret: 4, model: '033456' },
            },
            {
                initial: '123456',
                edit: { start: 3, end: 5, key: '6' },
                expected: { value: '12:06:56', caret: 7, model: '120656' },
            },
            {
                initial: '123456',
                edit: { start: 6, end: 8, key: '7' },
                expected: { value: '12:34:07', caret: 8, model: '123407' },
            },
        ]);
    });

    describe('Hh:m0:s0 Backspace', () => {
        const config: Config = { mask: 'Hh:m0:s0', leadZeroDateTime: true };
        check(config, [
            {
                initial: '123456',
                edit: { start: 2, end: 2, key: 'Backspace' },
                expected: { value: '13:45:06', caret: 1, model: '134506' },
            },
            {
                initial: '123456',
                edit: { start: 3, end: 3, key: 'Backspace' },
                expected: { value: '12:34:56', caret: 2, model: '123456' },
            },
            {
                initial: '123456',
                edit: { start: 8, end: 8, key: 'Backspace' },
                expected: { value: '12:34:5', caret: 7, model: '12345' },
            },
            {
                initial: '123456',
                edit: { start: 6, end: 6, key: 'Backspace' },
                expected: { value: '12:34:56', caret: 5, model: '123456' },
            },
            {
                initial: '123456',
                edit: { start: 1, end: 1, key: 'Delete' },
                expected: { value: '13:45:06', caret: 1, model: '134506' },
            },
            { keys: '1234\b\b', expected: { value: '12:', caret: 3, model: '12' } },
        ]);
    });

    describe('Hh:m0 aa typing a 12-hour time with apm', () => {
        const config: Config = { mask: 'Hh:m0 aa', apm: true, leadZeroDateTime: true };
        check(config, [
            { keys: '1', expected: { value: '1', caret: 1, model: '1' } },
            { keys: '2', expected: { value: '2', caret: 1, model: '2' } },
            { keys: '3', expected: { value: '3', caret: 1, model: '3' } },
            { keys: '9', expected: { value: '9', caret: 1, model: '9' } },
            { keys: '12', expected: { value: '12', caret: 2, model: '12' } },
            // an hour above 12 is padded to 01 and the digit starts the minutes
            { keys: '13', expected: { value: '01:3', caret: 4, model: '013' } },
            { keys: '19', expected: { value: '01:09', caret: 5, model: '0109' } },
            { keys: '10', expected: { value: '10', caret: 2, model: '10' } },
            { keys: '11', expected: { value: '11', caret: 2, model: '11' } },
            // a 12-hour clock has no hour 00: a typed 00 becomes 01 (leadZeroDateTime)
            { keys: '00', expected: { value: '01', caret: 2, model: '01' } },
            { keys: '0', expected: { value: '0', caret: 1, model: '0' } },
            { keys: '01', expected: { value: '01', caret: 2, model: '01' } },
            { keys: '123', expected: { value: '12:3', caret: 4, model: '123' } },
            { keys: '126', expected: { value: '12:06', caret: 5, model: '1206' } },
            { keys: '1259', expected: { value: '12:59', caret: 5, model: '1259' } },
            // by design: the 6 can only be a tens-of-minutes digit, so it is padded (like 3113 in dates)
            { keys: '1260', expected: { value: '12:06 ', caret: 6, model: '1206' } },
            { keys: '125', expected: { value: '12:5', caret: 4, model: '125' } },
            // current behaviour: unsupported token: there is no meridiem pattern, so the letters are never accepted and the value keeps a trailing space
            { keys: '1259a', expected: { value: '12:59 ', caret: 6, model: '1259' } },
            // unsupported token: there is no meridiem pattern, so the letters are never accepted and the value keeps a trailing space
            { keys: '1259am', expected: { value: '12:59 ', caret: 6, model: '1259' } },
            // unsupported token: there is no meridiem pattern, so the letters are never accepted and the value keeps a trailing space
            { keys: '1259pm', expected: { value: '12:59 ', caret: 6, model: '1259' } },
            // unsupported token: there is no meridiem pattern, so the letters are never accepted and the value keeps a trailing space
            { keys: '1259AM', expected: { value: '12:59 ', caret: 6, model: '1259' } },
            // unsupported token: there is no meridiem pattern, so the letters are never accepted and the value keeps a trailing space
            { keys: '1259xx', expected: { value: '12:59 ', caret: 6, model: '1259' } },
            { keys: '0100', expected: { value: '01:00', caret: 5, model: '0100' } },
            { keys: '0030', expected: { value: '01:30', caret: 5, model: '0130' } },
            { keys: '1300', expected: { value: '01:30 ', caret: 6, model: '0130' } },
            // by design: the 9 can only be a tens-of-minutes digit, so it is padded
            { keys: '1299', expected: { value: '12:09 ', caret: 6, model: '1209' } },
            { keys: '1230pm', expected: { value: '12:30 ', caret: 6, model: '1230' } },
            { keys: '1230amx', expected: { value: '12:30 ', caret: 6, model: '1230' } },
        ]);
    });

    describe('Hh:m0 aa editing inside an existing value', () => {
        const config: Config = { mask: 'Hh:m0 aa', apm: true, leadZeroDateTime: true };
        check(config, [
            {
                initial: '1230am',
                edit: { start: 0, end: 0, key: '0' },
                expected: { value: '01:23 ', caret: 1, model: '0123' },
            },
            {
                initial: '1230am',
                edit: { start: 0, end: 0, key: '2' },
                expected: { value: '02:12 ', caret: 4, model: '0212' },
            },
            {
                initial: '1230am',
                edit: { start: 1, end: 1, key: '3' },
                expected: { value: '01:32 ', caret: 4, model: '0132' },
            },
            {
                initial: '1230am',
                edit: { start: 1, end: 1, key: '1' },
                expected: { value: '11:23 ', caret: 2, model: '1123' },
            },
            {
                initial: '1230am',
                edit: { start: 2, end: 2, key: '5' },
                expected: { value: '12:53 ', caret: 4, model: '1253' },
            },
            {
                initial: '1230am',
                edit: { start: 3, end: 3, key: '6' },
                expected: { value: '12:06 ', caret: 6, model: '1206' },
            },
            {
                initial: '1230am',
                edit: { start: 3, end: 3, key: '4' },
                expected: { value: '12:43 ', caret: 4, model: '1243' },
            },
            {
                initial: '1230am',
                edit: { start: 4, end: 4, key: '9' },
                expected: { value: '12:39 ', caret: 5, model: '1239' },
            },
            {
                initial: '1230am',
                edit: { start: 5, end: 5, key: 'p' },
                expected: { value: '12:30 ', caret: 6, model: '1230' },
            },
            {
                initial: '1230am',
                edit: { start: 6, end: 6, key: 'p' },
                expected: { value: '12:30 ', caret: 6, model: '1230' },
            },
            {
                initial: '1230am',
                edit: { start: 7, end: 7, key: 'p' },
                expected: { value: '12:30 ', caret: 6, model: '1230' },
            },
            {
                initial: '1230am',
                edit: { start: 0, end: 2, key: '1' },
                expected: { value: '1:30 ', caret: 1, model: '130' },
            },
            {
                initial: '1230am',
                edit: { start: 0, end: 2, key: '9' },
                expected: { value: '9:30 ', caret: 1, model: '930' },
            },
            {
                initial: '1230am',
                edit: { start: 6, end: 8, key: 'p' },
                expected: { value: '12:30 ', caret: 6, model: '1230' },
            },
        ]);
    });

    describe('Hh:m0 aa Backspace', () => {
        const config: Config = { mask: 'Hh:m0 aa', apm: true, leadZeroDateTime: true };
        check(config, [
            {
                initial: '1230am',
                edit: { start: 2, end: 2, key: 'Backspace' },
                expected: { value: '1:30 ', caret: 1, model: '130' },
            },
            {
                initial: '1230am',
                edit: { start: 3, end: 3, key: 'Backspace' },
                expected: { value: '12:30 ', caret: 2, model: '1230' },
            },
            {
                initial: '1230am',
                edit: { start: 5, end: 5, key: 'Backspace' },
                expected: { value: '12:3', caret: 4, model: '123' },
            },
            {
                initial: '1230am',
                edit: { start: 8, end: 8, key: 'Backspace' },
                expected: { value: '12:30', caret: 5, model: '1230' },
            },
            {
                initial: '1230am',
                edit: { start: 1, end: 1, key: 'Backspace' },
                expected: { value: '2:30 ', caret: 0, model: '230' },
            },
            { keys: '1230\b\b', expected: { value: '12:', caret: 3, model: '12' } },
        ]);
    });

    describe('Hh:m0:s0 with apm', () => {
        const config: Config = { mask: 'Hh:m0:s0', apm: true, leadZeroDateTime: true };
        check(config, [
            { keys: '0', expected: { value: '0', caret: 1, model: '0' } },
            // a 12-hour clock has no hour 00: a typed 00 becomes 01 (leadZeroDateTime)
            { keys: '00', expected: { value: '01', caret: 2, model: '01' } },
            { keys: '1', expected: { value: '1', caret: 1, model: '1' } },
            { keys: '10', expected: { value: '10', caret: 2, model: '10' } },
            { keys: '12', expected: { value: '12', caret: 2, model: '12' } },
            { keys: '13', expected: { value: '01:3', caret: 4, model: '013' } },
            { keys: '09', expected: { value: '09', caret: 2, model: '09' } },
            { keys: '123', expected: { value: '12:3', caret: 4, model: '123' } },
            { keys: '1234', expected: { value: '12:34', caret: 5, model: '1234' } },
            { keys: '123456', expected: { value: '12:34:56', caret: 8, model: '123456' } },
            { keys: '236060', expected: { value: '02:36:06', caret: 8, model: '023606' } },
            { paste: '00', expected: { value: '01', caret: 2, model: '01' } },
            // a pasted 00 hour becomes 01 and no digit is lost
            { paste: '00:00:00', expected: { value: '01:00:00', caret: 8, model: '010000' } },
            { paste: '000000', expected: { value: '01:00:00', caret: 8, model: '010000' } },
            { paste: '123456', expected: { value: '12:34:56', caret: 8, model: '123456' } },
            { paste: '13', expected: { value: '01:3', caret: 4, model: '013' } },
            {
                initial: '123456',
                edit: { start: 1, end: 1, key: '9' },
                expected: { value: '01:09:23', caret: 5, model: '010923' },
            },
            {
                initial: '123456',
                edit: { start: 2, end: 2, key: '5' },
                expected: { value: '12:53:45', caret: 4, model: '125345' },
            },
        ]);
    });

    describe('M0/d0 typing a month and day key by key', () => {
        const config: Config = { mask: 'M0/d0', leadZeroDateTime: true };
        check(config, [
            { keys: '0', expected: { value: '0', caret: 1, model: '0' } },
            { keys: '1', expected: { value: '1', caret: 1, model: '1' } },
            { keys: '2', expected: { value: '02', caret: 2, model: '02' } },
            { keys: '3', expected: { value: '03', caret: 2, model: '03' } },
            { keys: '9', expected: { value: '09', caret: 2, model: '09' } },
            { keys: '12', expected: { value: '12', caret: 2, model: '12' } },
            { keys: '13', expected: { value: '01/3', caret: 4, model: '013' } },
            { keys: '19', expected: { value: '01/09', caret: 5, model: '0109' } },
            { keys: '00', expected: { value: '01', caret: 2, model: '01' } },
            { keys: '01', expected: { value: '01', caret: 2, model: '01' } },
            { keys: '123', expected: { value: '12/3', caret: 4, model: '123' } },
            { keys: '124', expected: { value: '12/04', caret: 5, model: '1204' } },
            { keys: '1231', expected: { value: '12/31', caret: 5, model: '1231' } },
            { keys: '1232', expected: { value: '12/03', caret: 5, model: '1203' } },
            { keys: '1235', expected: { value: '12/03', caret: 5, model: '1203' } },
            { keys: '1240', expected: { value: '12/04', caret: 5, model: '1204' } },
            { keys: '1200', expected: { value: '12/01', caret: 5, model: '1201' } },
            { keys: '0230', expected: { value: '02/30', caret: 5, model: '0230' } },
            { keys: '31', expected: { value: '03/1', caret: 4, model: '031' } },
            { keys: '1331', expected: { value: '01/03', caret: 5, model: '0103' } },
            { keys: '12300', expected: { value: '12/30', caret: 5, model: '1230' } },
        ]);
    });

    describe('M0/d0 editing inside an existing value', () => {
        const config: Config = { mask: 'M0/d0', leadZeroDateTime: true };
        check(config, [
            {
                initial: '1231',
                edit: { start: 0, end: 0, key: '0' },
                expected: { value: '01/23', caret: 1, model: '0123' },
            },
            {
                initial: '1231',
                edit: { start: 0, end: 0, key: '2' },
                expected: { value: '02/12', caret: 4, model: '0212' },
            },
            {
                initial: '1231',
                edit: { start: 1, end: 1, key: '3' },
                expected: { value: '01/32', caret: 4, model: '0132' },
            },
            {
                initial: '1231',
                edit: { start: 1, end: 1, key: '1' },
                expected: { value: '11/23', caret: 2, model: '1123' },
            },
            {
                initial: '1231',
                edit: { start: 2, end: 2, key: '1' },
                expected: { value: '12/13', caret: 4, model: '1213' },
            },
            {
                initial: '1231',
                edit: { start: 3, end: 3, key: '4' },
                expected: { value: '12/04', caret: 5, model: '1204' },
            },
            {
                initial: '1231',
                edit: { start: 3, end: 3, key: '2' },
                expected: { value: '12/23', caret: 4, model: '1223' },
            },
            {
                initial: '1231',
                edit: { start: 4, end: 4, key: '5' },
                expected: { value: '12/03', caret: 5, model: '1203' },
            },
            {
                initial: '1231',
                edit: { start: 4, end: 4, key: '0' },
                expected: { value: '12/30', caret: 5, model: '1230' },
            },
            {
                initial: '1231',
                edit: { start: 5, end: 5, key: '5' },
                expected: { value: '12/31', caret: 5, model: '1231' },
            },
            {
                initial: '1231',
                edit: { start: 0, end: 2, key: '4' },
                expected: { value: '04/31', caret: 4, model: '0431' },
            },
            {
                initial: '1231',
                edit: { start: 3, end: 5, key: '4' },
                expected: { value: '12/04', caret: 5, model: '1204' },
            },
            {
                initial: '1231',
                edit: { start: 3, end: 5, key: '2' },
                expected: { value: '12/2', caret: 4, model: '122' },
            },
        ]);
    });

    describe('hh:m0 lone hour token', () => {
        const config: Config = { mask: 'hh:m0', leadZeroDateTime: true };
        check(config, [
            { keys: '1', expected: { value: '1', caret: 1, model: '1' } },
            { keys: '2', expected: { value: '2', caret: 1, model: '2' } },
            { keys: '3', expected: { value: '3', caret: 1, model: '3' } },
            { keys: '13', expected: { value: '13', caret: 2, model: '13' } },
            { keys: '23', expected: { value: '23', caret: 2, model: '23' } },
            { keys: '24', expected: { value: '02:4', caret: 4, model: '024' } },
            { keys: '25', expected: { value: '02:5', caret: 4, model: '025' } },
            { keys: '2359', expected: { value: '23:59', caret: 5, model: '2359' } },
            {
                initial: '1234',
                edit: { start: 1, end: 1, key: '5' },
                expected: { value: '15:23', caret: 2, model: '1523' },
            },
        ]);
    });

    describe('hh:m0 lone hour token with apm', () => {
        const config: Config = { mask: 'hh:m0', apm: true, leadZeroDateTime: true };
        check(config, [
            { keys: '1', expected: { value: '1', caret: 1, model: '1' } },
            { keys: '12', expected: { value: '12', caret: 2, model: '12' } },
            { keys: '13', expected: { value: '01:3', caret: 4, model: '013' } },
            { keys: '19', expected: { value: '01:09', caret: 5, model: '0109' } },
            { keys: '1259', expected: { value: '12:59', caret: 5, model: '1259' } },
            {
                initial: '1234',
                edit: { start: 1, end: 1, key: '5' },
                expected: { value: '01:52', caret: 4, model: '0152' },
            },
        ]);
    });

    describe('M0/d0 Backspace and Delete', () => {
        const config: Config = { mask: 'M0/d0', leadZeroDateTime: true };
        check(config, [
            // deleting the second month digit pads the month instead of leaving month 13
            {
                initial: '1231',
                edit: { start: 2, end: 2, key: 'Backspace' },
                expected: { value: '01/31', caret: 1, model: '0131' },
            },
            {
                initial: '1231',
                edit: { start: 3, end: 3, key: 'Backspace' },
                expected: { value: '12/31', caret: 2, model: '1231' },
            },
            {
                initial: '1231',
                edit: { start: 5, end: 5, key: 'Backspace' },
                expected: { value: '12/3', caret: 4, model: '123' },
            },
            {
                initial: '1231',
                edit: { start: 1, end: 1, key: 'Backspace' },
                expected: { value: '02/31', caret: 0, model: '0231' },
            },
            {
                initial: '1231',
                edit: { start: 2, end: 2, key: 'Delete' },
                expected: { value: '12/31', caret: 3, model: '1231' },
            },
            {
                initial: '1231',
                edit: { start: 0, end: 0, key: 'Delete' },
                expected: { value: '02/31', caret: 0, model: '0231' },
            },
            { keys: '1231\b\b', expected: { value: '12/', caret: 3, model: '12' } },
        ]);
    });

    describe('out-of-range months, hours and 00 fields (PR1 fixes)', () => {
        describe('year-first month 13 and 14', () => {
            check({ mask: '0000-M0-d0', leadZeroDateTime: true }, [
                { keys: '202013', expected: { value: '2020-01-3', caret: 9, model: '2020013' } },
                { keys: '202014', expected: { value: '2020-01-04', caret: 10, model: '20200104' } },
                { keys: '202012', expected: { value: '2020-12', caret: 7, model: '202012' } },
            ]);
            check({ mask: '0000M0d0', leadZeroDateTime: true }, [
                { keys: '202013', expected: { value: '2020013', caret: 7, model: '2020013' } },
            ]);
            check({ mask: '0000.M0.d0', leadZeroDateTime: true }, [
                {
                    paste: '20201315',
                    expected: { value: '2020.01.31', caret: 10, model: '20200131' },
                },
                {
                    initial: '20201315',
                    expected: { value: '2020.01.31', caret: 10, model: '20200131' },
                },
                {
                    paste: '20201215',
                    expected: { value: '2020.12.15', caret: 10, model: '20201215' },
                },
            ]);
        });

        describe('hours above the limit', () => {
            check({ mask: 'Hh:m0:s0', leadZeroDateTime: true }, [
                { paste: '246060', expected: { value: '02:46:06', caret: 8, model: '024606' } },
                { initial: '246060', expected: { value: '02:46:06', caret: 8, model: '024606' } },
                { keys: '2359', expected: { value: '23:59', caret: 5, model: '2359' } },
            ]);
            check({ mask: 'Hh:m0:s0' }, [
                { keys: '24', expected: { value: '2:4', caret: 3, model: '24' } },
            ]);
            check({ mask: 'Hh:m0:s0', apm: true, leadZeroDateTime: true }, [
                { keys: '19', expected: { value: '01:09', caret: 5, model: '0109' } },
                { keys: '1300', expected: { value: '01:30:0', caret: 7, model: '01300' } },
                { keys: '1259', expected: { value: '12:59', caret: 5, model: '1259' } },
            ]);
            check({ mask: 'Hh:m0:s0', apm: true }, [
                { keys: '13', expected: { value: '1:3', caret: 3, model: '13' } },
            ]);
            check({ mask: 'd0/M0/0000 Hh:m0:s0', leadZeroDateTime: true }, [
                {
                    keys: '1112202324',
                    expected: { value: '11/12/2023 02:4', caret: 15, model: '11122023024' },
                },
            ]);
        });

        describe('00 is clamped to 01 for typed and pasted input only', () => {
            check({ mask: 'd0/M0/0000', leadZeroDateTime: true }, [
                {
                    paste: '00062020',
                    expected: { value: '01/06/2020', caret: 10, model: '01062020' },
                },
                {
                    paste: '15002020',
                    expected: { value: '15/01/2020', caret: 10, model: '15012020' },
                },
                // programmatic writes round-trip unchanged: 00 is a stored "unknown" convention
                {
                    initial: '00062020',
                    expected: { value: '00/06/2020', caret: 10, model: '00062020' },
                },
                {
                    initial: '15002020',
                    expected: { value: '15/00/2020', caret: 10, model: '15002020' },
                },
                {
                    initial: '15062020',
                    edit: { start: 5, end: 5, key: 'Backspace' },
                    expected: { value: '15/01/2020', caret: 4, model: '15012020' },
                },
                {
                    initial: '15062020',
                    edit: { start: 2, end: 2, key: 'Backspace' },
                    expected: { value: '01/06/2020', caret: 1, model: '01062020' },
                },
            ]);
            check({ mask: 'd0/M0/0000' }, [
                { keys: '00', expected: { value: '00', caret: 2, model: '00' } },
                { keys: '1500', expected: { value: '15/00', caret: 5, model: '1500' } },
                {
                    initial: '15002020',
                    expected: { value: '15/00/2020', caret: 10, model: '15002020' },
                },
            ]);
            check({ mask: 'M0/d0', leadZeroDateTime: true }, [
                { paste: '0100', expected: { value: '01/01', caret: 5, model: '0101' } },
                { initial: '0100', expected: { value: '01/00', caret: 5, model: '0100' } },
                // Feb 30 needs the year: the mask does not validate it (use the validation input)
                { keys: '0230', expected: { value: '02/30', caret: 5, model: '0230' } },
            ]);
            check({ mask: 'M0/d0/0000', leadZeroDateTime: true }, [
                {
                    initial: '12312020',
                    edit: { start: 2, end: 2, key: 'Backspace' },
                    expected: { value: '01/31/2020', caret: 1, model: '01312020' },
                },
            ]);
            check({ mask: 'M0/d0' }, [
                {
                    initial: '1231',
                    edit: { start: 2, end: 2, key: 'Backspace' },
                    expected: { value: '1/31', caret: 1, model: '131' },
                },
            ]);
        });

        describe('Backspace through a showMaskTyped date', () => {
            // a lone month digit before placeholders is not padded: the date empties out
            check({ mask: 'M0-d0-0000', leadZeroDateTime: true, showMaskTyped: true }, [
                {
                    keys: '12310000' + '\b'.repeat(10),
                    expected: { value: '__-__-____', caret: 0, model: '' },
                },
            ]);
            check({ mask: 'M0/d0', leadZeroDateTime: true }, [
                { keys: '12\b', expected: { value: '1', caret: 1, model: '1' } },
                { keys: '12/\b\b', expected: { value: '1', caret: 1, model: '1' } },
            ]);
        });

        describe('apm hour 00', () => {
            check({ mask: 'Hh:m0:s0', apm: true, leadZeroDateTime: true }, [
                { keys: '000000', expected: { value: '01:00:00', caret: 8, model: '010000' } },
                // a programmatic write keeps its 00
                { initial: '000000', expected: { value: '00:00:00', caret: 8, model: '000000' } },
                { keys: '0130', expected: { value: '01:30', caret: 5, model: '0130' } },
            ]);
            check({ mask: 'Hh:m0:s0', apm: true }, [
                { keys: '00', expected: { value: '00', caret: 2, model: '00' } },
                { keys: '000000', expected: { value: '00:00:00', caret: 8, model: '000000' } },
            ]);
            check({ mask: 'Hh:m0 aa', apm: true, leadZeroDateTime: true }, [
                { paste: '0030', expected: { value: '01:30', caret: 5, model: '0130' } },
            ]);
        });
    });
});
