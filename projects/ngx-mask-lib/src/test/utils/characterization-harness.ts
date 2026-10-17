import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import { TestMaskComponent } from './test-component.component';

export type EditAction = {
    /** Selection start before the key press. */
    start: number;
    /** Selection end before the key press (equal to start for a bare caret). */
    end: number;
    /** `Backspace`, `Delete` or a single typed character. */
    key: string;
};

export type EditSnapshot = {
    value: string;
    caret: number | null;
    model: unknown;
    /** Whether the directive prevented the default action of the keydown. */
    prevented: boolean;
};

export type CharacterizationHarness = {
    fixture: ComponentFixture<TestMaskComponent>;
    component: TestMaskComponent;
    el: HTMLInputElement;
    /** Writes `value` through the form control, as a programmatic model write. */
    write: (value: string) => void;
    /** Simulates one browser edit (keydown, default action, input) and reports the outcome. */
    edit: (action: EditAction) => EditSnapshot;
    /** Types each character at the current caret key by key; \\b stands for Backspace. */
    type: (keys: string) => EditSnapshot;
    /** Current display value, caret and model without editing. */
    snapshot: () => EditSnapshot;
};

function keyCode(key: string): string {
    if (key === 'Backspace' || key === 'Delete') {
        return key;
    }
    return /\d/.test(key) ? `Digit${key}` : `Key${key.toUpperCase()}`;
}

/**
 * Builds the jsdom harness the characterization specs share: a `TestMaskComponent` whose
 * input is reported as the active element, and an `edit()` that reproduces the browser's
 * keydown -> default action -> input sequence at an explicit selection.
 */
export function createHarness(): CharacterizationHarness {
    TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
        providers: [provideNgxMask()],
    });
    const fixture = TestBed.createComponent(TestMaskComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
    const el = debugElement.nativeElement as HTMLInputElement;
    vi.spyOn(document, 'activeElement', 'get').mockReturnValue(el);

    const snapshot = (prevented = false): EditSnapshot => ({
        value: el.value,
        caret: el.selectionStart,
        model: component.form.value,
        prevented,
    });

    const harness: CharacterizationHarness = {
        fixture,
        component,
        el,
        write: (value: string): void => {
            component.form.setValue(value);
            fixture.detectChanges();
        },
        snapshot: (): EditSnapshot => snapshot(),
        edit: ({ start, end, key }: EditAction): EditSnapshot => {
            el.setSelectionRange(start, end);
            let prevented = false;
            debugElement.triggerEventHandler('keydown', {
                code: keyCode(key),
                key,
                target: el,
                preventDefault: () => {
                    prevented = true;
                },
            });
            if (prevented) {
                fixture.detectChanges();
                return snapshot(true);
            }
            // The keydown handler may have moved the selection (e.g. past a separator).
            let from = el.selectionStart ?? 0;
            let to = el.selectionEnd ?? 0;
            let insert = key;
            if (key === 'Backspace' || key === 'Delete') {
                insert = '';
                if (from === to) {
                    if (key === 'Backspace') {
                        from = Math.max(0, from - 1);
                    } else {
                        to = Math.min(el.value.length, to + 1);
                    }
                }
            }
            el.value = el.value.slice(0, from) + insert + el.value.slice(to);
            const caret = from + insert.length;
            el.setSelectionRange(caret, caret);
            debugElement.triggerEventHandler('input', { target: el });
            fixture.detectChanges();
            return snapshot();
        },
        type: (keys: string): EditSnapshot => {
            let last = snapshot();
            for (const key of keys) {
                const caret = el.selectionStart ?? el.value.length;
                last = harness.edit({
                    start: caret,
                    end: caret,
                    key: key === '\b' ? 'Backspace' : key,
                });
            }
            return last;
        },
    };
    return harness;
}
