import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';

import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

/**
 * Real-chromium counterparts of the keepCharacterPositions rows in the jsdom characterization
 * (`keep-character-positions-characterization.spec.ts`): a rejected key keeps the display, a
 * selection reaching into the prefix or the suffix keeps both, and a selection deleted up to the
 * end drops the trailing placeholders. The first two rows still pin the browser's own Delete and
 * Backspace behaviour next to separators.
 */

const phone = { mask: '(000) 000-0000', keepCharacterPositions: true, showMaskTyped: true };
const prefixed = {
    mask: '000-000',
    prefix: '+7 ',
    keepCharacterPositions: true,
    showMaskTyped: true,
};
const dollar = {
    mask: '0000.00',
    prefix: '$',
    keepCharacterPositions: true,
    showMaskTyped: true,
};
const bare = { mask: '000-000', keepCharacterPositions: true };
const suffixed = { mask: '000', suffix: ' kg', keepCharacterPositions: true, showMaskTyped: true };

type Outcome = { value: string; caret: number | null; model: unknown };

/** Writes `initial` through the control (or types it), selects `start`-`end` and presses `keys`. */
async function press(
    config: Record<string, unknown>,
    initial: { written: string } | { typed: string },
    start: number,
    end: number,
    keys: string
): Promise<Outcome> {
    const m = await mount(MaskHarnessComponent, config);
    if ('written' in initial) {
        m.component.form.setValue(initial.written);
        await m.settle();
    } else {
        await m.type('#masked', initial.typed);
    }
    const el = m.get('#masked');
    el.focus();
    el.setSelectionRange(start, end);
    await userEvent.keyboard(keys);
    await m.settle();
    return { value: el.value, caret: el.selectionStart, model: m.component.form.value };
}

/** Focuses the empty control without a click, as `el.focus()` leaves the caret, and presses `keys`. */
async function pressOnFocus(config: Record<string, unknown>, keys: string): Promise<Outcome> {
    const m = await mount(MaskHarnessComponent, config);
    await m.settle();
    const el = m.get('#masked');
    el.focus();
    await userEvent.keyboard(keys);
    await m.settle();
    return { value: el.value, caret: el.selectionStart, model: m.component.form.value };
}

describe('keepCharacterPositions oddities in a real browser', () => {
    it('Delete at the very end changes nothing: the browser fires no input event', async () => {
        expect(await press(phone, { written: '0123456789' }, 14, 14, '{Delete}')).toEqual({
            value: '(012) 345-6789',
            caret: 14,
            model: '0123456789',
        });
    });

    it('Backspace right after a separator only moves the caret back', async () => {
        expect(await press(phone, { written: '0123456789' }, 6, 6, '{Backspace}')).toEqual({
            value: '(012) 345-6789',
            caret: 4,
            model: '0123456789',
        });
    });

    it('a rejected key keeps the suffix when the value was written programmatically', async () => {
        expect(await press(suffixed, { written: '123' }, 3, 3, '9')).toEqual({
            value: '123 kg',
            caret: 3,
            model: '123',
        });
    });

    it('a rejected key keeps the suffix when the user typed the value', async () => {
        expect(await press(suffixed, { typed: '123' }, 3, 3, '9')).toEqual({
            value: '123 kg',
            caret: 3,
            model: '123',
        });
    });

    it('a rejected letter keeps the suffix when the value was written programmatically', async () => {
        expect(await press(suffixed, { written: '123' }, 1, 1, 'a')).toEqual({
            value: '123 kg',
            caret: 1,
            model: '123',
        });
    });

    it('a rejected letter over a selection keeps the display and the caret at its start', async () => {
        expect(await press(phone, { written: '0123456789' }, 1, 3, 'a')).toEqual({
            value: '(012) 345-6789',
            caret: 1,
            model: '0123456789',
        });
    });

    it('a rejected letter over a selection that starts inside the prefix keeps the display', async () => {
        expect(await press(prefixed, { written: '123456' }, 1, 5, 'a')).toEqual({
            value: '+7 123-456',
            caret: 3,
            model: '123456',
        });
    });

    it('a digit over a selection that starts inside the prefix keeps the prefix', async () => {
        expect(await press(prefixed, { written: '123456' }, 1, 5, '9')).toEqual({
            value: '+7 9_3-456',
            caret: 4,
            model: '93456',
        });
    });

    it('a digit over a selection spanning the end of the prefix keeps it out of the model', async () => {
        expect(await press(prefixed, { written: '123456' }, 2, 4, '9')).toEqual({
            value: '+7 923-456',
            caret: 4,
            model: '923456',
        });
    });

    it('the pressed digit is typed when a selection starts on a one-character prefix', async () => {
        expect(await press(dollar, { written: '123456' }, 0, 3, '9')).toEqual({
            value: '$9_34.56',
            caret: 2,
            model: '93456',
        });
    });

    it('a digit over a selection reaching into the suffix keeps the suffix', async () => {
        expect(await press(suffixed, { written: '123' }, 1, 5, '9')).toEqual({
            value: '19_ kg',
            caret: 2,
            model: '19',
        });
    });

    it('a digit over only the suffix is rejected and the display kept', async () => {
        expect(await press(suffixed, { written: '123' }, 3, 6, '9')).toEqual({
            value: '123 kg',
            caret: 3,
            model: '123',
        });
    });

    it('deleting a selection up to the end drops the trailing placeholders and separators', async () => {
        expect(await press(bare, { written: '123456' }, 4, 7, '{Backspace}')).toEqual({
            value: '123',
            caret: 3,
            model: '123',
        });
    });

    it('deleting a selection up to the end keeps the gaps in front of the last digit', async () => {
        const m = await mount(MaskHarnessComponent, bare);
        m.component.form.setValue('123456');
        await m.settle();
        const el = m.get('#masked');
        el.focus();
        el.setSelectionRange(2, 2);
        await userEvent.keyboard('{Backspace}');
        await m.settle();
        el.setSelectionRange(3, 7);
        await userEvent.keyboard('{Backspace}');
        await m.settle();
        expect({
            value: el.value,
            caret: el.selectionStart,
            model: m.component.form.value,
        }).toEqual({
            value: '1_3',
            caret: 3,
            model: '13',
        });
    });

    it('typing into the focused empty phone skeleton fills the first slots', async () => {
        expect(await pressOnFocus(phone, '98')).toEqual({
            value: '(98_) ___-____',
            caret: 3,
            model: '98',
        });
    });

    it('typing after the End key on the empty phone skeleton fills the first slots', async () => {
        expect(await pressOnFocus(phone, '{End}98')).toEqual({
            value: '(98_) ___-____',
            caret: 3,
            model: '98',
        });
    });

    it('typing into the focused empty skeleton fills the first slots after the prefix', async () => {
        expect(await pressOnFocus(prefixed, '98')).toEqual({
            value: '+7 98_-___',
            caret: 5,
            model: '98',
        });
    });
});
