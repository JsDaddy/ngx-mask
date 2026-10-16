import { Component, forwardRef, model, signal } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal, Paste } from './utils/test-functions.component';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import type { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { expect, vi } from 'vitest';

import type { TriMode } from './utils/tri-mode-harness';
import { TRI_MODES, createTriModeFixture } from './utils/tri-mode-harness';

/** Reporter's input-zip component: custom CVA wrapping the masked input via [(ngModel)]. */
@Component({
    selector: 'ngxd-input-zip',
    template: `<input
        type="text"
        mask="00000"
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)" />`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => InputZipComponent),
        },
    ],
    imports: [FormsModule, NgxMaskDirective],
})
class InputZipComponent implements ControlValueAccessor {
    public value = model<string | number>();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onChange: (value: unknown) => void = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onTouched: () => void = () => {};

    public writeValue(obj: string): void {
        this.value.set(obj);
    }

    public registerOnChange(fn: (value: unknown) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}

@Component({
    selector: 'ngxd-wrapper-host',
    template: `<ngxd-input-zip [(ngModel)]="value" />`,
    imports: [InputZipComponent, FormsModule],
})
class WrapperHostComponent {
    public readonly value = model<string | number>(65432);
}

/** #1671: plain `[(value)]` two-way binding, no ngModel / formControl / Signal Forms. */
@Component({
    selector: 'ngxd-value-binding-host',
    template: `<input mask="000 000 00 00" [showMaskTyped]="true" [(value)]="value" />`,
    imports: [NgxMaskDirective],
})
class ValueBindingHostComponent {
    public readonly value = signal('0791234567');
}

/** #1671 follow-up: a thousandSeparator change must not leave the service stuck in writingValue. */
@Component({
    selector: 'ngxd-separator-switch-host',
    template: `<input
        mask="separator"
        [showMaskTyped]="true"
        [thousandSeparator]="thousandSeparator()"
        [formControl]="control" />`,
    imports: [NgxMaskDirective, ReactiveFormsModule],
})
class SeparatorSwitchHostComponent {
    public readonly thousandSeparator = signal(',');
    public readonly control = new FormControl<string | null>('1234');
}

/** #1671 follow-up: a mask and a value changed in the same pass, without triggerOnMaskChange. */
@Component({
    selector: 'ngxd-plain-mask-switch-value-binding-host',
    template: `<input [mask]="mask()" [(value)]="value" />`,
    imports: [NgxMaskDirective],
})
class PlainMaskSwitchValueBindingHostComponent {
    public readonly mask = signal('000-000');
    public readonly value = signal('123456');
}

/**
 * #1671 follow-up: the parent applies `valueChange` in a later task and switches the mask in the
 * same pass, so the `[value]` binding changes to the value the `value` model already holds.
 */
@Component({
    selector: 'ngxd-deferred-echo-host',
    template: `<input [mask]="mask()" [value]="value()" (valueChange)="onValueChange($event)" />`,
    imports: [NgxMaskDirective],
})
class DeferredEchoHostComponent {
    public readonly mask = signal('(000) 000');
    public readonly value = signal('');

