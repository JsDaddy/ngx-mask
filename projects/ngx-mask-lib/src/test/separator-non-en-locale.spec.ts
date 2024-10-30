import type { ComponentFixture } from '@angular/core/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import type { DebugElement } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal, typeTest } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';
import { By } from '@angular/platform-browser';

// FR locale uses comma as decimal marker
describe('Separator: Mask with FR locale', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask(), { provide: LOCALE_ID, useValue: 'fr' }],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should work right when reset decimalMarker', () => {
        component.mask = 'separator.2';
        component.decimalMarker = '.';
        equal('1000000.00', '1 000 000.00', fixture);
    });

    it('separator precision 2 with thousandSeparator (.) decimalMarker (,) for 12345.67', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        component.decimalMarker = '.';
        equal('12,345.67', '12,345.67', fixture);
    });

    it('separator precision 2 with thousandSeparator (.) decimalMarker (,) for 12345.67', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        component.decimalMarker = '.';
        equal('12345.67', '12,345.67', fixture);
    });

    it('check formControl value to be number when decimalMarker is dot', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ' ';
        component.decimalMarker = '.';

        typeTest('12 345.67', fixture);
        expect(component.form.value).toBe('12345.67');
    });

    it('check formControl value to be number when decimalMarker is array', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ' ';
        component.decimalMarker = ['.', ','];

        typeTest('12 345,67', fixture);
        expect(component.form.value).toBe('12345.67');

        typeTest('123 456.78', fixture);
        expect(component.form.value).toBe('123456.78');
    });

    it('should show - at input', fakeAsync(() => {
        component.mask = 'separator.2';
        component.thousandSeparator = ' ';
        component.decimalMarker = ',';
        component.allowNegativeNumbers = true;
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(-78);
        tick();
        expect(inputTarget.value).toBe('-78');
        equal('-78', '-78', fixture);
    }));
});
