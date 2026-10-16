import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import type { NgxMaskConfig } from 'ngx-mask';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Separator: changing the separators of a mask', () => {
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
        component.mask.set('separator.2');
    });

    const settle = async (): Promise<void> => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    };

    describe('with a populated control', () => {
        const populate = async (
            thousandSeparator: NgxMaskConfig['thousandSeparator'],
            decimalMarker?: NgxMaskConfig['decimalMarker']
        ): Promise<void> => {
            component.thousandSeparator.set(thousandSeparator);
            if (decimalMarker) {
                component.decimalMarker.set(decimalMarker);
            }
            fixture.detectChanges();
            input = fixture.nativeElement.querySelector('input');
            component.form.setValue(1234.5);
            await settle();
            expect(input.value).toBe(`1${thousandSeparator}234.5`);
        };

        it('keeps the number when only the thousandSeparator becomes a dot (default decimalMarker)', async () => {
            await populate(' ');

            component.thousandSeparator.set('.');
            await settle();

            expect(input.value).toBe('1.234,5');
            expect(component.form.value).toBe(1234.5);
        });

        it('keeps the number when both separators change at once', async () => {
            await populate(' ', '.');

            component.thousandSeparator.set('.');
            component.decimalMarker.set(',');
            await settle();

            expect(input.value).toBe('1.234,5');
            expect(component.form.value).toBe(1234.5);
        });

        it('keeps the number when only the decimalMarker changes', async () => {
            await populate(' ', '.');

            component.decimalMarker.set(',');
            await settle();

            expect(input.value).toBe('1 234,5');
            expect(component.form.value).toBe(1234.5);
        });

        it('does not dirty the control', async () => {
            await populate(' ', '.');

            component.thousandSeparator.set('.');
            component.decimalMarker.set(',');
            await settle();

            expect(component.form.pristine).toBe(true);
            expect(component.form.untouched).toBe(true);
        });
    });

    describe('with a prefix or suffix', () => {
        it.each([
            ['prefix', 'Rs. ', '', 'Rs. 1 234.5', 'Rs. 1.234,5'],
            ['suffix', '', ' kg', '1 234.5 kg', '1.234,5 kg'],
            ['prefix and suffix', 'Rs. ', ' kg', 'Rs. 1 234.5 kg', 'Rs. 1.234,5 kg'],
        ])(
            'keeps the typed number with a %s when the separators change',
            async (_name, prefix, suffix, before, after) => {
                component.prefix.set(prefix);
                component.suffix.set(suffix);
                fixture.detectChanges();
                input = fixture.nativeElement.querySelector('input');
                input.value = `${prefix}1234.5${suffix}`;
                input.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(input.value).toBe(before);
                expect(component.form.value).toBe(1234.5);

                component.thousandSeparator.set('.');
                component.decimalMarker.set(',');
                await settle();

                expect(input.value).toBe(after);
                expect(component.form.value).toBe(1234.5);
            }
        );
    });

    describe('with a write right after the change, before change detection', () => {
        it.each([' ', '.'] as const)(
            'formats the number with the new thousandSeparator %s and decimalMarker',
            async (thousandSeparator) => {
                fixture.detectChanges();
                input = fixture.nativeElement.querySelector('input');

                component.thousandSeparator.set(thousandSeparator);
                component.decimalMarker.set(',');
                component.form.setValue(1234567.5);
                await settle();

                expect(input.value).toBe(`1${thousandSeparator}234${thousandSeparator}567,5`);
                expect(component.form.value).toBe(1234567.5);
            }
        );
    });
});