    public onValueChange(value: string | number | null | undefined): void {
        setTimeout(() => {
            this.value.set(String(value ?? ''));
            if (this.value().length >= 3) {
                this.mask.set('(00) 00-00');
            }
        });
    }
}

/** #1671 follow-up: a thousandSeparator and a value changed in the same pass under `[(value)]`. */
@Component({
    selector: 'ngxd-separator-value-binding-host',
    template: `<input
        mask="separator"
        [thousandSeparator]="thousandSeparator()"
        [(value)]="value" />`,
    imports: [NgxMaskDirective],
})
class SeparatorValueBindingHostComponent {
    public readonly thousandSeparator = signal(',');
    public readonly value = signal('1234');
}

/** #1671 follow-up: the model echo of user typing must not be treated as an external write. */
@Component({
    selector: 'ngxd-hidden-value-binding-host',
    template: `<input mask="XXX/X0/0000" [hiddenInput]="true" [(value)]="value" />`,
    imports: [NgxMaskDirective],
})
class HiddenValueBindingHostComponent {
    public readonly value = signal('');
}

/** #1671 follow-up: keepCharacterPositions + showMaskTyped under plain `[(value)]`. */
@Component({
    selector: 'ngxd-kcp-value-binding-host',
    template: `<input
        mask="00/00/0000"
        [showMaskTyped]="true"
        [keepCharacterPositions]="true"
        [(value)]="value" />`,
    imports: [NgxMaskDirective],
})
class KeepPositionsValueBindingHostComponent {
    public readonly value = signal('05062025');
}

/** #1671 follow-up: a mask and a value changed in the same change-detection pass. */
@Component({
    selector: 'ngxd-mask-switch-value-binding-host',
    template: `<input
        [mask]="mask()"
        [showMaskTyped]="true"
        [triggerOnMaskChange]="true"
        [(value)]="value" />`,
    imports: [NgxMaskDirective],
})
class MaskSwitchValueBindingHostComponent {
    public readonly mask = signal('000-000');
    public readonly value = signal('123456');
}

/** Runs change detection until the deferred (microtask / after-next-render) mask writes have settled. */
async function flush(fixture: ComponentFixture<unknown>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

describe('Directive: Mask', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should clear if not match the mask!!!!', () => {
        component.mask.set('(000) 000-0000');
        component.showMaskTyped.set(true);
        equal('', '(___) ___-____', fixture);
        equal('2345678', '(234) 567-8___', fixture);

        component.prefix.set('+7');
        component.showMaskTyped.set(true);
        equal('', '+7(___) ___-____', fixture);
        equal('2345678', '+7(234) 567-8___', fixture);
    });

    it('should clear if not match the mask!!!!', () => {
        component.mask.set('A{5}-A{2}');
        component.showMaskTyped.set(true);
        equal('', '_____-__', fixture);
        equal('aaa', 'aaa__-__', fixture);
        equal('aaaaaaa', 'aaaaa-aa', fixture);
    });

    it('Mask with optional pattern 9999', () => {
        component.mask.set('(000) 000-0000 ext. 999999');
        component.showMaskTyped.set(true);
        component.specialCharacters.set(['e', 'x', 't', ' ', '(', ')', '-', '.']);
        equal('9871234223 ext. 123022', '(987) 123-4223 ext. 123022', fixture);

        component.mask.set('(000) 000-0000 testing. 999999');
        component.showMaskTyped.set(true);
        component.specialCharacters.set([
            't',
            'e',
            's',
            't',
            'i',
            'n',
            'g',
            ' ',
            '(',
            ')',
            '-',
            '.',
        ]);
        equal('1234567890 testing. 123456', '(123) 456-7890 testing. 123456', fixture);

        component.mask.set('(000) 000-0000 prefix. 999');
        component.showMaskTyped.set(true);
        component.prefix.set('+7');
        component.specialCharacters.set(['p', 'r', 'e', 'f', 'i', 'x', ' ', '(', ')', '-', '.']);
        equal('1234567890 prefix. 345', '+7(123) 456-7890 prefix. 345', fixture);

        component.mask.set('(000) 000-0000 cv. 999');
        component.showMaskTyped.set(true);
        component.prefix.set('card. ');
        component.specialCharacters.set(['c', 'v', ' ', '(', ')', '-', '.']);
        equal('1234567890 cv. 345', 'card. (123) 456-7890 cv. 345', fixture);
    });

