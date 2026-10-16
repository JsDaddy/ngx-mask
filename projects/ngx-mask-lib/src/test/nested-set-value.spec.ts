import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Directive: setValue called inside a valueChanges subscriber (#1691)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    let input: HTMLInputElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        component.mask.set('0000');
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input');
    });

    it('shows the nested write, not the stale value of the outer write', async () => {
        let nested = false;
        component.form.valueChanges.subscribe((value) => {
            if (value === '1234' && !nested) {
                nested = true;
                component.form.setValue('99999');
            }
        });

        component.form.setValue('12345');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.form.value).toBe('9999');
        expect(input.value).toBe('9999');
    });

    it('still renders a plain write after a nested one', async () => {
        let nested = false;
        const subscription = component.form.valueChanges.subscribe((value) => {
            if (value === '1234' && !nested) {
                nested = true;
                component.form.setValue('99999');
            }
        });
        component.form.setValue('12345');
        fixture.detectChanges();
        await fixture.whenStable();
        subscription.unsubscribe();

        component.form.setValue('5678');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(input.value).toBe('5678');
        expect(component.form.value).toBe('5678');
    });

    describe('with leadZero on a separator mask', () => {
        it('lets only the latest write run its deferred normalisation', async () => {
            component.mask.set('separator.2');
            component.leadZero.set(true);
            fixture.detectChanges();
            const emitted: unknown[] = [];
            component.form.valueChanges.subscribe((value) => {
                emitted.push(value);
                if (Number(value) > 100) {
                    component.form.setValue(100);
                }
            });

            component.form.setValue(500);
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(input.value).toBe('100.00');
            expect(emitted).toEqual(['500.00', '100.00', '100.00', '100.00']);
            expect(component.form.value).toBe('100.00');
        });

        it('keeps a user edit made before the deferred normalisation runs', async () => {
            component.mask.set('separator.2');
            component.leadZero.set(true);
            fixture.detectChanges();

            component.form.setValue('10.2');
            // The write's own DOM update lands in a microtask, before any user event can.
            await Promise.resolve();
            input.value = '7';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();

            expect(input.value).toBe('7');
            // What typing 7 alone emits with leadZero.
            expect(component.form.value).toBe('7.00');
        });
    });

    describe('while typing', () => {
        const typeInto = (value: string): void => {
            input.value = value;
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
        };
        const writeFromSubscriber = (value: string | number): void => {
            let writing = false;
            component.form.valueChanges.subscribe(() => {
                if (!writing) {
                    writing = true;
                    component.form.setValue(value);
                    writing = false;
                }
            });
        };

        it('shows the value a subscriber writes on a separator mask', async () => {
            component.mask.set('separator.2');
            fixture.detectChanges();
            writeFromSubscriber(123456);

            typeInto('4321');

            expect(component.form.value).toBe(123456);
            expect(input.value).toBe('123 456');
            await fixture.whenStable();
            expect(input.value).toBe('123 456');
        });

        it('shows the value a subscriber writes on a fixed mask', async () => {
            writeFromSubscriber('9999');

            typeInto('4321');

            expect(component.form.value).toBe('9999');
            expect(input.value).toBe('9999');
        });

        it('ends on the innermost of two nested writes with showMaskTyped', async () => {
            component.mask.set('00-00');
            component.showMaskTyped.set(true);
            fixture.detectChanges();
            component.form.valueChanges.subscribe((value) => {
                if (value === '8888') {
                    component.form.setValue('9999', { emitEvent: false });
                } else if (value !== '9999') {
                    component.form.setValue('8888');
                }
            });

            typeInto('4321');

            expect(component.form.value).toBe('9999');
            expect(input.value).toBe('99-99');
            await fixture.whenStable();
            expect(input.value).toBe('99-99');
        });
    });
});
