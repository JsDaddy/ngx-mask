import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import type { DebugElement } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { equal } from './utils/test-functions.component';

describe('Directive: Mask (Dynamic)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('The input value when set by the FormControl should be masked accordingly the dynamic mask', async () => {
        component.mask.set('000-0||0000-0||00000-0');
        fixture.detectChanges();

        component.form.setValue({
            value: 1234,
        });
        fixture.detectChanges();
        let inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('123-4');
        });

        component.form.setValue({
            value: 12345,
        });
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('1234-5');
        });

        component.form.setValue({
            value: 123456,
        });
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('12345-6');
        });
    });

    it('The input value when set by the FormControl should be masked accordingly the dynamic mask', async () => {
        function getMask(): string {
            if (component.form.value?.value) {
                return '0000 0000 0000 0000||0000 0000 0000 0000 000';
            }
            return '';
        }

        component.mask.set('');
        fixture.detectChanges();

        component.form.setValue({
            value: 9000000000000000000,
        });
        component.mask.set(getMask());
        fixture.detectChanges();

        const inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('9000 0000 0000 0000 000');
        });
    });

    it('Change mask dynamically from mask several masks to one', async () => {
        component.mask.set('(000)0000-000||(000)0000-0000||00-00000-00000'); // China phone formats
        fixture.detectChanges();

        component.form.setValue({
            value: 1234567890,
        });
        fixture.detectChanges();
        let inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('(123)4567-890');
        });

        component.form.setValue({
            value: 12345678901,
        });
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('(123)4567-8901');
        });

        component.form.setValue({
            value: 123456789012,
        });
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('12-34567-89012');
        });

        component.mask.set('00-00-00-00'); // For example Denmark phone format
        fixture.detectChanges();

        component.form.setValue({
            value: 12345678,
        });
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('12-34-56-78');
        });
    });

    it('The input value when set by the FormControl should be masked accordingly the dynamic mask', async () => {
        let inputEl: DebugElement;
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');

        fixture.detectChanges();

        component.form.setValue({
            value: 12345.67,
        });

        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('12.345,67');
        });

        component.form.setValue({
            value: '12345.67',
        });

        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        Promise.resolve().then(() => {
            expect(inputEl.nativeElement.value).toEqual('12.345,67');
        });

        component.form.setValue({
            value: '12345.67',
        });
    });

    it('Should update position to the end of input when mask changes while typing', async () => {
        component.mask.set('(00) 00000000||+00 (00) 00000000');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '5549362216';
        inputTarget.selectionStart = 13;
        inputTarget.selectionEnd = 13;
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('(55) 49362216');
        expect(inputTarget.selectionStart).toEqual(13);

        debugElement.nativeElement.value += '8';

        debugElement.triggerEventHandler('input', {
            target: debugElement.nativeElement,
        });

        fixture.detectChanges();

        expect(inputTarget.value).toBe('+55 (49) 3622168');
        expect(inputTarget.selectionStart).toEqual(16);
    });

    it('should work with number or letters', () => {
        component.mask.set('00||SS');
        equal('0', '0', fixture);
        equal('11', '11', fixture);
        equal('D', 'D', fixture);
        equal('DD', 'DD', fixture);
    });

    it('should work with number or letters', () => {
        component.mask.set('00||SS||000||000SS||0S0S');
        equal('0', '0', fixture);
        expect(component.form.valid).toBeFalse();
        equal('11', '11', fixture);
        expect(component.form.valid).toBeTruthy();
        equal('112', '112', fixture);
        expect(component.form.valid).toBeTruthy();
        equal('112A', '112A', fixture);
        expect(component.form.valid).toBeFalse();
        equal('112DS', '112DS', fixture);
        expect(component.form.valid).toBeTruthy();
        equal('D', 'D', fixture);
        expect(component.form.valid).toBeFalse();
        equal('DD', 'DD', fixture);
        expect(component.form.valid).toBeTruthy();
        equal('9D', '9D', fixture);
        expect(component.form.valid).toBeFalse();
        equal('0A0', '0A0', fixture);
        expect(component.form.valid).toBeFalse();
        equal('2D2D', '2D2D', fixture);
        expect(component.form.valid).toBeTruthy();
    });

    it('should work for UK Post Codes', () => {
        component.mask.set('S0 0SS||SAA 0SS||SS0A 0SS');
        equal('A', 'A', fixture);
        expect(component.form.valid).toBeFalse();
        equal('A0', 'A0', fixture);
        expect(component.form.valid).toBeFalse();
        equal('A00', 'A0 0', fixture);
        expect(component.form.valid).toBeFalse();
        equal('AAA0DD', 'AAA 0DD', fixture);
        expect(component.form.valid).toBeTrue();
        equal('AB17NC', 'AB1 7NC', fixture);
        expect(component.form.valid).toBeTrue();
    });

    it('should work with number or letters', () => {
        component.mask.set('00||SS||000||000SS');
        equal('0', '0', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('11', '11', fixture);
        expect(component.form.valid).toBeTrue();
        equal('D', 'D', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('DD', 'DD', fixture);
        expect(component.form.valid).toBeTrue();
        equal('123', '123', fixture);
        expect(component.form.valid).toBeTrue();
        equal('123S', '123S', fixture);
        expect(component.form.valid).toBeFalse();
        equal('123SD', '123SD', fixture);
        expect(component.form.valid).toBeTrue();
    });

    it('should be valid if mask dont changes  00000||00000-0000', () => {
        component.mask.set('00000||00000-0000');
        component.showMaskTyped.set(true);
        equal('1', '1____', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('11', '11___', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('123', '123__', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('1234', '1234_', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('12345', '12345', fixture);
        expect(component.form.valid).toBeTrue();
        equal('123456', '12345-6___', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('1234567', '12345-67__', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('12345678', '12345-678_', fixture);
        expect(component.form.invalid).toBeTrue();
        equal('123456789', '12345-6789', fixture);
        expect(component.form.valid).toBeTrue();
    });

    it('should work with when justPasted', () => {
        component.mask.set('00000||S0S 0S0');
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '12345', fixture);
        equal('A', 'A', fixture);
        equal('A5', 'A5', fixture);
        equal('A5A', 'A5A', fixture);
        equal('A5A 0', 'A5A 0', fixture);
        equal('A5A 0A', 'A5A 0A', fixture);
        equal('A5A 0A9', 'A5A 0A9', fixture);
    });

    it('should work with only S', () => {
        component.mask.set('S.||S.S.||S.S.S.||S.S.S.S.||S.S.S.S.S.');
        equal('D', 'D.', fixture);
        equal('D.D', 'D.D.', fixture);
        equal('DDD', 'D.D.D.', fixture);
        equal('DDDD', 'D.D.D.D.', fixture);
        equal('DDDDD', 'D.D.D.D.D.', fixture);
    });

    it('should work with only A', () => {
        component.mask.set('A.||A.A.||A.A.A.||A.A.A.A.||A.A.A.A.A.');
        equal('D', 'D.', fixture);
        equal('D.D', 'D.D.', fixture);
        equal('DDD', 'D.D.D.', fixture);
        equal('DDDD', 'D.D.D.D.', fixture);
        equal('DDDDD', 'D.D.D.D.D.', fixture);
    });

    it('should work with only U', () => {
        component.mask.set('U.||U.U.||U.U.U.||U.U.U.U.||U.U.U.U.U.');
        equal('D', 'D.', fixture);
        equal('D.D', 'D.D.', fixture);
        equal('DDD', 'D.D.D.', fixture);
        equal('DDDD', 'D.D.D.D.', fixture);
        equal('DDDDD', 'D.D.D.D.D.', fixture);
    });

    it('should work with only L', () => {
        component.mask.set('L.||L.L.||L.L.L.||L.L.L.L.||L.L.L.L.L.');
        equal('d', 'd.', fixture);
        equal('d.d', 'd.d.', fixture);
        equal('ddd', 'd.d.d.', fixture);
        equal('dddd', 'd.d.d.d.', fixture);
        equal('ddddd', 'd.d.d.d.d.', fixture);
    });
});
