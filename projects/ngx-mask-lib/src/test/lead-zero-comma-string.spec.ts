import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Separator: leadZero with a comma decimal string and the default decimalMarker', () => {
    const write = async (
        leadZero: boolean,
        thousandSeparator: string,
        value: string
    ): Promise<{ shown: string; model: unknown }> => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        const fixture = TestBed.createComponent(TestMaskComponent);
        const component = fixture.componentInstance;
        component.mask.set('separator.2');
        component.thousandSeparator.set(thousandSeparator);
        component.leadZero.set(leadZero);
        fixture.detectChanges();

        component.form.setValue(value);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        return {
            shown: fixture.nativeElement.querySelector('input').value,
            model: component.form.value,
        };
    };

    it.each(['.', ' '])(
        'never shows NaN for "1234567,5" with thousandSeparator "%s"',
        async (separator) => {
            const { shown } = await write(true, separator, '1234567,5');

            expect(shown).toBe(`1${separator}234${separator}567,50`);
        }
    );

    it('pads the same digits the plain string write shows without leadZero', async () => {
        for (const separator of ['.', ' ']) {
            const plain = await write(false, separator, '1234567,5');
            const padded = await write(true, separator, '1234567,5');

            expect(padded.shown).toBe(`${plain.shown}0`);
        }
    });
});
