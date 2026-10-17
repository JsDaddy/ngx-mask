import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';

import { mount } from './utils/browser-harness';
import { MaskHarnessComponent } from './utils/mask-harness.component';

/**
 * Real-chromium pins for the keepCharacterPositions oddities that the jsdom characterization
 * (`keep-character-positions-characterization.spec.ts`) marks `// current behaviour`. They are
 * confirmed to happen in a real browser, so they are candidate bugs: pinned, not endorsed. When
 * one is fixed, flip its expectation here and in the jsdom spec.
 */

const phone = { mask: '(000) 000-0000', keepCharacterPositions: true, showMaskTyped: true };
const prefixed = {
    mask: '000-000',
    prefix: '+7 ',
    keepCharacterPositions: true,
    showMaskTyped: true,
};
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

    // current behaviour: the display loses the suffix after a programmatic write ...
    it('a rejected key drops the suffix when the value was written programmatically', async () => {
        expect(await press(suffixed, { written: '123' }, 3, 3, '9')).toEqual({
            value: '123',
            caret: 3,
            model: '123',
        });
    });

    // ... but keeps it when the user typed the very same value
    it('a rejected key keeps the suffix when the user typed the value', async () => {
        expect(await press(suffixed, { typed: '123' }, 3, 3, '9')).toEqual({
            value: '123 kg',
            caret: 3,
            model: '123',
        });
    });

    // current behaviour: the typed digit eats the prefix characters of the selection
    it('a digit over a selection that starts inside the prefix eats the prefix', async () => {
        expect(await press(prefixed, { written: '123456' }, 1, 5, '9')).toEqual({
            value: '+__9-456',
            caret: 4,
            model: '9456',
        });
    });

    // current behaviour: the prefix character leaks into the model
    it('a digit over a selection spanning the end of the prefix leaks it into the model', async () => {
        expect(await press(prefixed, { written: '123456' }, 2, 4, '9')).toEqual({
            value: '+7_93-456',
            caret: 4,
            model: '793456',
        });
    });

    // current behaviour: the typed digit leaves the suffix text
    it('a digit over a selection reaching into the suffix mangles the suffix', async () => {
        expect(await press(suffixed, { written: '123' }, 1, 5, '9')).toEqual({
            value: '1__g',
            caret: 1,
            model: '1g',
        });
    });
});
