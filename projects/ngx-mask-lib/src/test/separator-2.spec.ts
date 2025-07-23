import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { initialConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';

describe('Separator: Mask', () => {
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

    it('should keep the cursor position after deleting a character', () => {
        component.mask.set('separator.2');
        const inputElement = fixture.nativeElement.querySelector('input');
        inputElement.value = '123 456';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(4, 4);

        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
        fixture.detectChanges();

        expect(inputElement.selectionStart).toBe(4);
        expect(inputElement.value).toBe('123 456');
    });

    it('should change formValue separator.2', async () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue('10.2');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('10.20');
        expect(component.form.value).toBe('10.20');
    });

    it('should change formValue separator.3', async () => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue('10.2');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('10.200');
        expect(component.form.value).toBe('10.200');
    });

    // it('separator.8 should return number value', async () => {
    //     component.mask.set('separator.8');
    //     component.thousandSeparator.set('.');
    //     component.decimalMarker.set(',');
    //
    //     equal('12,34', '12,34', fixture);
    //
    //     await fixture.whenStable();
    //     expect(component.form.value).toBe(12.34);
    // });

    it('should display value in input with decimalMarker , and leadZero with separator.2', async () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('0,40');

        component.form.setValue(10.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('10,40');

        component.form.setValue(100.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('100,40');

        component.form.setValue(1000.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('1 000,40');
    });

    it('should display value in input with decimalMarker , and leadZero with separator.3', async () => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('0,400');

        component.form.setValue(20.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('20,400');

        component.form.setValue(200.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('200,400');

        component.form.setValue(2000.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('2 000,400');
    });

    it('should display value in input with decimalMarker , and leadZero with separator.3', async () => {
        component.mask.set('separator.3');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.3);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('0,300');

        component.form.setValue(30.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('30,400');

        component.form.setValue(300.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('300,400');

        component.form.setValue(3000.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('3.000,400');
    });

    it('should display value in input with decimalMarker , and leadZero with separator.2', async () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        component.form.setValue(0.3);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('0,30');

        component.form.setValue(30.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('30,40');

        component.form.setValue(300.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('300,40');

        component.form.setValue(3000.4);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('3.000,40');
    });

    it('should not allow add two zeros to inputValue', () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-00', '-0,0', fixture);
    });

    it('should not allow add two zeros to inputValue', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.thousandSeparator.set(',');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-00', '-0.0', fixture);
    });

    it('should not allow add two zeros to inputValue', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-00', '-0,0', fixture);
    });

    it('should not allow add two zeros to inputValue', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.thousandSeparator.set(' ');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-00', '-0,0', fixture);
    });

    it('should allow minus after change it to true', () => {
        component.mask.set('separator.2');
        component.allowNegativeNumbers.set(false);
        fixture.detectChanges();

        equal('-1234', '1 234', fixture);
        component.allowNegativeNumbers.set(true);
        equal('-1234', '-1 234', fixture);
    });

    it('should change value in formControl mask separator.2', () => {
        component.mask.set('separator.2');
        component.allowNegativeNumbers.set(true);
        component.specialCharacters.set([...initialConfig.specialCharacters]);
        fixture.detectChanges();

        equal('-1234.10', '-1 234.10', fixture);
        expect(component.form.value).toBe('-1234.10');
    });

    it('should change value in formControl mask separator.3', () => {
        component.mask.set('separator.3');
        component.allowNegativeNumbers.set(true);
        component.specialCharacters.set([...initialConfig.specialCharacters]);
        fixture.detectChanges();

        equal('-1234.567', '-1 234.567', fixture);
        expect(component.form.value).toBe('-1234.567');
    });

    it('should change value in formControl mask separator.1', () => {
        component.mask.set('separator.1');
        component.allowNegativeNumbers.set(true);
        component.specialCharacters.set([...initialConfig.specialCharacters]);
        fixture.detectChanges();

        equal('-1234.9', '-1 234.9', fixture);
        expect(component.form.value).toBe('-1234.9');
    });

    it('should change value in formControl mask separator.0', () => {
        component.mask.set('separator.0');
        component.allowNegativeNumbers.set(true);
        component.specialCharacters.set([...initialConfig.specialCharacters]);
        fixture.detectChanges();

        equal('-1234', '-1 234', fixture);
        expect(component.form.value).toBe('-1234');
    });

    it('should change value if user star from zero separator.0', () => {
        component.mask.set('separator.0');
        fixture.detectChanges();

        equal('03', '3', fixture);
        equal('034', '34', fixture);
    });

    it('should change value if user star from zero separator.1', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set('.');
        fixture.detectChanges();

        equal('03', '0.3', fixture);
        equal('034', '0.3', fixture);
        equal('.3', '0.3', fixture);
        equal('.34', '0.3', fixture);
    });

    it('should change value if user star from zero separator.1', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set(',');
        fixture.detectChanges();

        equal('03', '0,3', fixture);
        equal('034', '0,3', fixture);
        equal(',3', '0,3', fixture);
        equal(',34', '0,3', fixture);
    });

    it('should change value if user star from zero separator.2', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        fixture.detectChanges();

        equal('03', '0.3', fixture);
        equal('034', '0.34', fixture);
        equal('.3', '0.3', fixture);
        equal('.34', '0.34', fixture);
    });

    it('should change value if user star from zero separator.2', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        fixture.detectChanges();

        equal('03', '0,3', fixture);
        equal('034', '0,34', fixture);
        equal(',3', '0,3', fixture);
        equal(',34', '0,34', fixture);
    });

    it('should change value if user star from zero separator.3', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set('.');
        fixture.detectChanges();

        equal('03', '0.3', fixture);
        equal('034', '0.34', fixture);
        equal('.3', '0.3', fixture);
        equal('.34', '0.34', fixture);
        equal('.345', '0.345', fixture);
    });

    it('should change value if user star from zero separator.3', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set(',');
        fixture.detectChanges();

        equal('03', '0,3', fixture);
        equal('034', '0,34', fixture);
        equal(',3', '0,3', fixture);
        equal(',34', '0,34', fixture);
        equal(',345', '0,345', fixture);
    });

    it('should change value if user star from zero separator.0 with allowNegativeNumber', () => {
        component.mask.set('separator.0');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-3', fixture);
        equal('-034', '-34', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.3', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.3', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber decimalMarker= ,', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,3', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,3', fixture);
    });

    it('should change value if user star from zero separator.2 with allowNegativeNumber', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.34', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.34', fixture);
    });

    it('should change value if user star from zero separator.2 with allowNegativeNumber', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,34', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,34', fixture);
    });

    it('should change value if user star from zero separator.3 with allowNegativeNumber', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.34', fixture);
        equal('-0345', '-0.345', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.34', fixture);
        equal('-.345', '-0.345', fixture);
    });

    it('should change value if user star from zero separator.3 with allowNegativeNumber', () => {
        component.mask.set('separator.3');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,34', fixture);
        equal('-0345', '-0,345', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,34', fixture);
        equal('-,345', '-0,345', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,3', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,3', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.1');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.3', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.3', fixture);
    });

    it('should change value if user star from zero separator.1 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set(',');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0,3', fixture);
        equal('-034', '-0,34', fixture);
        equal('-,3', '-0,3', fixture);
        equal('-,34', '-0,34', fixture);
    });

    it('should change value if user star from zero separator.2 with allowNegativeNumber leadZero decimalMarker= ,', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.allowNegativeNumbers.set(true);
        component.leadZero.set(true);
        fixture.detectChanges();

        equal('-03', '-0.3', fixture);
        equal('-034', '-0.34', fixture);
        equal('-.3', '-0.3', fixture);
        equal('-.34', '-0.34', fixture);
    });
});
