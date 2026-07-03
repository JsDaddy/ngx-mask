import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { expect } from 'vitest';

import { createTriModeFixture, TRI_MODES } from './utils/tri-mode-harness';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

// Issue #1435: defaultValueOnBlur — when the control's unmasked value is empty on blur,
// the configured default is written through the regular mask pipeline (masked display +
// model propagation) while keeping the control's pristine state.
describe.each(TRI_MODES)('defaultValueOnBlur — %s mode', (mode) => {
    it('should apply the default to display and model on blur of an empty input', async () => {
        const harness = await createTriModeFixture(mode, {
            mask: '0000',
            providerOptions: { defaultValueOnBlur: '7' },
        });
        await harness.blur();
        expect(harness.getInput().value).toBe('7');
        expect(harness.getBoundValue()).toBe('7');
    });

    it('should keep the control non-dirty when the default is applied on a pristine control', async () => {
        const harness = await createTriModeFixture(mode, {
            mask: '0000',
            providerOptions: { defaultValueOnBlur: '7' },
        });
        await harness.blur();
        if (mode === 'signal') {
            // Signal Forms have no dirty/pristine concept in the harness; blur itself
            // legitimately marks the field touched (same as without the feature), so only
            // the value propagation is asserted for this mode.
            expect(harness.getBoundValue()).toBe('7');
        } else {
            expect(harness.isUserInteracted()).toBe(false);
        }
    });

    it('should not overwrite a user-typed value on blur', async () => {
        const harness = await createTriModeFixture(mode, {
            mask: '0000',
            providerOptions: { defaultValueOnBlur: '7' },
        });
        await harness.typeValue('1234');
        await harness.blur();
        expect(harness.getInput().value).toBe('1234');
        expect(harness.getBoundValue()).toBe('1234');
    });

    it('should apply the default after the user clears the value and keep the control dirty', async () => {
        const harness = await createTriModeFixture(mode, {
            mask: '0000',
            providerOptions: { defaultValueOnBlur: '7' },
        });
        await harness.typeValue('12');
        await harness.typeValue('');
        await harness.blur();
        expect(harness.getInput().value).toBe('7');
        expect(harness.getBoundValue()).toBe('7');
        // The user DID interact — the blur-time default write must not reset dirtiness.
        expect(harness.isUserInteracted()).toBe(true);
    });

    it('should keep current behavior byte-identical when the option is absent', async () => {
        const harness = await createTriModeFixture(mode, { mask: '0000' });
        await harness.blur();
        expect(harness.getInput().value).toBe('');
        expect(harness.getBoundValue()).toBe('');
    });

    it('should render the default with prefix and suffix', async () => {
        const harness = await createTriModeFixture(mode, {
            mask: '000',
            prefix: '+',
            suffix: ' $',
            providerOptions: { defaultValueOnBlur: '5' },
        });
        await harness.blur();
        expect(harness.getInput().value).toBe('+5 $');
        expect(harness.getBoundValue()).toBe('5');
    });

    it('should fill the first slot and keep the skeleton with showMaskTyped', async () => {
        // Pinned interplay: the default wins over the empty skeleton — the masked default
        // occupies the leading slots and the placeholder skeleton covers the rest.
        const harness = await createTriModeFixture(mode, {
            mask: '0000',
            showMaskTyped: true,
            providerOptions: { defaultValueOnBlur: '9' },
        });
        await harness.blur();
        expect(harness.getInput().value).toBe('9___');
        expect(harness.getBoundValue()).toBe('9');
    });

    it('should apply a multi-character default through the mask', async () => {
        const harness = await createTriModeFixture(mode, {
            mask: '00-00',
            providerOptions: { defaultValueOnBlur: '0000' },
        });
        await harness.blur();
        expect(harness.getInput().value).toBe('00-00');
        expect(harness.getBoundValue()).toBe('0000');
    });
});

@Component({
    selector: 'jsdaddy-default-value-input-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input id="mask" mask="0000" [defaultValueOnBlur]="'9'" [formControl]="form" />`,
})
class DefaultValueInputComponent {
    public readonly form = new FormControl<string | null>('');
}

describe('defaultValueOnBlur — directive input precedence', () => {
    it('should prefer the directive input over the DI config value', async () => {
        TestBed.configureTestingModule({
            imports: [DefaultValueInputComponent],
            providers: [provideNgxMask({ defaultValueOnBlur: '1' })],
        });
        const fixture = TestBed.createComponent(DefaultValueInputComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(input.value).toBe('9');
        expect(fixture.componentInstance.form.value).toBe('9');
        expect(fixture.componentInstance.form.pristine).toBe(true);
    });
});
