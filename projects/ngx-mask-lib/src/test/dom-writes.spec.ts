import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Directive: DOM writes are skipped when they would not change anything', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    let input: HTMLInputElement;

    const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    const nativeSetValue = (element: HTMLInputElement, value: string): void =>
        valueDescriptor?.set?.call(element, value);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        component.mask.set('0000');
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const spyValueWrites = (): { readonly calls: string[] } => {
        const calls: string[] = [];
        Object.defineProperty(input, 'value', {
            configurable: true,
            get: () => valueDescriptor?.get?.call(input) as string,
            set: (value: string) => {
                calls.push(value);
                nativeSetValue(input, value);
            },
        });
        return { calls };
    };

    it('does not re-assign the element value when typing keeps it unchanged', () => {
        nativeSetValue(input, '123');
        input.dispatchEvent(new Event('input'));
        const writes = spyValueWrites();

        nativeSetValue(input, '1234');
        input.dispatchEvent(new Event('input'));

        expect(input.value).toBe('1234');
        expect(writes.calls).toEqual([]);
    });

    it('still assigns the element value when the mask changes it', () => {
        const writes = spyValueWrites();

        nativeSetValue(input, '12a4');
        input.dispatchEvent(new Event('input'));

        expect(input.value).toBe('124');
        expect(writes.calls).toEqual(['124']);
    });

    it('does not re-assign the element value when an unrelated input change re-renders it', async () => {
        component.form.setValue('1234');
        await fixture.whenStable();
        const writes = spyValueWrites();

        component.validation.set(false);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(input.value).toBe('1234');
        expect(writes.calls).toEqual([]);
    });

    it('still writes the element value when the form writes a different value', async () => {
        component.form.setValue('1234');
        await fixture.whenStable();
        const writes = spyValueWrites();

        component.form.setValue('5678');
        await fixture.whenStable();

        expect(input.value).toBe('5678');
        expect(writes.calls.length).toBeGreaterThan(0);
        expect(new Set(writes.calls)).toEqual(new Set(['5678']));
    });

    it('does not move the caret when it is already where the mask wants it', () => {
        input.focus();
        nativeSetValue(input, '12');
        input.setSelectionRange(2, 2);
        input.dispatchEvent(new Event('input'));
        nativeSetValue(input, '123');
        input.setSelectionRange(3, 3);
        const setSelectionRange = vi.spyOn(input, 'setSelectionRange');

        input.dispatchEvent(new Event('input'));

        expect(input.value).toBe('123');
        expect(setSelectionRange).not.toHaveBeenCalled();
    });

    it('skips the deferred property write when the property already holds the value', async () => {
        const disabledDescriptor = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'disabled'
        );
        const disabledWrites: boolean[] = [];
        Object.defineProperty(input, 'disabled', {
            configurable: true,
            get: () => disabledDescriptor?.get?.call(input) as boolean,
            set: (value: boolean) => {
                disabledWrites.push(value);
                disabledDescriptor?.set?.call(input, value);
            },
        });

        component.form.disable();
        await fixture.whenStable();
        expect(input.disabled).toBe(true);
        // Only the synchronous write of setDisabledState (#1633): the deferred one finds the
        // property already holding the value and is skipped.
        expect(disabledWrites).toEqual([true]);

        // setDisabledState runs again for a control that is already disabled.
        fixture.debugElement
            .query(By.directive(NgxMaskDirective))
            .injector.get(NgxMaskDirective)
            .setDisabledState(true);
        await fixture.whenStable();

        expect(disabledWrites).toEqual([true, true]);
    });
});
