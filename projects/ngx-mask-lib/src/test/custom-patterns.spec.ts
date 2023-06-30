import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';
import { IConfig, initialConfig } from 'ngx-mask';

describe('Directive: Mask (Custom patterns)', () => {
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

    it('custom patterns', () => {
        component.mask = 'FFF';
        component.patterns = {
            F: {
                pattern: new RegExp('[0-9]'),
            },
        };
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

    const ngxMaskConfigValue: Partial<IConfig> = {
        patterns: { ...initialConfig.patterns, ...ngxMaskCustomPatterns },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask(ngxMaskConfigValue)],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('custom patterns B should be work like optional', () => {
        component.mask = 'SSBB-0999';

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

    const ngxMaskConfigValue: Partial<IConfig> = {
        patterns: { ...initialConfig.patterns, ...ngxMaskCustomPatterns },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask(ngxMaskConfigValue)],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('custom patterns * should work with mask *-*', () => {
        component.mask = '*-*';
        equal('22', '2-2', fixture);
    });

    it('custom patterns * should work with mask **-**', () => {
        component.mask = '**-**';
        equal('22', '22', fixture);
        equal('123', '12-3', fixture);
        equal('1234', '12-34', fixture);
    });

    it('custom patterns * should work with mask ***-***', () => {
        component.mask = '***-***';
        equal('123456', '123-456', fixture);
    });

    it('custom patterns * should work with mask ****-****', () => {
        component.mask = '****-****';
        equal('12345678', '1234-5678', fixture);
    });

    it('custom patterns * should work with mask *****-*****', () => {
        component.mask = '*****-*****';
        equal('1234567890', '12345-67890', fixture);
    });
});
