import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Separator: symbol thousand separators stay out of the model', () => {
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
        component.mask.set('separator');
    });

    const separators = ['$', '*', '^', '|', ' ', ',', "'"];

    it.each(separators)('typing groups with %s and keeps the model numeric', (separator) => {
        component.thousandSeparator.set(separator);
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input');

        input.value = '1234567';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe(`1${separator}234${separator}567`);
        expect(component.form.value).toBe(1234567);
    });

    it.each(separators)('setValue(number) with %s gives a numeric model', async (separator) => {
        component.thousandSeparator.set(separator);
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input');

        component.form.setValue(1234567);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(input.value).toBe(`1${separator}234${separator}567`);
        expect(component.form.value).toBe(1234567);
    });

    it('keeps a decimal part when a symbol separator groups the integer part', async () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('*');
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input');

        component.form.setValue(1234567.5);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(input.value).toBe('1*234*567.5');
        expect(component.form.value).toBe(1234567.5);
    });
});
