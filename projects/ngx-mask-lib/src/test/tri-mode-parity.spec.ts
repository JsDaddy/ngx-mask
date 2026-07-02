import { expect } from 'vitest';

import type { TriModeMaskConfig } from './utils/tri-mode-harness';
import { TRI_MODES, createTriModeFixture } from './utils/tri-mode-harness';

/**
 * Tri-mode parity suite: proves every mask type behaves IDENTICALLY across the three
 * form-binding modes (Reactive [formControl], Template-driven [(ngModel)], Signal Forms
 * [formField]).
 *
 * Display expectations are copied verbatim from the verified Reactive specs
 * (basic-logic.spec.ts, separator.spec.ts, percent.spec.ts, custom-date.spec.ts,
 * time-mask.spec.ts, dynamic.spec.ts, repeat-mask.spec.ts, custom-patterns.spec.ts,
 * validation.spec.ts, forms.spec.ts) — do NOT invent new expected values here.
 * Bound-value expectations follow the dropSpecialCharacters contract those specs assert:
 * default (true) → unmasked value, false → masked value.
 */

type ParityStep = {
    /** Value typed char-by-char via typeTest. */
    type: string;
    /** Expected DOM display value. */
    display: string;
    /** Expected form-side (bound) value. */
    bound: string;
};

type ParityCase = {
    name: string;
    config: TriModeMaskConfig;
    steps: ParityStep[];
    /** Modes skipped because of a discovered mode-specific product bug (see PARITY BUG comments). */
    skipModes?: readonly string[];
};

const PARITY_CASES: ParityCase[] = [
    {
        // basic-logic.spec.ts — plain digit mask
        name: 'basic digits mask 0000',
        config: { mask: '0000' },
        steps: [{ type: '1234', display: '1234', bound: '1234' }],
    },
    {
        // basic-logic.spec.ts:100-107 — pattern with literals
        name: 'pattern with literals (000) 000-0000',
        config: { mask: '(000) 000-0000' },
        steps: [{ type: '1234567', display: '(123) 456-7', bound: '1234567' }],
    },
    {
        // separator.spec.ts — separator.2 with comma thousandSeparator typing reflow.
        // dropSpecialCharacters is false here on purpose: with the default (true), a
        // separator mask sets isNumberValue and the bound value becomes a NUMBER
        // (1000000.00 → 1000000), which the Signal Forms model echo then re-masks,
        // dropping the trailing '.00' from the display. With drop=false the bound value
        // is the masked string in every mode (same contract forms.spec.ts asserts).
        name: 'separator.2 with thousandSeparator typing reflow (dropSpecialCharacters false)',
        config: { mask: 'separator.2', thousandSeparator: ',', dropSpecialCharacters: false },
        steps: [{ type: '1000000.00', display: '1,000,000.00', bound: '1,000,000.00' }],
    },
    {
        // percent.spec.ts — percent.2 truncates to two decimals
        name: 'percent.2',
        config: { mask: 'percent.2' },
        steps: [{ type: '99.9999', display: '99.99', bound: '99.99' }],
    },
    {
        // basic-logic.spec.ts:128-135 — IP mask keeps typed dots in display,
        // bound value is the unmasked digits (dropSpecialCharacters default).
        //
        // Regression case: in signal mode the FormField model echo used to re-enter
        // writeValue with the unmasked digits ('192168178'), which the IP mask cannot
        // re-expand to the user's dot positions — the display got rewritten from
        // '192.168.1.78' to '192.168.178'. The directive now skips the echo of a value
        // it just propagated itself (see _lastPropagatedValue in ngx-mask.directive.ts).
        name: 'IP mask',
        config: { mask: 'IP' },
        steps: [{ type: '192.168.1.78', display: '192.168.1.78', bound: '192168178' }],
    },
    {
        // basic-logic.spec.ts:225-253 — CPF_CNPJ switches format by length
        name: 'CPF_CNPJ mask',
        config: { mask: 'CPF_CNPJ' },
        steps: [
            { type: '12345678901', display: '123.456.789-01', bound: '12345678901' },
            { type: '12345678901234', display: '12.345.678/9012-34', bound: '12345678901234' },
        ],
    },
    {
        // basic-logic.spec.ts:255-312 — CPF_CNPJ_ALPHA accepts letters
        name: 'CPF_CNPJ_ALPHA mask',
        config: { mask: 'CPF_CNPJ_ALPHA' },
        steps: [{ type: 'ABCDEF0123456', display: 'AB.CDE.F01/2345-6', bound: 'ABCDEF0123456' }],
    },
    {
        // custom-date.spec.ts / forms.spec.ts — date separators auto-inserted while typing
        name: 'date mask d0/M0/0000',
        config: { mask: 'd0/M0/0000' },
        steps: [{ type: '25121999', display: '25/12/1999', bound: '25121999' }],
    },
    {
        // time-mask.spec.ts / forms.spec.ts — time separators auto-inserted while typing
        name: 'time mask Hh:m0:s0',
        config: { mask: 'Hh:m0:s0' },
        steps: [{ type: '235959', display: '23:59:59', bound: '235959' }],
    },
    {
        // validation.spec.ts:87-94 — email-style mask, dropSpecialCharacters false
        // keeps '@' and '.' in both display and bound value.
        name: 'email mask A*@A*.SSS (dropSpecialCharacters false)',
        config: { mask: 'A*@A*.SSS', dropSpecialCharacters: false },
        steps: [
            { type: 'testing@gmail.com', display: 'testing@gmail.com', bound: 'testing@gmail.com' },
        ],
    },
    {
        // repeat-mask.spec.ts — repeat notation
        name: 'repeat mask A{4}',
        config: { mask: 'A{4}' },
        steps: [{ type: '1234', display: '1234', bound: '1234' }],
    },
    {
        // custom-patterns.spec.ts:26-35 — custom pattern definition
        name: 'custom pattern FFF (F = digit)',
        config: { mask: 'FFF', patterns: { F: { pattern: new RegExp('[0-9]') } } },
        steps: [{ type: '123', display: '123', bound: '123' }],
    },
    {
        // dynamic.spec.ts / forms.spec.ts — OR-mask picks alternative by length
        name: 'dynamic OR-mask (00) 00000000||+00 (00) 00000000',
        config: { mask: '(00) 00000000||+00 (00) 00000000' },
        steps: [
            { type: '5549362216', display: '(55) 49362216', bound: '5549362216' },
            { type: '55493622168', display: '+55 (49) 3622168', bound: '55493622168' },
        ],
    },
    {
        // forms.spec.ts (Signal Forms prefix/suffix) — prefix and suffix wrap display only
        name: 'prefix + suffix on 0000',
        config: { mask: '0000', prefix: '$ ', suffix: ' USD' },
        steps: [{ type: '1234', display: '$ 1234 USD', bound: '1234' }],
    },
];

