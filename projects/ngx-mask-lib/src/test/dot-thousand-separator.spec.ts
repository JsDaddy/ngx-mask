import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Separator: numbers written with a dot thousandSeparator', () => {
    const write = async (
        explicitCommaMarker: boolean,
        value: number
    ): Promise<{ shown: string; model: unknown }> => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        const fixture = TestBed.createComponent(TestMaskComponent);
        const component = fixture.componentInstance;
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        if (explicitCommaMarker) {
            component.decimalMarker.set(',');
        }
        fixture.detectChanges();

        component.form.setValue(value);
        fixture.detectChanges();
        await fixture.whenStable();

        return {
            shown: fixture.nativeElement.querySelector('input').value,
            model: component.form.value,
        };
    };

    it.each([true, false])(
        'setValue(1234567.5) groups with dots and keeps the number (explicit decimalMarker %s)',
        async (explicitCommaMarker) => {
            expect(await write(explicitCommaMarker, 1234567.5)).toEqual({
                shown: '1.234.567,5',
                model: 1234567.5,
            });
        }
    );

    it('setValue(1234567) groups with dots and keeps the number', async () => {
        expect(await write(true, 1234567)).toEqual({ shown: '1.234.567', model: 1234567 });
    });
});
