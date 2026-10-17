import { afterEach, describe, expect, it, vi } from 'vitest';

import { createHarness } from './utils/characterization-harness';
import { pasteTest } from './utils/test-functions.component';
import { createTriModeFixture, TRI_MODES } from './utils/tri-mode-harness';

/**
 * With leadZeroDateTime only a typed or pasted `00` day, month or 12-hour hour becomes `01`.
 * A `00` that reached the input any other way (a programmatic write, a re-render, a blur, an edit
 * in another field) is a stored "unknown" and must round-trip unchanged and leave the control clean.
 */
describe('00 clamp applies to user edits only', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('re-rendering a written 00', () => {
        it.each([
            ['dropSpecialCharacters', 'dropSpecialCharacters'],
            ['showMaskTyped', 'showMaskTyped'],
            ['leadZeroDateTime', 'leadZeroDateTime'],
        ] as const)('keeps 00/06/2020 when the %s input toggles', async (_title, input) => {
            const harness = createHarness();
            harness.component.mask.set('d0/M0/0000');
            harness.component.leadZeroDateTime.set(true);
            harness.fixture.detectChanges();
            await harness.settle();
            await harness.write('00062020');
            expect(harness.el.value).toBe('00/06/2020');

            const toggle = harness.component[input] as { set: (v: boolean) => void };
            const flipped = input !== 'dropSpecialCharacters';
            toggle.set(flipped);
            await harness.settle();
            toggle.set(!flipped);
            await harness.settle();
            toggle.set(flipped);
            await harness.settle();

            expect(harness.el.value).toMatch(/^00\/06\/2020/);
            expect(harness.component.form.dirty).toBe(false);
        });

        it('keeps a typed 00 clamped to 01 when the input re-renders', async () => {
            const harness = createHarness();
            harness.component.mask.set('d0/M0/0000');
            harness.component.leadZeroDateTime.set(true);
            harness.fixture.detectChanges();
            await harness.settle();
            await harness.type('00062020');
            expect(harness.el.value).toBe('01/06/2020');

            harness.component.showMaskTyped.set(true);
            await harness.settle();
            harness.component.showMaskTyped.set(false);
            await harness.settle();

            expect(harness.el.value).toBe('01/06/2020');
            expect(harness.component.form.value).toBe('01062020');
        });
    });

    describe('the clamp follows the edit through a prefix and a suffix', () => {
        it('clamps a typed 00 day behind a prefix', async () => {
            const harness = createHarness();
            harness.component.mask.set('d0/M0/0000');
            harness.component.leadZeroDateTime.set(true);
            harness.component.prefix.set('D ');
            harness.fixture.detectChanges();
            await harness.settle();
            await harness.type('00062020');

            expect(harness.el.value).toBe('D 01/06/2020');
            expect(harness.component.form.value).toBe('01062020');
        });

        it('clamps a typed 00 month before a suffix', async () => {
            const harness = createHarness();
            harness.component.mask.set('d0/M0');
            harness.component.leadZeroDateTime.set(true);
            harness.component.suffix.set(' x');
            harness.fixture.detectChanges();
            await harness.settle();
            await harness.type('1500');

            expect(harness.el.value).toBe('15/01 x');
            expect(harness.component.form.value).toBe('1501');
        });
    });

    describe('a pasted 00 does not leak into later renders of the same control', () => {
        const mount = async () => {
            const harness = createHarness();
            harness.component.mask.set('d0/M0/0000');
            harness.component.leadZeroDateTime.set(true);
            harness.fixture.detectChanges();
            await harness.settle();
            return harness;
        };

        it('keeps a written 00 after the same value was pasted, also across a showMaskTyped toggle', async () => {
            const harness = await mount();
            pasteTest('00062020', harness.fixture);
            await harness.settle();
            expect(harness.el.value).toBe('01/06/2020');

            await harness.write('00062020');
            expect(harness.el.value).toBe('00/06/2020');
            expect(harness.component.form.value).toBe('00062020');

            harness.component.showMaskTyped.set(true);
            await harness.settle();
            harness.component.showMaskTyped.set(false);
            await harness.settle();
            expect(harness.el.value).toMatch(/^00\/06\/2020/);
            expect(harness.component.form.value).toBe('00062020');
        });

        it('keeps a typed 00 clamped while a later write of another value renders', async () => {
            const harness = await mount();
            await harness.type('00');
            expect(harness.el.value).toBe('01');

            await harness.write('15062020');
            expect(harness.el.value).toBe('15/06/2020');
            await harness.write('00062020');
            expect(harness.el.value).toBe('00/06/2020');
            expect(harness.component.form.value).toBe('00062020');
        });
    });

    describe.each(TRI_MODES)('blur of a written 00 - %s mode', (mode) => {
        it.each([
            ['d0/M0/0000', '00062020', '00/06/2020'],
            ['d0/M0/0000', '15002020', '15/00/2020'],
            ['M0/d0', '0015', '00/15'],
        ])('%s: %s stays %s with no change of the bound value', async (mask, value, display) => {
            const harness = await createTriModeFixture(mode, { mask, leadZeroDateTime: true });
            await harness.setBoundValue(value);
            await harness.flush();
            expect(harness.getInput().value).toBe(display);

            await harness.blur();

            expect(harness.getInput().value).toBe(display);
            expect(harness.getBoundValue()).toBe(value);
            if (mode !== 'signal') {
                // a blur marks a signal field touched by design; reactive and template stay pristine
                expect(harness.isUserInteracted()).toBe(false);
            }
        });

        it('12-hour 000000 stays 00:00:00 after a blur', async () => {
            const harness = await createTriModeFixture(mode, {
                mask: 'Hh:m0:s0',
                apm: true,
                leadZeroDateTime: true,
            });
            await harness.setBoundValue('000000');
            await harness.flush();
            await harness.blur();

            expect(harness.getInput().value).toBe('00:00:00');
            expect(harness.getBoundValue()).toBe('000000');
        });

        it('a typed 00 day is clamped to 01 and stays so after a blur', async () => {
            const harness = await createTriModeFixture(mode, {
                mask: 'd0/M0/0000',
                leadZeroDateTime: true,
            });
            await harness.typeValue('00062020');
            expect(harness.getInput().value).toBe('01/06/2020');

            await harness.blur();

            expect(harness.getInput().value).toBe('01/06/2020');
            expect(harness.getBoundValue()).toBe('01062020');
        });
    });
});
