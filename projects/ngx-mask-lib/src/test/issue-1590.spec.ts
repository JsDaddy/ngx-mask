import { Component, forwardRef, model } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { ControlValueAccessor } from '@angular/forms';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { describe, expect, it } from 'vitest';

import type { TriMode } from './utils/tri-mode-harness';
import { TRI_MODES, createTriModeFixture } from './utils/tri-mode-harness';

// Issue #1590: showMaskTyped: true + an initial value provided before the first render must
// render the MASKED VALUE, not the bare mask skeleton. The reporter's setup is a custom CVA
// wrapper component (inner [(ngModel)]) with showMaskTyped from the GLOBAL config and a
// NUMBER initial value from model(65432) — with a nested wrapper the real initial value
// reaches the inner NgModel one microtask LATER than the initial null write, and the
// skeleton render for that null write used to echo '' back into the model, clobbering the
// in-flight value before it ever reached the view.

/** Reporter's input-zip component: custom CVA wrapping the masked input via [(ngModel)]. */
@Component({
    selector: 'jsdaddy-input-zip',
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

    public onChange: any;
    public onTouched: any;

    public writeValue(obj: string): void {
        this.value.set(obj);
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}

@Component({
    selector: 'jsdaddy-wrapper-host',
    template: `<jsdaddy-input-zip [(ngModel)]="value" />`,
    imports: [InputZipComponent, FormsModule],
})
class WrapperHostComponent {
    public readonly value = model<string | number>(65432);
}

async function flush(fixture: ComponentFixture<unknown>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    fixture.detectChanges();
}

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

describe('Issue #1590: showMaskTyped: true with initial value', () => {
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
