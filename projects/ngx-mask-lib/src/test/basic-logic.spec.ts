import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal, typeTest } from './utils/test-functions.component';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';
import { provideNgxMask } from '../lib/ngx-mask.providers';

describe('Directive: Mask', () => {
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

    it('Pristine and dirty', () => {
        component.mask = '0000.0000';
        expect(component.form.dirty).toBeFalsy();
        expect(component.form.pristine).toBeTruthy();
        equal('1.', '1', fixture);
        equal('1éáa2aaaaqwo', '12', fixture);
        equal('1234567', '1234.567', fixture);
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        component.form.reset();
        expect(component.form.dirty).toBeFalsy();
        expect(component.form.pristine).toBeTruthy();
    });

    it('When I change the mask on-the-fly things should work normally', () => {
        component.mask = '0000.0000';
        equal('1.', '1', fixture);
        equal('1éáa2aaaaqwo', '12', fixture);
        equal('1234567', '1234.567', fixture);

        component.mask = '0.000.000';
        equal('1.', '1.', fixture);
        equal('1éáa2aaaaqwo', '1.2', fixture);
        equal('1234567', '1.234.567', fixture);
    });

    it('More tests', () => {
        component.mask = '0.00';
        equal('1', '1', fixture);
        equal('12', '1.2', fixture);
        equal('123', '1.23', fixture);
        equal('1234', '1.23', fixture);
        equal('12345', '1.23', fixture);
        equal('123456', '1.23', fixture);
        equal('1234567', '1.23', fixture);
        equal('12345678', '1.23', fixture);

        component.mask = '0000.0000';
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '1234.5', fixture);
        equal('123456', '1234.56', fixture);
        equal('1234567', '1234.567', fixture);
        equal('12345678', '1234.5678', fixture);
    });

    it('When I typed a char thats the same as the mask char', () => {
        component.mask = '00/00/0000';
        equal('00/', '00/', fixture);
        equal('00a', '00/', fixture);
        equal('00a00/00', '00/00/00', fixture);
        equal('0a/00/00', '00/00/0', fixture);
        equal('0a/0a/00', '00/00', fixture);
    });

    it('When I typed exactly the same as the mask', () => {
        component.mask = '00/00/0000';
        equal('00', '00', fixture);
        equal('00/', '00/', fixture);
        equal('aa/', '', fixture);
        equal('00/0', '00/0', fixture);
        equal('00/00', '00/00', fixture);
        equal('00/00/0', '00/00/0', fixture);
        equal('00/00/00', '00/00/00', fixture);
    });

    it('Testing masks with a literal on the last char', () => {
        component.mask = '(99)';
        equal('99', '(99)', fixture);
    });

    it('Masks with numbers and special characters.', () => {
        component.mask = '(000) 000-0000';
        equal('1', '(1', fixture);
        equal('12', '(12', fixture);
        equal('123', '(123', fixture);
        equal('1234', '(123) 4', fixture);
        equal('12345', '(123) 45', fixture);
        equal('(123) 456', '(123) 456', fixture);
        equal('(123) 4567', '(123) 456-7', fixture);
    });

    it('Masks with numbers, strings e special characters', () => {
        component.mask = '(099) A99-SSSS';
        equal('as', '(', fixture);
        equal('(1', '(1', fixture);
        equal('(12', '(12', fixture);
        equal('(123', '(123', fixture);
        equal('(123) 4', '(123) 4', fixture);
        equal('(123) A', '(123) A', fixture);
        equal('123.', '(123) ', fixture);
        equal('(123) 45', '(123) 45', fixture);
        equal('(123) 456', '(123) 456', fixture);
        equal('(123) 456-A', '(123) 456-A', fixture);
        equal('(123) 456-AB', '(123) 456-AB', fixture);
        equal('(123) 456-ABC', '(123) 456-ABC', fixture);
        equal('(123) 456-ABCD', '(123) 456-ABCD', fixture);
        equal('(123) 456-ABCDE', '(123) 456-ABCD', fixture);
        equal('(123) 456-ABCD1', '(123) 456-ABCD', fixture);
    });
    describe('Masks with ip', () => {
        it('should correct', () => {
            component.mask = 'IP';
            equal('1.1.1.1', '1.1.1.1', fixture);
            equal('12.1.12.1', '12.1.12.1', fixture);
            equal('127.001.1.1', '127.001.1.1', fixture);
            equal('192.168.1.78', '192.168.1.78', fixture);
        });
        it('form should be invalid', () => {
            component.mask = 'IP';
            equal('192.168.1.78', '192.168.1.78', fixture);
            expect(component.form.valid).toBeTrue();
            equal('127.001.1.1', '127.001.1.1', fixture);
            expect(component.form.valid).toBeTrue();
            equal('12.1.12.1', '12.1.12.1', fixture);
            expect(component.form.valid).toBeTrue();
            equal('1.1.1.1', '1.1.1.1', fixture);
            expect(component.form.valid).toBeTrue();
        });
        it('form should be valid', () => {
            component.mask = 'IP';
            equal('1.1.1.', '1.1.1.', fixture);
            expect(component.form.valid).toBeFalse();
            equal('12.1.12', '12.1.12', fixture);
            expect(component.form.valid).toBeFalse();
            equal('127.1.', '127.1.', fixture);
            expect(component.form.valid).toBeFalse();
            equal('192.168', '192.168', fixture);
            expect(component.form.valid).toBeFalse();
            equal('192', '192', fixture);
            expect(component.form.valid).toBeFalse();
            equal('1', '1', fixture);
            expect(component.form.valid).toBeFalse();
            equal('', '', fixture);
            expect(component.form.valid).toBeFalse();
            equal('256.2.3.1', '256.2.3.1', fixture);
            expect(component.form.valid).toBeFalse();
            equal('255.900.300.1', '255.900.300.1', fixture);
            expect(component.form.valid).toBeFalse();
        });
    });

    it('Masks with cpf', () => {
        component.mask = '000.000.000-00';
        equal('', '', fixture);
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '123.4', fixture);
        equal('12345', '123.45', fixture);
        equal('123456', '123.456', fixture);
        equal('1234567', '123.456.7', fixture);
        equal('12345678', '123.456.78', fixture);
        equal('123456789', '123.456.789', fixture);
        equal('1234567890', '123.456.789-0', fixture);
        equal('12345678901', '123.456.789-01', fixture);
        equal('123.4', '123.4', fixture);
        equal('123.45', '123.45', fixture);
        equal('123.456', '123.456', fixture);
        equal('123.4567', '123.456.7', fixture);
        equal('123.456.78', '123.456.78', fixture);
        equal('123.456.789', '123.456.789', fixture);
        equal('123.456.789-0', '123.456.789-0', fixture);
        equal('123.456.789-01', '123.456.789-01', fixture);
    });

    it('Masks with cnpj', () => {
        component.mask = '00.000.000/0000-00';
        equal('', '', fixture);
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '12.3', fixture);
        equal('1234', '12.34', fixture);
        equal('12345', '12.345', fixture);
        equal('123456', '12.345.6', fixture);
        equal('1234567', '12.345.67', fixture);
        equal('12345678', '12.345.678', fixture);
        equal('123456789', '12.345.678/9', fixture);
        equal('1234567890', '12.345.678/90', fixture);
        equal('12345678901', '12.345.678/901', fixture);
        equal('123456789012', '12.345.678/9012', fixture);
        equal('1234567890123', '12.345.678/9012-3', fixture);
        equal('12345678901234', '12.345.678/9012-34', fixture);
        equal('123', '12.3', fixture);
        equal('12.34', '12.34', fixture);
        equal('12.345', '12.345', fixture);
        equal('12.345.6', '12.345.6', fixture);
        equal('12.345.67', '12.345.67', fixture);
        equal('12.345.678', '12.345.678', fixture);
        equal('12.345.678/9', '12.345.678/9', fixture);
        equal('12.345.678/90', '12.345.678/90', fixture);
        equal('12.345.678/901', '12.345.678/901', fixture);
        equal('12.345.678/9012', '12.345.678/9012', fixture);
        equal('12.345.678/9012-3', '12.345.678/9012-3', fixture);
        equal('12.345.678/9012-34', '12.345.678/9012-34', fixture);
    });

    it('Masks with CPF_CNPJ', () => {
        component.mask = 'CPF_CNPJ';
        equal('', '', fixture);
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '123.4', fixture);
        equal('12345', '123.45', fixture);
        equal('123456', '123.456', fixture);
        equal('1234567', '123.456.7', fixture);
        equal('12345678', '123.456.78', fixture);
        equal('123456789', '123.456.789', fixture);
        equal('1234567890', '123.456.789-0', fixture);
        equal('12345678901', '123.456.789-01', fixture);
        equal('123456789012', '12.345.678/9012', fixture);
        equal('1234567890123', '12.345.678/9012-3', fixture);
        equal('12345678901234', '12.345.678/9012-34', fixture);
        equal('123.4', '123.4', fixture);
        equal('123.45', '123.45', fixture);
        equal('123.456', '123.456', fixture);
        equal('123.4567', '123.456.7', fixture);
        equal('123.456.78', '123.456.78', fixture);
        equal('123.456.789', '123.456.789', fixture);
        equal('123.456.789-0', '123.456.789-0', fixture);
        equal('123.456.789-01', '123.456.789-01', fixture);
        equal('12.345.678/9012', '12.345.678/9012', fixture);
        equal('12.345.678/9012-3', '12.345.678/9012-3', fixture);
        equal('12.345.678/9012-34', '12.345.678/9012-34', fixture);
    });

    it('Dynamic Masks CPF_CNPJ', () => {
        component.mask = '000.000.000-00||00.000.000/0000-00';
        equal('', '', fixture);
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '123.4', fixture);
        equal('12345', '123.45', fixture);
        equal('123456', '123.456', fixture);
        equal('1234567', '123.456.7', fixture);
        equal('12345678', '123.456.78', fixture);
        equal('123456789', '123.456.789', fixture);
        equal('1234567890', '123.456.789-0', fixture);
        equal('12345678901', '123.456.789-01', fixture);
        equal('123456789012', '12.345.678/9012', fixture);
        equal('1234567890123', '12.345.678/9012-3', fixture);
        equal('12345678901234', '12.345.678/9012-34', fixture);
        equal('123.4', '123.4', fixture);
        equal('123.45', '123.45', fixture);
        equal('123.456', '123.456', fixture);
        equal('123.4567', '123.456.7', fixture);
        equal('123.456.78', '123.456.78', fixture);
        equal('123.456.789', '123.456.789', fixture);
        equal('123.456.789-0', '123.456.789-0', fixture);
        equal('123.456.789-01', '123.456.789-01', fixture);
        equal('12.345.678/9012', '12.345.678/9012', fixture);
        equal('12.345.678/9012-3', '12.345.678/9012-3', fixture);
        equal('12.345.678/9012-34', '12.345.678/9012-34', fixture);
    });

    it('Dynamic Masks PHONE_BR', () => {
        component.mask = '(00) 0000-0000||(00) 0 0000-0000';
        equal('', '', fixture);
        equal('1', '(1', fixture);
        equal('12', '(12', fixture);
        equal('123', '(12) 3', fixture);
        equal('1234', '(12) 34', fixture);
        equal('12345', '(12) 345', fixture);
        equal('123456', '(12) 3456', fixture);
        equal('1234567', '(12) 3456-7', fixture);
        equal('12345678', '(12) 3456-78', fixture);
        equal('123456789', '(12) 3456-789', fixture);
        equal('1234567890', '(12) 3456-7890', fixture);
        equal('12345678901', '(12) 3 4567-8901', fixture);
        equal('(', '(', fixture);
        equal('(1', '(1', fixture);
        equal('(12', '(12', fixture);
        equal('(12)', '(12) ', fixture);
        equal('(12) 3', '(12) 3', fixture);
        equal('(12) 34', '(12) 34', fixture);
        equal('(12) 345', '(12) 345', fixture);
        equal('(12) 3456', '(12) 3456', fixture);
        equal('(12) 3456-7', '(12) 3456-7', fixture);
        equal('(12) 3456-78', '(12) 3456-78', fixture);
        equal('(12) 3456-789', '(12) 3456-789', fixture);
        equal('(12) 3456-7890', '(12) 3456-7890', fixture);
        equal('(12) 3 4567-8901', '(12) 3 4567-8901', fixture);
        equal('ab(ds123da-s_d4567dasds8901', '(12) 3 4567-8901', fixture);
    });

    it('Mask with optional numbers and 2 decimals', () => {
        component.mask = '9999.00';
        equal('.', '.', fixture);
        equal('1.23', '1.23', fixture);
        equal('.23', '.23', fixture);
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '1234.5', fixture);
        equal('123456', '1234.56', fixture);
    });

    it('Masks with numbers, strings e special characters #2 ', () => {
        component.mask = 'AAA 000-S0S';
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('123 4', '123 4', fixture);
        equal('123 45', '123 45', fixture);
        equal('123 456', '123 456', fixture);
        equal('123 456-7', '123 456-', fixture);
    });

    it('should strip special characters from form control value', () => {
        component.mask = '00/00/0000';
        typeTest('30/08/19921', fixture);
        expect(component.form.value).toBe('30081992');
    });

    it('model values shouldnt be bigger length than masks', () => {
        component.mask = '00-00-00';
        component.dropSpecialCharacters = false;
        equal('2578989', '25-78-98', fixture);
        expect(component.form.value).toBe('25-78-98');
    });

    it('should work with custom special characters', () => {
        component.mask = '[000]-[000]*[00]';
        component.specialCharacters = ['[', ']', '-', '*'];
        equal('', '', fixture);
        equal('2578989', '[257]-[898]*[9', fixture);
        equal('2578989888988', '[257]-[898]*[98]', fixture);
        equal('111.111-11', '[111]-[111]*[11]', fixture);
    });

    it('should work with custom patterns', () => {
        component.mask = '[000]-[000]*[00]';
        component.specialCharacters = ['[', ']', '-', '*'];
        component.patterns = {
            '0': {
                pattern: new RegExp('[a-zA-Z]'),
            },
        };
        equal('', '', fixture);
        equal('2578989', '[', fixture);
        equal('hello world', '[hel]-[low]*[or]', fixture);
        equal('111.111-11', '[', fixture);

        component.mask = '(000-000)';
        component.specialCharacters = ['(', '-', ')'];
        equal('323HelloWorld', '(Hel-loW)', fixture);

        component.mask = '[00]*[000]';
        component.specialCharacters = ['[', ']', '*'];
        component.patterns = {
            '0': {
                pattern: new RegExp('\\d'),
            },
        };
        equal('789-874.98', '[78]*[987]', fixture);
    });

    it('When I change the mask on-the-fly things should work normally', () => {
        component.mask = '0000.0000';
        equal('1.', '1', fixture);
        equal('1éáa2aaaaqwo', '12', fixture);
        equal('1234567', '1234.567', fixture);

        component.mask = '0.000.000';
        equal('1.', '1.', fixture);
        equal('1éáa2aaaaqwo', '1.2', fixture);
        equal('1234567', '1.234.567', fixture);

        component.mask = '';
        equal('1.', '1.', fixture);
        equal('1éáa2aaaaqwo', '1éáa2aaaaqwo', fixture);
        equal('1234567', '1234567', fixture);

        component.mask = '0000.0000';
        equal('1.', '1', fixture);
        equal('1éáa2aaaaqwo', '12', fixture);
        equal('1234567', '1234.567', fixture);
    });

    it('should work even has no mask', () => {
        component.mask = '';

        equal('1234567', '1234567', fixture);

        expect(component.form.value).toBe('1234567');
    });

    it('should be a UA phone', () => {
        component.mask = '000-00-00-00-000';
        equal('380975577234', '380-97-55-77-234', fixture);
    });

    it('should be a pasport number', () => {
        component.mask = 'AA 000000';
        equal('GH 234098', 'GH 234098', fixture);
    });

    it('should be bank card number', () => {
        component.mask = '0000-0000-0000-0000';
        equal('1234567890123456', '1234-5678-9012-3456', fixture);
    });

    it('should apply mask on backspace for non readonly inputs when all text is selected', () => {
        component.mask = 'AAAAAA';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = 'abcdef';
        inputTarget.readOnly = false;
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 6;

        const directiveInstance: NgxMaskDirective =
            debugElement.injector.get<NgxMaskDirective>(NgxMaskDirective);
        spyOn(directiveInstance._maskService, 'applyMask');
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        expect(directiveInstance._maskService.applyMask).toHaveBeenCalled();
    });

    it('should not apply mask on backspace for readonly inputs when all text is selected', () => {
        component.mask = 'AAAAAA';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = 'abcdef';
        inputTarget.readOnly = true;
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 6;

        const directiveInstance: NgxMaskDirective =
            debugElement.injector.get<NgxMaskDirective>(NgxMaskDirective);
        spyOn(directiveInstance._maskService, 'applyMask');
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        expect(directiveInstance._maskService.applyMask).not.toHaveBeenCalled();
    });

    it('should right work with {value, disable}', () => {
        component.mask = '000';
        fixture.detectChanges();
        component.form.setValue({
            value: 123,
            disable: true,
        });
        fixture.detectChanges();
        const inputEl = fixture.debugElement.query(By.css('input'));
        return Promise.resolve().then(() => {
            expect(inputEl.properties['disabled']).toEqual(true);
        });
    });

    it('should return empty string if input consist only special symbols', () => {
        component.mask = '(000) 000-00-00';
        fixture.detectChanges();
        equal('0', '(0', fixture);
        equal('(', '(', fixture);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        equal('(', '', fixture);
    });

    it('should remove ghost character on toggling mask', () => {
        component.mask = '0000';
        component.form.setValue('1111a');
        equal('1111a', '1111', fixture);
        expect(component.form.value).toBe('1111');
        component.mask = undefined;
        expect(component.form.value).toBe('1111');
    });

    it('Masks with letters uppercase', () => {
        component.mask = 'UUUU';
        fixture.detectChanges();
        equal('A', 'A', fixture);
        equal('AB', 'AB', fixture);
        equal('ABC', 'ABC', fixture);
        equal('ABCD', 'ABCD', fixture);
    });

    it('Masks with letters lowercase', () => {
        component.mask = 'LLLL';
        fixture.detectChanges();
        equal('a', 'a', fixture);
        equal('ab', 'ab', fixture);
        equal('abc', 'abc', fixture);
        equal('abcd', 'abcd', fixture);
    });
    it('0.0000004 after writeValue should be 0.0000004', () => {
        component.mask = 'separator.7';
        fixture.detectChanges();
        component.form.setValue(0.0000004);
        equal('0.0000004', '0.0000004', fixture);
        expect(component.form.value).toBe(0.0000004);
    });
    it('mask 0000 0000 0000 9999 9999', () => {
        component.mask = '0000 0000 0000 9999 9999';
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '1234 5', fixture);
        equal('123456', '1234 56', fixture);
        equal('1234567', '1234 567', fixture);
        equal('12345678', '1234 5678', fixture);
        equal('123456789', '1234 5678 9', fixture);
        equal('1234567890', '1234 5678 90', fixture);
        equal('12345678901', '1234 5678 901', fixture);
        equal('123456789012', '1234 5678 9012', fixture);
        equal('1234567890123', '1234 5678 9012 3', fixture);
        equal('12345678901234', '1234 5678 9012 34', fixture);
        equal('123456789012345', '1234 5678 9012 345', fixture);
        equal('1234567890123456', '1234 5678 9012 3456', fixture);
        equal('12345678901234567', '1234 5678 9012 3456 7', fixture);
        equal('123456789012345678', '1234 5678 9012 3456 78', fixture);
        equal('1234567890123456789', '1234 5678 9012 3456 789', fixture);
        equal('12345678901234567890', '1234 5678 9012 3456 7890', fixture);
        equal('1234 5678 9012 3456', '1234 5678 9012 3456', fixture);
    });
    it('mask SS00 AAAA 0000 0000 0000 0000 9999 9999 99', () => {
        component.mask = 'SS00 AAAA 0000 0000 0000 0000 9999 9999 99';
        equal(
            'FR12345678901234567890123456789012',
            'FR12 3456 7890 1234 5678 9012 3456 7890 12',
            fixture
        );
        equal(
            'FR12 3456 7890 1234 5678 9012 3456 7890',
            'FR12 3456 7890 1234 5678 9012 3456 7890',
            fixture
        );
    });

    it('Mask with optional parameter', () => {
        component.mask = '9999 999 999';
        equal('3', '3', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '1234 5', fixture);
        equal('123456', '1234 56', fixture);
        equal('1234567', '1234 567', fixture);
        equal('12345678', '1234 567 8', fixture);
        equal('123456789', '1234 567 89', fixture);
        equal('1234567890', '1234 567 890', fixture);
    });

    it('Mask 099.09', () => {
        component.mask = '099.09';
        equal('1.23', '1.23', fixture);
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '123.4', fixture);
        equal('12345', '123.45', fixture);
        equal('1.2', '1.2', fixture);
        equal('1.23', '1.23', fixture);
        equal('12.2', '12.2', fixture);
        equal('12.23', '12.23', fixture);
    });

    it('Mask 09/09/0099', () => {
        component.mask = '09/09/0099';
        equal('1123', '11/23', fixture);
        equal('1/2', '1/2', fixture);
        equal('12/2/2020', '12/2/2020', fixture);
        equal('12345', '12/34/5', fixture);
        equal('1234', '12/34', fixture);
        equal('1/2/345', '1/2/345', fixture);
        equal('11/2', '11/2', fixture);
        equal('22222222', '22/22/2222', fixture);
        equal('12/2/2222', '12/2/2222', fixture);
        equal('1/23/2000', '1/23/2000', fixture);
    });

    it('Mask 099.00099999999999', () => {
        component.mask = '099.00099999999999';
        equal('1.2222222', '1.2222222', fixture);
        equal('111111111111', '111.111111111', fixture);
        equal('11.11111111111', '11.11111111111', fixture);
    });

    it('dropSpecialCharacter should return prefix or delete it value', () => {
        component.mask = '0000';
        component.prefix = 'foo/';
        component.dropSpecialCharacters = false;
        equal('2574', 'foo/2574', fixture);
        expect(component.form.value).toBe('foo/2574');
        expect(component.form.valid).toBeTruthy();

        equal('2', 'foo/2', fixture);
        expect(component.form.value).toBe('foo/2');
        expect(component.form.valid).toBeFalse();

        equal('25', 'foo/25', fixture);
        expect(component.form.value).toBe('foo/25');
        expect(component.form.valid).toBeFalse();

        equal('257', 'foo/257', fixture);
        expect(component.form.value).toBe('foo/257');
        expect(component.form.valid).toBeFalse();

        equal('', 'foo/', fixture);
        expect(component.form.value).toBe('');
    });

    it('Should be not valid if length of input doesnt match mask', () => {
        component.mask = '000 000-00-00';
        component.prefix = '+7 ';
        equal('2', '+7 2', fixture);
        expect(component.form.value).toBe('2');
        expect(component.form.valid).toBeFalse();
        equal('23', '+7 23', fixture);
        expect(component.form.value).toBe('23');
        expect(component.form.valid).toBeFalse();

        equal('234', '+7 234', fixture);
        expect(component.form.value).toBe('234');
        expect(component.form.valid).toBeFalse();

        equal('2234', '+7 223 4', fixture);
        expect(component.form.value).toBe('2234');
        expect(component.form.valid).toBeFalse();

        equal('22345', '+7 223 45', fixture);
        expect(component.form.value).toBe('22345');
        expect(component.form.valid).toBeFalse();

        equal('223456', '+7 223 456', fixture);
        expect(component.form.value).toBe('223456');
        expect(component.form.valid).toBeFalse();

        equal('2234562', '+7 223 456-2', fixture);
        expect(component.form.value).toBe('2234562');
        expect(component.form.valid).toBeFalse();

        equal('22345622', '+7 223 456-22', fixture);
        expect(component.form.value).toBe('22345622');
        expect(component.form.valid).toBeFalse();

        equal('223456223', '+7 223 456-22-3', fixture);
        expect(component.form.value).toBe('223456223');
        expect(component.form.valid).toBeFalse();

        equal('2234562233', '+7 223 456-22-33', fixture);
        expect(component.form.value).toBe('2234562233');
        expect(component.form.valid).toBeTruthy();
    });

    it('Mask 0/9', () => {
        component.mask = '0/9';
        equal('1', '1', fixture);
        equal('1/', '1/', fixture);
        equal('1/2', '1/2', fixture);
    });

    it('Mask 9*/0*', () => {
        component.mask = '9*/0*';
        equal('1', '1', fixture);
        equal('1/', '1/', fixture);
        equal('1/2', '1/2', fixture);
        equal('122/22', '122/22', fixture);
        equal('/1', '/1', fixture);
        equal('/222', '/222', fixture);
        equal('1/22', '1/22', fixture);
        equal('/', '/', fixture);
    });

    it('Mask 9000/0000', () => {
        component.mask = '0009/0000';
        equal('111/1111', '111/1111', fixture);
        equal('1111/1111', '1111/1111', fixture);
    });

    it('Mask 00009-0000', () => {
        component.mask = '00009-0000';
        equal('0000-0000', '0000-0000', fixture);
        equal('12345-6789', '12345-6789', fixture);
    });

    it('Mask 099L', () => {
        component.mask = '099L';
        equal('1d', '1d', fixture);
        equal('22r', '22r', fixture);
        equal('223r', '223r', fixture);
    });

    it('Mask 09999/099L', () => {
        component.mask = '09999/099L';
        equal('1/2d', '1/2d', fixture);
        equal('12/2d', '12/2d', fixture);
        equal('123/2d', '123/2d', fixture);
        equal('1234/2d', '1234/2d', fixture);
        equal('12345/2d', '12345/2d', fixture);
        equal('12345/22d', '12345/22d', fixture);
        equal('12345/223d', '12345/223d', fixture);
    });

    it('Mask 099SS', () => {
        component.mask = '099SS';
        equal('1d', '1d', fixture);
        equal('1dD', '1dD', fixture);
        equal('11d', '11d', fixture);
        equal('111dD', '111dD', fixture);
        equal('112SS', '112SS', fixture);
    });

    it('Mask     999999-0009999999/0000', () => {
        component.mask = '999999-0009999999/0000';
        equal('1-123/1234', '1-123/1234', fixture);
        equal('12-123/1234', '12-123/1234', fixture);
        equal('123-123/1234', '123-123/1234', fixture);
        equal('1234-123/1234', '1234-123/1234', fixture);
        equal('12345-123/1234', '12345-123/1234', fixture);
        equal('123456-123/1234', '123456-123/1234', fixture);
        equal('123456-1234/1234', '123456-1234/1234', fixture);
        equal('123456-12345/1234', '123456-12345/1234', fixture);
        equal('123456-123456/1234', '123456-123456/1234', fixture);
        equal('123456-1234567/1234', '123456-1234567/1234', fixture);
        equal('123456-12345678/1234', '123456-12345678/1234', fixture);
        equal('123456-123456789/1234', '123456-123456789/1234', fixture);
        equal('123456-1234567891/1234', '123456-1234567891/1234', fixture);
    });

    it('setValue undefined should return undefined ', () => {
        component.mask = '0000';
        equal('1234', '1234', fixture);
        component.form.setValue(undefined);
        expect(component.form.value).toBe(undefined);
    });

    it('after resetValue should show in model same value', () => {
        component.mask = '0';
        equal('1', '1', fixture);
        component.form.reset();
        equal('1', '1', fixture);
        expect(component.form.value).toBe('1');
    });

    it('after resetValue should show in model same value', () => {
        component.mask = '9';
        equal('2', '2', fixture);
        component.form.reset();
        equal('2', '2', fixture);
        expect(component.form.value).toBe('2');
    });

    it('should work with optional mask 09.09', () => {
        component.mask = '09.09';
        equal('2', '2', fixture);
        equal('2.3', '2.3', fixture);
        equal('2.34', '2.34', fixture);
        equal('21', '21', fixture);
        equal('21.2', '21.2', fixture);
        equal('21.24', '21.24', fixture);
    });

    it('should work change value after setValue to empty string mask 9', () => {
        component.mask = '9';
        equal('2', '2', fixture);
        component.form.setValue('');
        equal('2', '2', fixture);
        expect(component.form.value).toBe('2');
    });

    it('should work change value after setValue to empty string mask 0', () => {
        component.mask = '0';
        equal('4', '4', fixture);
        component.form.setValue('');
        equal('4', '4', fixture);
        expect(component.form.value).toBe('4');
    });
});