    it('Mask with optional pattern 00000', () => {
        component.mask.set('(000) 000-0000 ext. 000000');
        component.showMaskTyped.set(true);
        component.specialCharacters.set(['e', 'x', 't', ' ', '(', ')', '-', '.']);
        equal('9871234223 ext. 123022', '(987) 123-4223 ext. 123022', fixture);

        component.mask.set('(000) 000-0000 testing. 00000');
        component.showMaskTyped.set(true);
        component.specialCharacters.set([
            't',
            'e',
            's',
            't',
            'i',
            'n',
            'g',
            ' ',
            '(',
            ')',
            '-',
            '.',
        ]);
        equal('1234567890 testing. 12345', '(123) 456-7890 testing. 12345', fixture);

        component.mask.set('(000) 000-0000 prefix. 000');
        component.showMaskTyped.set(true);
        component.prefix.set('+7');
        component.specialCharacters.set(['p', 'r', 'e', 'f', 'i', 'x', ' ', '(', ')', '-', '.']);
        equal('1234567890 prefix. 345', '+7(123) 456-7890 prefix. 345', fixture);

        component.mask.set('(000) 000-0000 cv. 000');
        component.showMaskTyped.set(true);
        component.prefix.set('card. ');
        component.specialCharacters.set(['c', 'v', ' ', '(', ')', '-', '.']);
        equal('1234567890 cv. 134', 'card. (123) 456-7890 cv. 134', fixture);
    });

    it('should work right with security input', () => {
        component.mask.set('000-0X-XXXX');
        component.showMaskTyped.set(true);
        component.hiddenInput.set(true);
        equal('', '___-__-____', fixture);
        equal('123', '123-__-____', fixture);
        equal('12345', '123-4*-____', fixture);
        equal('123456', '123-4*-*___', fixture);
        equal('1234567', '123-4*-**__', fixture);
        equal('12345678', '123-4*-***_', fixture);
        equal('123456790', '123-4*-****', fixture);
        equal('1234567901', '123-4*-****', fixture);
    });

    it('showMaskTyped && placeholder XXXXX-YYYY', () => {
        component.showMaskTyped.set(true);
        component.placeHolderCharacter.set('XXXXX-YYYY');
        component.mask.set('00000-0000');
        equal('1', '1XXXX-YYYY', fixture);
        equal('12', '12XXX-YYYY', fixture);
        equal('123', '123XX-YYYY', fixture);
        equal('1234', '1234X-YYYY', fixture);
        equal('12345', '12345-YYYY', fixture);
        equal('123456', '12345-6YYY', fixture);
        equal('1234567', '12345-67YY', fixture);
        equal('12345678', '12345-678Y', fixture);
        equal('123456789', '12345-6789', fixture);
    });

    it('showMaskTyped && placeholder 00/00/0000', () => {
        component.showMaskTyped.set(true);
        component.placeHolderCharacter.set('dd/mm/yyyy');
        component.mask.set('00/00/0000');
        equal('1', '1d/mm/yyyy', fixture);
        equal('12', '12/mm/yyyy', fixture);
        equal('123', '12/3m/yyyy', fixture);
        equal('1234', '12/34/yyyy', fixture);
        equal('12345', '12/34/5yyy', fixture);
        equal('123456', '12/34/56yy', fixture);
        equal('1234567', '12/34/567y', fixture);
        equal('12345678', '12/34/5678', fixture);
    });

    it('should work with showMaskTyped', () => {
        component.mask.set('000/00000');
        component.prefix.set('06');
        component.dropSpecialCharacters.set(false);
        component.showMaskTyped.set(true);
        equal('', '06___/_____', fixture);
        equal('1', '061__/_____', fixture);
        equal('12', '0612_/_____', fixture);
        equal('123', '06123/_____', fixture);
        equal('1230', '06123/0____', fixture);
        equal('12304', '06123/04___', fixture);
        equal('123040', '06123/040__', fixture);
        equal('1230405', '06123/0405_', fixture);
        equal('12304051', '06123/04051', fixture);
    });

