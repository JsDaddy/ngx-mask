import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask (Placeholder character)', () => {
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

    it('should display the default placeholder when not configured', () => {
        component.mask = '(000) 000-0000';
        component.showMaskTyped = true;
        equal('', '(___) ___-____', fixture);
        equal('2345678', '(234) 567-8___', fixture);

        component.prefix = '+7';
        component.showMaskTyped = true;
        equal('', '+7(___) ___-____', fixture);
        equal('2345678', '+7(234) 567-8___', fixture);

        component.mask = 'IP';
        component.prefix = '';
        component.showMaskTyped = true;
        equal('', '_._._._', fixture);
        equal('1921681', '192.168.1_', fixture);

        component.mask = 'CPF_CNPJ';
        component.prefix = '';
        component.showMaskTyped = true;
        equal('', '___.___.___-__', fixture);
        equal('1', '1__.___.___-__', fixture);
        equal('12', '12_.___.___-__', fixture);
        equal('123', '123.___.___-__', fixture);
        equal('1234', '123.4__.___-__', fixture);
        equal('12345', '123.45_.___-__', fixture);
        equal('123456', '123.456.___-__', fixture);
        equal('1234567', '123.456.7__-__', fixture);
        equal('12345678', '123.456.78_-__', fixture);
        equal('123456789', '123.456.789-__', fixture);
        equal('1234567890', '123.456.789-0_', fixture);
        equal('12345678901', '123.456.789-01', fixture);
        equal('123456789012', '12.345.678/9012-__', fixture);
        equal('1234567890123', '12.345.678/9012-3_', fixture);
        equal('12345678901234', '12.345.678/9012-34', fixture);

        component.mask = '000.000.000-00||00.000.000/0000-00';
        component.prefix = '';
        component.showMaskTyped = true;
        equal('1', '1__.___.___-__', fixture);
        equal('12', '12_.___.___-__', fixture);
        equal('123', '123.___.___-__', fixture);
        equal('1234', '123.4__.___-__', fixture);
        equal('12345', '123.45_.___-__', fixture);
        equal('123456', '123.456.___-__', fixture);
        equal('1234567', '123.456.7__-__', fixture);
        equal('12345678', '123.456.78_-__', fixture);
        equal('123456789', '123.456.789-__', fixture);
        equal('1234567890', '123.456.789-0_', fixture);
        equal('12345678901', '123.456.789-01', fixture);
        equal('123456789012', '12.345.678/9012-__', fixture);
        equal('1234567890123', '12.345.678/9012-3_', fixture);
        equal('12345678901234', '12.345.678/9012-34', fixture);

        component.mask = '(00) 0000-0000||(00) 0 0000-0000';
        component.prefix = '';
        component.showMaskTyped = true;
        equal('1', '(1_) ____-____', fixture);
        equal('12', '(12) ____-____', fixture);
        equal('123', '(12) 3___-____', fixture);
        equal('1234', '(12) 34__-____', fixture);
        equal('12345', '(12) 345_-____', fixture);
        equal('123456', '(12) 3456-____', fixture);
        equal('1234567', '(12) 3456-7___', fixture);
        equal('12345678', '(12) 3456-78__', fixture);
        equal('123456789', '(12) 3456-789_', fixture);
        equal('1234567890', '(12) 3456-7890', fixture);
        equal('12345678901', '(12) 3 4567-8901', fixture);
        equal('(1', '(1_) ____-____', fixture);
        equal('(12', '(12) ____-____', fixture);
        equal('(12)', '(12) ____-____', fixture);
        equal('(12) 3', '(12) 3___-____', fixture);
        equal('(12) 34', '(12) 34__-____', fixture);
        equal('(12) 345', '(12) 345_-____', fixture);
        equal('(12) 3456', '(12) 3456-____', fixture);
        equal('(12) 3456-7', '(12) 3456-7___', fixture);
        equal('(12) 3456-78', '(12) 3456-78__', fixture);
        equal('(12) 3456-789', '(12) 3456-789_', fixture);
        equal('(12) 3456-7890', '(12) 3456-7890', fixture);
        equal('(12) 3 4567-8901', '(12) 3 4567-8901', fixture);
    });

    it('should display the modified placeholder when configured', () => {
        component.mask = '(000) 000-0000';
        component.showMaskTyped = true;
        component.placeHolderCharacter = '*';
        equal('', '(***) ***-****', fixture);
        equal('2345678', '(234) 567-8***', fixture);

        component.prefix = '+7';
        component.showMaskTyped = true;
        equal('', '+7(***) ***-****', fixture);
        equal('2345678', '+7(234) 567-8***', fixture);

        component.mask = 'IP';
        component.prefix = '';
        component.showMaskTyped = true;
        equal('', '*.*.*.*', fixture);
        equal('1921681', '192.168.1*', fixture);

        component.mask = 'CPF_CNPJ';
        component.prefix = '';
        component.showMaskTyped = true;
        equal('', '***.***.***-**', fixture);
        equal('1', '1**.***.***-**', fixture);
        equal('12', '12*.***.***-**', fixture);
        equal('123', '123.***.***-**', fixture);
        equal('1234', '123.4**.***-**', fixture);
        equal('12345', '123.45*.***-**', fixture);
        equal('123456', '123.456.***-**', fixture);
        equal('1234567', '123.456.7**-**', fixture);
        equal('12345678', '123.456.78*-**', fixture);
        equal('123456789', '123.456.789-**', fixture);
        equal('1234567890', '123.456.789-0*', fixture);
        equal('12345678901', '123.456.789-01', fixture);
        equal('123456789012', '12.345.678/9012-**', fixture);
        equal('1234567890123', '12.345.678/9012-3*', fixture);
        equal('12345678901234', '12.345.678/9012-34', fixture);
    });
});
