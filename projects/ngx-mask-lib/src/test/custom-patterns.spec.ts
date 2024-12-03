import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import type { NgxMaskConfig } from 'ngx-mask';
import { initialConfig } from 'ngx-mask';

describe('Directive: Mask (Custom patterns)', () => {
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

    it('custom patterns', () => {
        component.mask.set('FFF');
        component.patterns.set({
            F: {
                pattern: new RegExp('[0-9]'),
            },
        });
        equal('F', '', fixture);
        equal('123', '123', fixture);
    });
});

describe('Directive: Mask (Provide custom patterns)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    const ngxMaskCustomPatterns = {
        // Letters only and Optional
        B: { pattern: new RegExp('[a-zA-Z]'), optional: true },
    };

    const ngxMaskConfigValue: Partial<NgxMaskConfig> = {
        patterns: { ...initialConfig.patterns, ...ngxMaskCustomPatterns },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask(ngxMaskConfigValue)],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('custom patterns B should be work like optional', () => {
        component.mask.set('SSBB-0999');

        equal('F', 'F', fixture);
        equal('FF', 'FF', fixture);
        equal('FF-2', 'FF-2', fixture);
        equal('FF-22', 'FF-22', fixture);
        equal('FF-223', 'FF-223', fixture);
        equal('FF-2233', 'FF-2233', fixture);

        equal('FFD-2', 'FFD-2', fixture);
        equal('FFD-22', 'FFD-22', fixture);
        equal('FFD-223', 'FFD-223', fixture);
        equal('FFD-2233', 'FFD-2233', fixture);

        equal('FFDD-2', 'FFDD-2', fixture);
        equal('FFDD-22', 'FFDD-22', fixture);
        equal('FFDD-223', 'FFDD-223', fixture);
        equal('FFDD-2233', 'FFDD-2233', fixture);
    });
});

describe('Directive: Mask (Provide custom patterns with symbol *)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    const ngxMaskCustomPatterns = {
        '*': { pattern: new RegExp('[a-zA-Z0-9]') },
    };

    const ngxMaskConfigValue: Partial<NgxMaskConfig> = {
        patterns: { ...initialConfig.patterns, ...ngxMaskCustomPatterns },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask(ngxMaskConfigValue)],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('custom patterns * should work with mask *-*', () => {
        component.mask.set('*-*');
        equal('22', '2-2', fixture);
    });

    it('custom patterns * should work with mask **-**', () => {
        component.mask.set('**-**');
        equal('22', '22', fixture);
        equal('123', '12-3', fixture);
        equal('1234', '12-34', fixture);
    });

    it('custom patterns * should work with mask ***-***', () => {
        component.mask.set('***-***');
        equal('123456', '123-456', fixture);
    });

    it('custom patterns * should work with mask ****-****', () => {
        component.mask.set('****-****');
        equal('12345678', '1234-5678', fixture);
    });

    it('custom patterns * should work with mask *****-*****', () => {
        component.mask.set('*****-*****');
        equal('1234567890', '12345-67890', fixture);
    });
});

describe('Directive: Mask (Provide custom patterns with symbol f and F)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    const ngxMaskConfig: NgxMaskConfig = {
        ...initialConfig,
        patterns: {
            f: {
                pattern: /[a-zA-Z0-9 ]/,
            },
            F: {
                pattern: /[а-яА-Яa-zA-Z0-9 ]/,
            },
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask(ngxMaskConfig)],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('custom patterns f* should work not delete space after setTimeout', () => {
        component.mask.set('f*');
        equal('test value', 'test value', fixture);
        equal('test value with', 'test value with', fixture);
        equal('test value with space', 'test value with space', fixture);
        setTimeout(() => {
            component.mask.set('F*');
            expect(component.form.value).toBe('test value with space');
        });
    });

    it('custom patterns F* should work not delete space after setTimeout', () => {
        component.mask.set('F*');
        equal('test value', 'test value', fixture);
        equal('test value with', 'test value with', fixture);
        equal('test value with space', 'test value with space', fixture);
        setTimeout(() => {
            component.mask.set('f*');
            expect(component.form.value).toBe('test value with space');
        });
    });
});

describe('Directive: Mask (Provide custom patterns with symbol B optional)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    const ngxMaskCustomPatterns = {
        '0': { pattern: new RegExp('\\d') },
        A: { pattern: new RegExp('[0-9,;]'), optional: false },
        B: { pattern: new RegExp('[0-9,;]'), optional: true },
    };

    const ngxMaskConfigValue: Partial<NgxMaskConfig> = {
        patterns: { ...initialConfig.patterns, ...ngxMaskCustomPatterns },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask(ngxMaskConfigValue)],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('custom mask with optional symbol should work correct mask=(000) 000-0000 x BBBBBBBBBB', () => {
        component.mask.set('(000) 000-0000 x BBBBBBBBBB');
        component.specialCharacters.set(['(', ')', ' ', '-', 'x']);

        equal('1', '(1', fixture);
        equal('12', '(12', fixture);
        equal('123', '(123', fixture);
        equal('1234', '(123) 4', fixture);
        equal('12345', '(123) 45', fixture);
        equal('123456', '(123) 456', fixture);
        equal('1234567', '(123) 456-7', fixture);
        equal('12345678', '(123) 456-78', fixture);
        equal('123456789', '(123) 456-789', fixture);
        equal('1234567890', '(123) 456-7890', fixture);
        equal('1234567890 1', '(123) 456-7890 x 1', fixture);
        equal('1234567890 12', '(123) 456-7890 x 12', fixture);
        equal('1234567890 123', '(123) 456-7890 x 123', fixture);
        equal('1234567890 1234', '(123) 456-7890 x 1234', fixture);
        equal('1234567890 12345', '(123) 456-7890 x 12345', fixture);
        equal('1234567890 123456', '(123) 456-7890 x 123456', fixture);
        equal('1234567890 1234567', '(123) 456-7890 x 1234567', fixture);
        equal('1234567890 12345678', '(123) 456-7890 x 12345678', fixture);
        equal('1234567890 123456789', '(123) 456-7890 x 123456789', fixture);
        equal('1234567890 1234567890', '(123) 456-7890 x 1234567890', fixture);
    });

    it('custom mask with optional symbol should work correct mask=BBB-BBB-BBB', () => {
        component.mask.set('BBB-BBB-BBB');

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '123-4', fixture);
        equal('12345', '123-45', fixture);
        equal('123456', '123-456', fixture);
        equal('1234567', '123-456-7', fixture);
        equal('12345678', '123-456-78', fixture);
        equal('123456789', '123-456-789', fixture);
        equal('1-', '1-', fixture);
        equal('1-2', '1-2', fixture);
        equal('1-2-3', '1-2-3', fixture);
        equal('1-2-345', '1-2-345', fixture);
        equal('12-3-45', '12-3-45', fixture);
        equal('12-34-56', '12-34-56', fixture);
        equal('12-34-567', '12-34-567', fixture);
        equal('123-4-5', '123-4-5', fixture);
        equal('123-45-6', '123-45-6', fixture);
    });
});