    it('should work with showMaskTyped', () => {
        component.mask.set('000/00000');
        component.prefix.set('06');
        equal('1', '061', fixture);
        equal('12', '0612', fixture);
        equal('123', '06123', fixture);
        equal('1230', '06123/0', fixture);
        equal('12304', '06123/04', fixture);
        equal('123040', '06123/040', fixture);
        equal('1230405', '06123/0405', fixture);
        equal('12304051', '06123/04051', fixture);
    });

    it('should work with showMaskTyped 000/00000', async () => {
        component.mask.set('000/00000');
        component.showMaskTyped.set(false);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        expect(inputTarget.selectionStart).equal(3);
        component.showMaskTyped.set(true);
        inputTarget.focus();

        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('123/_____');
    });

    it('should work with showMaskTyped 000/00000 with prefix', async () => {
        component.mask.set('000/00000');
        component.prefix.set('+38 ');
        component.showMaskTyped.set(false);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        equal('+38 1', '+38 1', fixture, false, Paste);
        equal('+38 12', '+38 12', fixture, false, Paste);
        equal('+38 123', '+38 123', fixture, false, Paste);
        expect(inputTarget.selectionStart).equal(7);
        component.showMaskTyped.set(true);
        inputTarget.focus();

        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('+38 123/_____');
    });

    it('should display initial value with showMaskTyped when setValue is used', async () => {
        component.mask.set('000-000');
        component.showMaskTyped.set(true);
        fixture.detectChanges();

        // Set initial value via FormControl
        component.form.setValue('123456');
        fixture.detectChanges();
        await fixture.whenStable();

        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;

        // The input should show the value with mask, not just the placeholder
        expect(inputTarget.value).equal('123-456');
        expect(component.form.value).equal('123456');
    });

    it('should display initial value with showMaskTyped when setValue is used with number', async () => {
        component.mask.set('00000');
        component.showMaskTyped.set(true);
        fixture.detectChanges();

        // Set initial value as number (like value = 65432)
        component.form.setValue(65432);
        fixture.detectChanges();
        await fixture.whenStable();

        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;

        // The input should show the value, not just the placeholder mask
        expect(inputTarget.value).equal('65432');
        expect(component.form.value).equal(65432);
    });

    it('should display initial value with showMaskTyped when config provided at application level', async () => {
        // This simulates the user's scenario where showMaskTyped is provided at app level
        component.mask.set('(000) 000-0000');
        component.showMaskTyped.set(true);
        fixture.detectChanges();

        // Set initial value
        component.form.setValue('1234567890');
        fixture.detectChanges();
        await fixture.whenStable();

        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;

        // Should show formatted value, not just (___) ___-____
        expect(inputTarget.value).equal('(123) 456-7890');
        expect(component.form.value).equal('1234567890');
    });

    // #1495: a suffix that contains a substring identical to the initial value (e.g. suffix
    // ':00' with value '00') must not cause the value to be misdetected as a partially-typed
    // suffix and stripped out — the display must show both the masked value AND the suffix.
    it('should render both the value and the suffix when the value collides with the suffix text', async () => {
        component.mask.set('Hh');
        component.suffix.set(':00');
        component.dropSpecialCharacters.set(false);
        component.showMaskTyped.set(true);
        fixture.detectChanges();

        component.form.setValue('00');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;

        expect(inputTarget.value).equal('00:00');
        expect(component.form.value).equal('00');
    });
});

