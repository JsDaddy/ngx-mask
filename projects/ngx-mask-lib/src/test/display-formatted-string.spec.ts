import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Separator: strings written in the display format', () => {
    const write = async (
        options: {
            thousandSeparator: string;
            decimalMarker: ',' | '.' | 'default';
            leadZero: boolean;
        },
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
        component.thousandSeparator.set(options.thousandSeparator);
        if (options.decimalMarker !== 'default') {
            component.decimalMarker.set(options.decimalMarker);
        }
        component.leadZero.set(options.leadZero);
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

    describe.each([
        {
            thousandSeparator: '.',
            decimalMarker: ',' as const,
            written: '1.234,5',
            plain: '1.234,5',
        },
        {
            thousandSeparator: '.',
            decimalMarker: 'default' as const,
            written: '1.234,5',
            plain: '1.234,5',
        },
        {
            thousandSeparator: ',',
            decimalMarker: '.' as const,
            written: '1,234.5',
            plain: '1,234.5',
        },
        {
            thousandSeparator: ' ',
            decimalMarker: ',' as const,
            written: '1 234,5',
            plain: '1 234,5',
        },
    ])('thousandSeparator "$thousandSeparator", decimalMarker $decimalMarker', (config) => {
        it('reads the grouping and the decimal marker of the display format', async () => {
            const { shown } = await write({ ...config, leadZero: false }, config.written);

            expect(shown).toBe(config.plain);
        });

        it('pads the decimals without ever showing NaN (leadZero)', async () => {
            const { shown } = await write({ ...config, leadZero: true }, config.written);

            expect(shown).toBe(`${config.plain}0`);
        });
    });

    it('keeps reading a lone dot as the decimal point', async () => {
        const options = { thousandSeparator: '.', decimalMarker: ',' as const, leadZero: false };

        expect((await write(options, '1234567.5')).shown).toBe('1.234.567,5');
        expect((await write(options, '1.5')).shown).toBe('1,5');
    });

    it('never shows NaN for an unparsable string with leadZero', async () => {
        const { shown } = await write(
            { thousandSeparator: ' ', decimalMarker: 'default', leadZero: true },
            '12abc'
        );

        expect(shown).not.toContain('NaN');
    });
});
