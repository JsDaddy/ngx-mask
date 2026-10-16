import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Separator: a thousandSeparator containing a digit', () => {
    // Grouping such a value would re-match its own output forever, so it is left ungrouped.
    it.each([
        ['0', '1234567.5'],
        ['a1b', '1234567.5'],
        // Typed digits equal to the separator are consumed as separators, the rest stay ungrouped.
        ['1', '234567.5'],
        ['12', '34567.5'],
    ])(
        'does not hang and leaves the digits ungrouped for %s',
        (separator, expected) => {
            TestBed.configureTestingModule({
                imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
                providers: [provideNgxMask()],
            });
            const fixture = TestBed.createComponent(TestMaskComponent);
            const component = fixture.componentInstance;
            component.mask.set('separator.2');
            component.thousandSeparator.set(separator);
            fixture.detectChanges();
            const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

            input.value = '1234567.5';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(input.value).toBe(expected);
        },
        5000
    );
});