// Issue #1590: showMaskTyped: true + an initial value provided before the first render must
// render the MASKED VALUE, not the bare mask skeleton. The reporter's setup is a custom CVA
// wrapper component (inner [(ngModel)]) with showMaskTyped from the GLOBAL config and a
// NUMBER initial value from model(65432) — with a nested wrapper the real initial value
// reaches the inner NgModel one microtask LATER than the initial null write, and the
// skeleton render for that null write used to echo '' back into the model, clobbering the
// in-flight value before it ever reached the view.
describe('Directive: Mask: showMaskTyped with an initial value (#1590)', () => {
    async function createWrapperFixture(
        initialValue: string | number
    ): Promise<ComponentFixture<WrapperHostComponent>> {
        TestBed.configureTestingModule({
            imports: [WrapperHostComponent],
            providers: [provideNgxMask({ showMaskTyped: true })],
        });
        const fixture = TestBed.createComponent(WrapperHostComponent);
        fixture.componentInstance.value.set(initialValue);
        await flush(fixture);
        return fixture;
    }

    const initialValues: (string | number)[] = [65432, '65432'];

    describe('custom CVA wrapper + global-config showMaskTyped (reporter setup)', () => {
        for (const initialValue of initialValues) {
            it(`should render masked initial ${typeof initialValue} value, not the skeleton`, async () => {
                const fixture = await createWrapperFixture(initialValue);
                const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

                expect(input.value).toBe('65432');
                // The in-flight initial value must not be clobbered by an '' echo.
                expect(String(fixture.componentInstance.value())).toBe('65432');
            });

            it(`should show the skeleton again after the user clears the input (${typeof initialValue} initial)`, async () => {
                const fixture = await createWrapperFixture(initialValue);
                const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

                expect(input.value).toBe('65432');

                // User clears the whole input (select-all + delete).
                input.value = '';
                input.dispatchEvent(new Event('input'));
                await flush(fixture);

                expect(input.value).toBe('_____');
                expect(fixture.componentInstance.value()).toBe('');
            });
        }
    });

    describe('tri-mode parity (input-bound showMaskTyped)', () => {
        for (const mode of TRI_MODES) {
            for (const initialValue of initialValues) {
                it(`${mode}: should render masked initial ${typeof initialValue} value with showMaskTyped`, async () => {
                    const harness = await createTriModeFixture(
                        mode as TriMode,
                        { mask: '00000', showMaskTyped: true },
                        initialValue
                    );

                    expect(harness.getInput().value).toBe('65432');
                });

                it(`${mode}: should render partially masked initial ${typeof initialValue} value plus skeleton remainder`, async () => {
                    const partial = typeof initialValue === 'number' ? 654 : '654';
                    const harness = await createTriModeFixture(
                        mode as TriMode,
                        { mask: '00000', showMaskTyped: true },
                        partial
                    );

                    expect(harness.getInput().value).toBe('654__');
                });
            }
        }

        it('signal: should show the mask skeleton again after the user clears the input', async () => {
            const harness = await createTriModeFixture(
                'signal',
                { mask: '00000', showMaskTyped: true },
                65432
            );

            expect(harness.getInput().value).toBe('65432');

            // typeValue('') clears the element and dispatches an `input` event (user deleting all).
            const displayAfterClear = await harness.typeValue('');

            expect(displayAfterClear).toBe('_____');
            expect(harness.getBoundValue()).toBe('');
        });
    });
});

