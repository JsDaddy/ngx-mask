import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { expect } from 'vitest';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

// Issue #1515: masks with optional tokens BEFORE mandatory ones (e.g. 999SSS).
// Input handling works: the applier's optional-token branch skips unfilled
// optional positions when the typed char matches a later token, so letters
// can be typed directly into the S slots without filling the 9 slots first.
describe('Directive: Mask (issue #1515 — optional tokens before mandatory ones, input)', () => {
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

    it('999SSS accepts a letter as first input (optional digits skipped)', () => {
        component.mask.set('999SSS');
        equal('a', 'a', fixture);
        equal('abc', 'abc', fixture);
    });

    it('999SSS accepts digits into optional slots then letters', () => {
        component.mask.set('999SSS');
        equal('12abc', '12abc', fixture);
        equal('123abc', '123abc', fixture);
    });

    it('999SSS rejects a fourth digit (only 3 optional digit slots)', () => {
        component.mask.set('999SSS');
        equal('1234', '123', fixture);
    });

    it('SSS999 mandatory-first control still works', () => {
        component.mask.set('SSS999');
        equal('abc12', 'abc12', fixture);
        equal('abc123', 'abc123', fixture);
    });
});

// Validation half of #1515. validate() used to short-circuit to `null` whenever
// `processedValue.length >= maskValue.indexOf(<optional key>)`; with leading
// optional tokens indexOf() is 0, so every value passed validation even when
// mandatory tokens were unfilled. Fixed: the early return is restricted to
// trailing-optional layouts, and leading-optional plain-token masks are matched
// position-aware (optional tokens skippable, mandatory tokens must be consumed).
describe('Directive: Mask (optional tokens before mandatory ones — validation (#1515))', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask({ validation: true })],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('SSS999 (trailing optional) validates correctly — control', () => {
        component.mask.set('SSS999');
        equal('ab', 'ab', fixture);
        expect(component.form.valid).equal(false);

        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.mask.set('SSS999');
        equal('abc', 'abc', fixture);
        expect(component.form.valid).equal(true);
    });

    it('999SSS with complete mandatory letters is valid', () => {
        component.mask.set('999SSS');
        equal('abc', 'abc', fixture);
        expect(component.form.valid).equal(true);
    });

    it('999SSS with unfilled mandatory letters is invalid', () => {
        component.mask.set('999SSS');
        equal('a', 'a', fixture);
        expect(component.form.valid).equal(false);

        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.mask.set('999SSS');
        equal('12a', '12a', fixture);
        expect(component.form.valid).equal(false);
    });

    it('999SSS position-aware boundaries: 12ab invalid, 12abc valid, 123abc valid', () => {
        component.mask.set('999SSS');
        equal('12ab', '12ab', fixture);
        expect(component.form.valid).equal(false);

        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.mask.set('999SSS');
        equal('12abc', '12abc', fixture);
        expect(component.form.valid).equal(true);

        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.mask.set('999SSS');
        equal('123abc', '123abc', fixture);
        expect(component.form.valid).equal(true);
    });
});