describe('Directive: Mask (tri-mode parity)', () => {
    for (const parityCase of PARITY_CASES) {
        for (const mode of TRI_MODES) {
            // PARITY BUG cases are skipped per-mode — see the case's comment in PARITY_CASES.
            const itFn = parityCase.skipModes?.includes(mode) ? it.skip : it;

            itFn(`should apply ${parityCase.name} identically in ${mode} mode`, async () => {
                const harness = await createTriModeFixture(mode, parityCase.config);

                for (const step of parityCase.steps) {
                    const display = await harness.typeValue(step.type);

                    expect(display).equal(step.display);
                    expect(harness.getBoundValue()).equal(step.bound);
                }
            });
        }
    }
});

describe('Directive: Mask (tri-mode parity — mode-level integration)', () => {
    for (const mode of TRI_MODES) {
        it(`should render the initial bound value masked without echoing back in ${mode} mode`, async () => {
            const harness = await createTriModeFixture(mode, { mask: '00-00' }, '1234');

            // Programmatic initial write formats the DISPLAY only; the model keeps the
            // value it was initialized with (no onChange during writeValue — see
            // forms.spec.ts and the isInitialized guard in formControlResult).
            expect(harness.getInput().value).equal('12-34');
            expect(harness.getBoundValue()).equal('1234');
        });

        it(`should normalize a programmatic separator.2 write with leadZero in ${mode} mode`, async () => {
            // Post-init programmatic write: the directive intentionally pushes the
            // leadZero-normalized value ('10.2' → '10.20') back through onChange (see the
            // rAF block in ngx-mask.directive.ts writeValue() and the forms.spec.ts
            // '1234.5' → '1234.50' Signal Forms equivalent). NOTE: an INITIAL value is
            // handled differently — first-write normalization updates the display only —
            // and its timing differs per mode (NgModel double-writes), so the post-init
            // write is the mode-comparable scenario.
            const harness = await createTriModeFixture(mode, {
                mask: 'separator.2',
                leadZero: true,
                thousandSeparator: ' ',
            });

            await harness.setBoundValue('10.2');

            expect(harness.getInput().value).equal('10.20');
            expect(harness.getBoundValue()).equal('10.20');
        });

        it(`should propagate the disabled state to the native input in ${mode} mode`, async () => {
            const harness = await createTriModeFixture(mode, { mask: '0000' });

            expect(harness.isInputDisabled()).equal(false);

            await harness.setDisabled(true);
            expect(harness.isInputDisabled()).equal(true);

            await harness.setDisabled(false);
            expect(harness.isInputDisabled()).equal(false);
        });

        it(`should keep an initially-disabled control disabled after init in ${mode} mode (#1607, #1614)`, async () => {
            // Regression: the disabled-input effect's first run used to queue a
            // ['disabled', false] DOM write AFTER Angular Forms' own setDisabledState(true)
            // for initially-disabled controls, re-enabling the input.
            const harness = await createTriModeFixture(mode, { mask: '00-00' }, '1234', true);

            expect(harness.isInputDisabled()).equal(true);
            expect(harness.getInput().value).equal('12-34');

            await harness.setDisabled(false);
            expect(harness.isInputDisabled()).equal(false);
        });

        it(`should mark user interaction (dirty/touched equivalent) after typing and blur in ${mode} mode`, async () => {
            const harness = await createTriModeFixture(mode, { mask: '0000' });

            expect(harness.isUserInteracted()).equal(false);

            await harness.typeValue('12');
            await harness.blur();

            expect(harness.isUserInteracted()).equal(true);
        });
    }
});