describe('Directive: Mask: showMaskTyped with plain [(value)] binding (#1671)', () => {
    async function createHost<T>(
        host: new () => T
    ): Promise<{ fixture: ComponentFixture<T>; input: HTMLInputElement }> {
        TestBed.configureTestingModule({
            imports: [host],
            providers: [provideNgxMask()],
        });
        const fixture = TestBed.createComponent(host);
        await flush(fixture);
        return { fixture, input: fixture.nativeElement.querySelector('input') };
    }

    /** Edits as the focused element, the way the keydown / input handlers expect a user edit. */
    function focus(input: HTMLInputElement): void {
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(input);
    }

    /** Types `digits` one key at a time at the end of the input, settling after each key. */
    async function typeDigits(
        fixture: ComponentFixture<unknown>,
        input: HTMLInputElement,
        digits: string
    ): Promise<void> {
        focus(input);
        for (const char of digits) {
            input.setSelectionRange(input.value.length, input.value.length);
            input.dispatchEvent(new KeyboardEvent('keydown', { key: char, code: `Digit${char}` }));
            input.value += char;
            input.setSelectionRange(input.value.length, input.value.length);
            input.dispatchEvent(new Event('input'));
            await flush(fixture);
        }
    }

    it('should render the masked initial value and keep the bound signal intact', async () => {
        const { fixture, input } = await createHost(ValueBindingHostComponent);

        expect(input.value).toBe('079 123 45 67');
        expect(fixture.componentInstance.value()).toBe('0791234567');
    });

    it('should render a later value.set() and keep the bound signal intact', async () => {
        const { fixture, input } = await createHost(ValueBindingHostComponent);

        fixture.componentInstance.value.set('');
        await flush(fixture);

        expect(input.value).toBe('___ ___ __ __');

        fixture.componentInstance.value.set('0791234567');
        await flush(fixture);

        expect(input.value).toBe('079 123 45 67');
        expect(fixture.componentInstance.value()).toBe('0791234567');
    });

    it('should emit the value again when it is cleared and retyped in one input event', async () => {
        const { fixture, input } = await createHost(ValueBindingHostComponent);

        input.value = '';
        input.dispatchEvent(new Event('input'));
        await flush(fixture);

        expect(input.value).toBe('___ ___ __ __');
        expect(fixture.componentInstance.value()).toBe('');

        input.value = '0791234567';
        input.dispatchEvent(new Event('input'));
        await flush(fixture);

        expect(input.value).toBe('079 123 45 67');
        expect(fixture.componentInstance.value()).toBe('0791234567');
    });

    it('should still propagate user typing to the bound signal', async () => {
        const { fixture, input } = await createHost(ValueBindingHostComponent);

        input.value = '';
        input.dispatchEvent(new Event('input'));
        await flush(fixture);

        expect(input.value).toBe('___ ___ __ __');
        expect(fixture.componentInstance.value()).toBe('');

        input.value = '0791234568';
        input.dispatchEvent(new Event('input'));
        await flush(fixture);

        expect(input.value).toBe('079 123 45 68');
        expect(fixture.componentInstance.value()).toBe('0791234568');
    });

    it('should apply a mask and a value changed in the same pass', async () => {
        const { fixture, input } = await createHost(MaskSwitchValueBindingHostComponent);

        expect(input.value).toBe('123-456');

        fixture.componentInstance.mask.set('00-00-00');
        fixture.componentInstance.value.set('654321');
        await flush(fixture);

        expect(input.value).toBe('65-43-21');
        expect(fixture.componentInstance.value()).toBe('654321');
    });

    it('should still propagate typing after a mask and a value changed in the same pass', async () => {
        const { fixture, input } = await createHost(PlainMaskSwitchValueBindingHostComponent);
        expect(input.value).toBe('123-456');

        fixture.componentInstance.mask.set('00-00-00');
        fixture.componentInstance.value.set('');
        await flush(fixture);
        expect(input.value).toBe('');

        await typeDigits(fixture, input, '1');

        expect(input.value).toBe('1');
        expect(fixture.componentInstance.value()).toBe('1');
    });

    it('should apply a mask switched together with a deferred echo of the typed value', async () => {
        const { fixture, input } = await createHost(DeferredEchoHostComponent);

        await typeDigits(fixture, input, '123');
        await new Promise<void>((resolve) => setTimeout(resolve));
        await flush(fixture);

        expect(fixture.componentInstance.mask()).toBe('(00) 00-00');
        expect(input.value).toBe('(12) 3');
        expect(fixture.componentInstance.value()).toBe('123');
    });

    it('hiddenInput + [(value)]: typing keeps accumulating into the model (echo is not an external write)', async () => {
        const { fixture, input } = await createHost(HiddenValueBindingHostComponent);

        await typeDigits(fixture, input, '123456');

        expect(fixture.componentInstance.value()).toBe('123456');
        expect(input.value).toBe('***/*5/6');
    });

    for (const [written, display] of [
        ['', ''],
        ['987654321', '***/*5/4321'],
    ] as const) {
        it(`hiddenInput + [(value)]: a parent write of ${JSON.stringify(written)} after typing replaces the typed value`, async () => {
            const { fixture, input } = await createHost(HiddenValueBindingHostComponent);
            await typeDigits(fixture, input, '1234');

            fixture.componentInstance.value.set(written);
            await flush(fixture);

            expect(fixture.componentInstance.value()).toBe(written);
            expect(input.value).toBe(display);
        });
    }

    for (const [written, display] of [
        ['', '__/__/____'],
        ['01012000', '01/01/2000'],
    ] as const) {
        it(`keepCharacterPositions + [(value)]: a parent write of ${JSON.stringify(written)} after a mid-value backspace replaces the edited value`, async () => {
            const { fixture, input } = await createHost(KeepPositionsValueBindingHostComponent);
            expect(input.value).toBe('05/06/2025');

            focus(input);
            // Backspace the '6' of the month: keepCharacterPositions leaves a placeholder in place.
            input.setSelectionRange(5, 5);
            input.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', keyCode: 8 })
            );
            input.value = input.value.slice(0, 4) + input.value.slice(5);
            input.setSelectionRange(4, 4);
            input.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward' }));
            await flush(fixture);
            expect(input.value).toBe('05/0_/2025');

            fixture.componentInstance.value.set(written);
            await flush(fixture);

            expect(fixture.componentInstance.value()).toBe(written);
            expect(input.value).toBe(display);
        });
    }

    it('should not leave writingValue stuck when a thousandSeparator and a value change in the same pass', async () => {
        const { fixture, input } = await createHost(SeparatorValueBindingHostComponent);
        const maskService = fixture.debugElement
            .query(By.directive(NgxMaskDirective))
            .injector.get(NgxMaskDirective)._maskService;
        expect(input.value).toBe('1,234');

        fixture.componentInstance.thousandSeparator.set('.');
        fixture.componentInstance.value.set('');
        await flush(fixture);

        expect(input.value).toBe('');
        expect(fixture.componentInstance.value()).toBe('');
        expect(maskService.writingValue).toBe(false);
    });

    it('should not leave writingValue stuck after a thousandSeparator change (user clear still reaches the model)', async () => {
        const { fixture, input } = await createHost(SeparatorSwitchHostComponent);

        fixture.componentInstance.thousandSeparator.set('.');
        await flush(fixture);

        input.value = '';
        input.dispatchEvent(new Event('input'));
        await flush(fixture);

        expect(fixture.componentInstance.control.value).toBe('');
    });
});

