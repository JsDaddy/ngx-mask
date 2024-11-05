import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

@Component({
    selector: 'jsdaddy-open-source-test',
    template: ` <input id="maska" mask="0000" [formControl]="form" /> `,
})
export class TestMaskNoValidationAttributeComponent {
    public form: FormControl = new FormControl('');
}

@Component({
    selector: 'jsdaddy-open-source-test',
    template: ` <input id="maska" mask="0000" [validation]="validate" [formControl]="form" /> `,
})
export class TestMaskValidationAttributeComponent {
    public form: FormControl = new FormControl('');

    public validate = true;
}

@Component({
    selector: 'jsdaddy-open-source-test',
    template: `
        <input
            id="maska"
            [mask]="mask"
            [validation]="validate"
            [dropSpecialCharacters]="dropSpecialCharacters"
            [formControl]="form" />
    `,
})
export class TestMaskValidationEmailComponent {
    public form: FormControl = new FormControl('');

    public mask = '';

    public validate = true;

    public dropSpecialCharacters = false;
}

@Component({
    selector: 'jsdaddy-open-source-test',
    template: ` <input id="maska" [mask]="mask" [validation]="validate" [formControl]="form" /> `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TestMaskValidationTestSymbolStar {
    public form: FormControl = new FormControl('', [Validators.required, Validators.min(1)]);
    public mask = '';
    public validate = true;
}

@Component({
    selector: 'jsdaddy-open-source-test',
    template: ` <input id="maska" [mask]="mask" [validation]="validate" [formControl]="form" /> `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TestValidatorNumber {
    public form: FormControl = new FormControl(44, Validators.required);
    public mask = '';
    public validate = true;
}

@Component({
    selector: 'jsdaddy-open-source-test',
    template: `
        <input
            id="maska"
            [mask]="mask"
            [specialCharacters]="specialCharacters"
            [dropSpecialCharacters]="dropSpecialCharacters"
            [formControl]="form" />
    `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TestValidatorDropSpecialCharacters {
    public form: FormControl = new FormControl('+373', Validators.required);
    public mask = '+000';
    public specialCharacters = ['+', ' '];
    public dropSpecialCharacters = [' '];
}

@Component({
    selector: 'jsdaddy-open-source-test',
    template: `
        <input
            id="maska"
            [mask]="mask"
            [dropSpecialCharacters]="dropSpecialCharacters"
            [formControl]="form" />
    `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TestValidatorEmailMask {
    public form: FormControl = new FormControl('', Validators.required);
    public mask = 'A*@A*.A*';
    public dropSpecialCharacters = false;
}

describe('Directive: Mask (Validation)', () => {
    describe('Global validation true, validation attribute on input not specified', () => {
        let fixture: ComponentFixture<TestMaskNoValidationAttributeComponent>;
        let component: TestMaskNoValidationAttributeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskNoValidationAttributeComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask({ validation: true })],
            });
            fixture = TestBed.createComponent(TestMaskNoValidationAttributeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be marked as not valid if not valid', () => {
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(false);
            expect(component.form.hasError('mask')).toBe(true);
        });

        it('should be marked as valid if valid', () => {
            equal('1234', '1234', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation true, validation attribute on input specified', () => {
        let fixture: ComponentFixture<TestMaskValidationAttributeComponent>;
        let component: TestMaskValidationAttributeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskValidationAttributeComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask()],
            });
            fixture = TestBed.createComponent(TestMaskValidationAttributeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be marked as not valid if not valid and validation attribute true', () => {
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(false);
            expect(component.form.hasError('mask')).toBe(true);
        });

        it('should be marked as valid if valid and validation attribute true', () => {
            equal('1234', '1234', fixture);
            expect(component.form.valid).toBe(true);
        });

        it('should be marked as valid if not valid and validation attribute false', () => {
            component.validate = false;
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation false, validation attribute on input not specified', () => {
        let fixture: ComponentFixture<TestMaskNoValidationAttributeComponent>;
        let component: TestMaskNoValidationAttributeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskNoValidationAttributeComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask({ validation: false })],
            });
            fixture = TestBed.createComponent(TestMaskNoValidationAttributeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be marked as valid if not valid', () => {
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation false, validation attribute on input specified', () => {
        let fixture: ComponentFixture<TestMaskValidationAttributeComponent>;
        let component: TestMaskValidationAttributeComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskValidationAttributeComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask()],
            });
            fixture = TestBed.createComponent(TestMaskValidationAttributeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be marked as not valid if not valid and validation attribute true', () => {
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(false);
            expect(component.form.hasError('mask')).toBe(true);
        });

        it('should be marked as valid if not valid and validation attribute false', () => {
            component.validate = false;
            equal('12', '12', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation for email', () => {
        let fixture: ComponentFixture<TestMaskValidationEmailComponent>;
        let component: TestMaskValidationEmailComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskValidationEmailComponent],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask()],
            });
            fixture = TestBed.createComponent(TestMaskValidationEmailComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should be not valid email mask A*@A*.SSS', () => {
            component.mask = 'A*@A*.SSS';
            equal('a', 'a', fixture);
            expect(component.form.valid).toBe(false);
            equal('as', 'as', fixture);
            expect(component.form.valid).toBe(false);
            equal('asd', 'asd', fixture);
            expect(component.form.valid).toBe(false);
            equal('andr', 'andr', fixture);
            expect(component.form.valid).toBe(false);
            equal('testing', 'testing', fixture);
            expect(component.form.valid).toBe(false);
            equal('testing@', 'testing@', fixture);
            expect(component.form.valid).toBe(false);
            equal('testing@a', 'testing@a', fixture);
            expect(component.form.valid).toBe(false);
            equal('testing@aa', 'testing@aa', fixture);
            expect(component.form.valid).toBe(false);
            equal('testing@gmail', 'testing@gmail', fixture);
            expect(component.form.valid).toBe(false);
            equal('testing@gmail.', 'testing@gmail.', fixture);
            expect(component.form.valid).toBe(false);
            equal('testing@gmail.c', 'testing@gmail.c', fixture);
            expect(component.form.valid).toBe(false);
            equal('testing@email.ua', 'testing@email.ua', fixture);
            expect(component.form.valid).toBe(false);
        });

        it('should valid email mask A*@A*.SSS', () => {
            component.mask = 'A*@A*.SSS';
            equal('testing@gmail.com', 'testing@gmail.com', fixture);
            expect(component.form.valid).toBe(true);
        });

        it('should be not valid mask A*@A*.SS', () => {
            component.mask = 'A*@A*.SS';
            equal('d', 'd', fixture);
            expect(component.form.valid).toBe(false);
            equal('dd', 'dd', fixture);
            expect(component.form.valid).toBe(false);
            equal('ddd', 'ddd', fixture);
            expect(component.form.valid).toBe(false);
            equal('dddd', 'dddd', fixture);
            expect(component.form.valid).toBe(false);
            equal('andre', 'andre', fixture);
            expect(component.form.valid).toBe(false);
            equal('andrey', 'andrey', fixture);
            expect(component.form.valid).toBe(false);
            equal('andrey@', 'andrey@', fixture);
            expect(component.form.valid).toBe(false);
            equal('andrey@a', 'andrey@a', fixture);
            expect(component.form.valid).toBe(false);
            equal('andrey@te', 'andrey@te', fixture);
            expect(component.form.valid).toBe(false);
            equal('andrey@test', 'andrey@test', fixture);
            expect(component.form.valid).toBe(false);
            equal('andrey@test.c', 'andrey@test.c', fixture);
            expect(component.form.valid).toBe(false);
        });

        it('should valid email mask', () => {
            component.mask = 'A*@A*.SS';
            equal('testing@some.ua', 'testing@some.ua', fixture);
            expect(component.form.valid).toBe(true);
        });
    });
    describe('Global validation symbol star', () => {
        let fixture: ComponentFixture<TestMaskValidationTestSymbolStar>;
        let component: TestMaskValidationTestSymbolStar;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestMaskValidationTestSymbolStar],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask()],
            });
            fixture = TestBed.createComponent(TestMaskValidationTestSymbolStar);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should valid from one digit mask 0*', () => {
            component.mask = '0*';
            component.validate = true;
            equal('', '', fixture);
            expect(component.form.valid).toBe(false);
            equal('0', '0', fixture);
            expect(component.form.valid).toBe(false);
            equal('00', '00', fixture);
            expect(component.form.valid).toBe(false);
            equal('1', '1', fixture);
            expect(component.form.valid).toBe(true);
            equal('01', '01', fixture);
            expect(component.form.valid).toBe(true);
        });

        it('should valid from one digit mask S*', () => {
            component.mask = 'S*';
            component.validate = true;
            equal('', '', fixture);
            expect(component.form.valid).toBe(false);
            equal('d', 'd', fixture);
            expect(component.form.valid).toBe(true);
        });

        it('should valid from one digit mask A*', () => {
            component.mask = 'A*';
            component.validate = true;
            equal('', '', fixture);
            expect(component.form.valid).toBe(false);
            equal('d', 'd', fixture);
            expect(component.form.valid).toBe(true);
            equal('1', '1', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation true, validation attribute on input not specified', () => {
        let fixture: ComponentFixture<TestValidatorNumber>;
        let component: TestValidatorNumber;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestValidatorNumber],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask({ validation: true })],
            });
            fixture = TestBed.createComponent(TestValidatorNumber);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('mask with number value should work as expected mask 0*', () => {
            component.mask = '0*';
            equal('44', '44', fixture);
            expect(component.form.valid).toBe(true);
            expect(component.form.value).toBe(44);

            equal('', '', fixture);
            expect(component.form.invalid).toBe(true);
            expect(component.form.value).toBe('');

            equal('1', '1', fixture);
            expect(component.form.valid).toBe(true);
            expect(component.form.value).toBe(1);
        });

        it('mask with number value should work as expected mask 000.00', () => {
            component.mask = '000.00';
            equal('', '', fixture);
            expect(component.form.invalid).toBe(true);
            expect(component.form.value).toBe('');

            equal('44', '44', fixture);
            expect(component.form.invalid).toBe(true);
            expect(component.form.value).toBe(44);

            equal('1', '1', fixture);
            expect(component.form.invalid).toBe(true);
            expect(component.form.value).toBe(1);

            equal('444', '444', fixture);
            expect(component.form.invalid).toBe(true);
            expect(component.form.value).toBe(444);

            equal('444.3', '444.3', fixture);
            expect(component.form.invalid).toBe(true);
            expect(component.form.value).toBe(4443);

            equal('444.31', '444.31', fixture);
            expect(component.form.valid).toBe(true);
            expect(component.form.value).toBe(44431);
        });
    });

    describe('Global validation true, dropSpecialCharacters attribute on input specified as array', () => {
        let fixture: ComponentFixture<TestValidatorDropSpecialCharacters>;
        let component: TestValidatorDropSpecialCharacters;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestValidatorDropSpecialCharacters],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask({ validation: true })],
            });
            fixture = TestBed.createComponent(TestValidatorDropSpecialCharacters);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('dropSpecialCharacters is different from specialCharacters', () => {
            component.mask = '+000';
            component.specialCharacters = ['+', ' '];
            component.dropSpecialCharacters = [' '];

            equal('+37', '+37', fixture);
            expect(component.form.valid).toBe(false);

            equal('+373', '+373', fixture);
            expect(component.form.valid).toBe(true);

            component.mask = '+000 000 00 000';

            equal('+3736000000', '+373 600 00 00', fixture);
            expect(component.form.valid).toBe(false);

            equal('+37360000000', '+373 600 00 000', fixture);
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Global validation true, email mask', () => {
        let fixture: ComponentFixture<TestValidatorEmailMask>;
        let component: TestValidatorEmailMask;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestValidatorEmailMask],
                imports: [ReactiveFormsModule, NgxMaskDirective],
                providers: [provideNgxMask({ validation: true })],
            });
            fixture = TestBed.createComponent(TestValidatorEmailMask);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('email Mask should validated correct', () => {
            component.mask = 'A*@A*.A*';
            component.dropSpecialCharacters = false;

            equal('validate', 'validate', fixture);
            expect(component.form.valid).toBe(false);

            equal('validate@', 'validate@', fixture);
            expect(component.form.valid).toBe(false);

            equal('validate@some', 'validate@some', fixture);
            expect(component.form.valid).toBe(false);

            equal('validate@some.', 'validate@some.', fixture);
            expect(component.form.valid).toBe(false);

            equal('validate@some.e', 'validate@some.e', fixture);
            expect(component.form.valid).toBe(true);

            equal('validate@some.eu', 'validate@some.eu', fixture);
            expect(component.form.valid).toBe(true);

            equal('validate@some.com', 'validate@some.com', fixture);
            expect(component.form.valid).toBe(true);
        });
    });
});
