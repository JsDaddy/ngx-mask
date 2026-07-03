import { Component, ChangeDetectionStrategy } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';

// Issue #1379: native browser constraint validation (minlength -> validity.tooShort)
// never fires on inputs carrying the mask directive, EVEN when the mask expression is
// empty. Root cause: onInput unconditionally rewrote `el.value` programmatically on
// every keystroke, which clears the browser's "value was last changed by a user edit"
// flag that minlength/maxlength validation depends on. With an empty mask the directive
// must be a no-op passthrough: no programmatic value rewriting, no validator errors.
@Component({
    selector: 'jsdaddy-open-source-test',
    imports: [NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input mask="" minlength="5" />`,
})
class EmptyMaskNativeComponent {}

@Component({
    selector: 'jsdaddy-open-source-form-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input mask="" [formControl]="control" />`,
})
class EmptyMaskFormComponent {
    public control = new FormControl('');
}

const flushMicrotasks = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
};

/**
 * Replaces the instance `value` accessor with a counting wrapper so every
 * programmatic `.value =` write (directive or test) is observable.
 */
function interceptValueWrites(el: HTMLInputElement): () => number {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (!descriptor || !descriptor.set || !descriptor.get) {
        throw new Error('Cannot intercept HTMLInputElement.value');
    }
    let writes = 0;
    Object.defineProperty(el, 'value', {
        configurable: true,
        get(): string {
            return descriptor.get?.call(this);
        },
        set(newValue: string) {
            writes++;
            descriptor.set?.call(this, newValue);
        },
    });
    return () => writes;
}

describe('Directive: Mask (issue #1379 — empty mask must not suppress native validation)', () => {
    it('should not programmatically rewrite el.value on input when mask is empty', async () => {
        TestBed.configureTestingModule({
            imports: [EmptyMaskNativeComponent],
            providers: [provideNgxMask()],
        });
        const fixture: ComponentFixture<EmptyMaskNativeComponent> =
            TestBed.createComponent(EmptyMaskNativeComponent);
        fixture.detectChanges();
        // Let the initial (config-time) deferred DOM writes flush before observing.
        await flushMicrotasks();
        fixture.detectChanges();

        const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
        const getWrites = interceptValueWrites(el);

        // Simulate a user edit: the test's own assignment is the only expected write.
        el.value = 'ab';
        expect(getWrites()).toBe(1);
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await flushMicrotasks();
        fixture.detectChanges();
        await flushMicrotasks();

        // The directive must not have rewritten the value (a programmatic rewrite
        // clears the browser's user-edit flag and disables minlength validation).
        expect(getWrites()).toBe(1);
        expect(el.value).toBe('ab');
    });

    it('should propagate value and report no mask validation errors with empty mask', async () => {
        TestBed.configureTestingModule({
            imports: [EmptyMaskFormComponent],
            providers: [provideNgxMask()],
        });
        const fixture: ComponentFixture<EmptyMaskFormComponent> =
            TestBed.createComponent(EmptyMaskFormComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();
        await flushMicrotasks();

        const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
        el.value = 'ab';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.control.value).toBe('ab');
        expect(component.control.errors).toBeNull();
        expect(el.value).toBe('ab');
    });
});
