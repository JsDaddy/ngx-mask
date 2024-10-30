import type { ComponentFixture } from '@angular/core/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal, typeTest } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';
import type { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Directive: Mask (Secure)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('it checks secure input functionality ', () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        equal('1234', '***/*', fixture);
        expect(component.form.value).toBe('1234');
    });

    it('it checks secure input functionality ', () => {
        component.mask = 'XXX/XX/0000';
        component.hiddenInput = true;
        equal('123456789', '***/**/6789', fixture);
        expect(component.form.value).toBe('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask = 'XXX/XX/XXX0';
        component.hiddenInput = true;
        equal('123456789', '***/**/***9', fixture);
        expect(component.form.value).toBe('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask = 'XXX/XX/XXXX';
        component.hiddenInput = true;
        equal('123456789', '***/**/****', fixture);
        expect(component.form.value).toBe('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask = '0000-00-XXXX';
        component.hiddenInput = true;
        equal('123456789', '1234-56-***', fixture);
        expect(component.form.value).toBe('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask = '0000-X0-XXXX';
        component.hiddenInput = true;
        equal('123456789', '1234-*6-***', fixture);
        expect(component.form.value).toBe('123456789');
    });

    it('it checks secure input functionality on reset', () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        typeTest('54321', fixture);
        component.form.reset('98765');
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('***/*5');
        });
    });

    it('it checks secure input functionality on reset then typed', () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        typeTest('54321', fixture);
        component.form.reset();
        equal('98765', '***/*5', fixture);
    });

    it('it checks secure input functionality on setValue(longer string)', () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        typeTest('54321', fixture);
        component.form.setValue('1234567');
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('***/*5/67');
        });
    });

    it('should be same form state (pristine) after mask change triggerOnMaskChange = true', async () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        component.triggerOnMaskChange = true;
        component.form.reset('123456789');
        fixture.detectChanges();
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        component.mask = '000/00/0000';
        fixture.detectChanges();
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('123/45/6789');
        });
    });

    it('should be same form state (dirty) after mask change', () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        component.form.reset('123456789');
        component.form.markAsDirty();
        component.form.markAsTouched();
        fixture.detectChanges();
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        component.mask = '000/00/0000';
        fixture.detectChanges();
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('123/45/6789');
        });
    });

    it('should not keep shadow copy when form reset', () => {
        component.hiddenInput = true;
        component.mask = 'XXX/X0/0000';
        equal('54321', '***/*1', fixture);
        typeTest('1', fixture);
        expect(component.form.value).toBe('1');
        component.form.reset();
        expect(component.form.value).toBe(null);
        equal('2', '*', fixture);
        expect(component.form.value).toBe('2');
    });

    it('mask changes should work with null input', () => {
        component.hiddenInput = true;
        component.mask = '000/00/0000';
        equal('987654321', '987/65/4321', fixture);
        component.form.reset();
        component.mask = 'XXX/X0/0000';
        equal('54321', '***/*1', fixture);
        expect(component.form.value).toBe('54321');
    });

    it('it checks secure input functionality on reset then typed', () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        component.showMaskTyped = true;
        equal('98765', '***/*5/____', fixture);
        equal('1234', '***/*_/____', fixture);
        equal('', '___/__/____', fixture);
    });

    it('should select text in input and paste new value', fakeAsync(() => {
        const inputValue = '111111';
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#mask');
        inputElement.value = '000000';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(0, inputElement.value.length);
        inputElement.dispatchEvent(new MouseEvent('dblclick'));
        fixture.detectChanges();
        inputElement.value = inputValue;
        inputElement.dispatchEvent(new Event('input'));
        inputElement.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        tick();

        expect(component.form.value).toBe(inputValue);
    }));

    it('hideInput with showMaskTyped mask=XXXX', () => {
        component.mask = 'XXXX';
        component.hiddenInput = true;
        component.showMaskTyped = true;
        equal('1', '*___', fixture);
        equal('12', '**__', fixture);
        equal('123', '***_', fixture);
        equal('1234', '****', fixture);
    });

    it('hideInput with showMaskTyped mask=XX-XX', () => {
        component.mask = 'XX-XX';
        component.hiddenInput = true;
        component.showMaskTyped = true;

        equal('1234', '**-**', fixture);
    });

    it('change hiddenInput to false ', async () => {
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        component.mask = 'XXX-XX-XXXX';
        component.hiddenInput = true;
        equal('1234', '***-*', fixture);
        fixture.detectChanges();
        component.hiddenInput = false;
        equal(inputTarget.value, '123-4', fixture, true);
    });

    it('change hiddenInput to false ', async () => {
        const debug: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debug.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        component.mask = 'XXX-XX-XXXX';
        component.hiddenInput = true;
        equal('123456', '***-**-*', fixture);
        fixture.detectChanges();
        component.hiddenInput = false;
        equal(inputTarget.value, '123-45-6', fixture, true);
    });
});
