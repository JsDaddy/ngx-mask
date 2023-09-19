import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskModule } from '../lib/ngx-mask.module';

describe('Directive: Mask (Repeat)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskModule.forRoot()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('repeat mask', () => {
        component.mask = '0{4}';
        equal('1234', '1234', fixture);
    });

    it('should work when repeat value is more then 9', () => {
        component.mask = 'A{12}';
        equal('123456789ABC', '123456789ABC', fixture);
    });

    it('should correctly handle leading zeros', () => {
        component.mask = 'A{02}';
        equal('1234', '12', fixture);

        component.mask = 'A{0000012}';
        equal('123456789ABCDE', '123456789ABC', fixture);
    });

    it('should repeat digits only', () => {
        component.mask = '0{6}';
        equal('AbC12345678Bfc', '123456', fixture);
    });

    it('should repeat digits and letters', () => {
        component.mask = 'A{6}';
        equal('AbC12345678Bfc', 'AbC123', fixture);
    });

    it('should repeat only letters', () => {
        component.mask = 'S{6}';
        equal('AbC12345678Bfc', 'AbCBfc', fixture);
    });

    it('repeat mask date', () => {
        component.mask = '0{2}/0{2}/0{4}';
        equal('12345678', '12/34/5678', fixture);
    });

    // it('specialCharacters quotes', () => {
    //     component.mask = '\'00\'00\'0000\'';
    //     equal('12345678', '\'12\'34\'5678\'', fixture);
    // });

    it('specialCharacters quotes', () => {
        component.mask = '0-0-0*-0*-0*';
        equal('123', '1-2-3', fixture);
        equal('123-42-', '1-2-3-42-', fixture);
    });

    it('should repeat digits only and work with dynamicMask', () => {
        component.mask = '0{4}||0{6}';
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '12345', fixture);
        equal('123456', '123456', fixture);
    });

    it('should repeat digits only and work with dynamicMask', () => {
        component.mask = 'SS0{4}';
        equal('d', 'd', fixture);
        equal('dd', 'dd', fixture);
        equal('dd1', 'dd1', fixture);
        equal('aa22', 'aa22', fixture);
        equal('aa222', 'aa222', fixture);
        equal('dd2134', 'dd2134', fixture);
    });

    it('should repeat digits only and work with dynamicMask', () => {
        component.mask = 'A{5}.S{2}';
        equal('d', 'd', fixture);
        equal('dd', 'dd', fixture);
        equal('dd1', 'dd1', fixture);
        equal('aa22', 'aa22', fixture);
        equal('aa222', 'aa222', fixture);
        equal('dd213D', 'dd213.D', fixture);
        equal('dd213DW', 'dd213.DW', fixture);
    });
});
