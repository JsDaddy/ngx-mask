import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Separator: a thousandSeparator containing a digit is ignored', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
    });

    const create = (separator: string) => {
        const fixture = TestBed.createComponent(TestMaskComponent);
        fixture.componentInstance.mask.set('separator.2');
        fixture.componentInstance.thousandSeparator.set(separator);
        fixture.detectChanges();
        return fixture;
    };

    // Grouping with such a value would re-match its own output forever, and stripping it would eat
    // the number's own digits: it is neither applied nor removed.
    it.each(['0', '1', '12', 'a1b'])(
        'types the digits ungrouped and intact for %s',
        (separator) => {
            const fixture = create(separator);
            const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

            input.value = '1234567.5';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(input.value).toBe('1234567.5');
            expect(fixture.componentInstance.form.value).toBe(1234567.5);
        },
        5000
    );

    it.each(['0', '1', '12', 'a1b'])(
        'writes the model number intact for %s',
        async (separator) => {
            const fixture = create(separator);

            fixture.componentInstance.form.setValue(1234567);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.nativeElement.querySelector('input').value).toBe('1234567');
            expect(fixture.componentInstance.form.value).toBe(1234567);
        },
        5000
    );
});