// Retyping char-by-char always changes the value on the first keystroke; the regression
// only shows when the whole previous value lands in ONE input event (autofill, undo, IME).
describe('Directive: Mask: showMaskTyped clear then retype the same value', () => {
    async function setInputValue(
        fixture: ComponentFixture<unknown>,
        input: HTMLInputElement,
        value: string
    ): Promise<void> {
        input.value = value;
        input.dispatchEvent(new Event('input'));
        await flush(fixture);
    }

    for (const mode of TRI_MODES) {
        for (const prefix of ['', '+7 ']) {
            it(`${mode}: should emit the value again after clearing and retyping it (prefix '${prefix}')`, async () => {
                const harness = await createTriModeFixture(mode as TriMode, {
                    mask: '00000',
                    prefix,
                    showMaskTyped: true,
                });
                const input = harness.getInput();

                await setInputValue(harness.fixture, input, `${prefix}12345`);
                expect(input.value).toBe(`${prefix}12345`);
                expect(harness.getBoundValue()).toBe('12345');

                await setInputValue(harness.fixture, input, '');
                expect(input.value).toBe(`${prefix}_____`);
                expect(harness.getBoundValue()).toBe('');

                await setInputValue(harness.fixture, input, `${prefix}12345`);
                expect(input.value).toBe(`${prefix}12345`);
                expect(harness.getBoundValue()).toBe('12345');
            });
        }
    }
});
