import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { typeTest } from './utils/test-functions.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import { expect, vi } from 'vitest';

// Issue #1250: typing a decimal marker when the value already contains one must be
// rejected as a no-op (value unchanged, caret back where it was) instead of
// re-parsing the value around the new marker and mangling it (15.000,53 -> 1,5).
describe('Directive: Mask (issue #1250 duplicate decimal marker)', () => {
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

    function insertCharAt(postEditValue: string, caretAfterInsert: number): HTMLInputElement {
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = postEditValue;
        inputTarget.selectionStart = caretAfterInsert;
        inputTarget.selectionEnd = caretAfterInsert;
        debugElement.triggerEventHandler('input', { target: inputTarget });
        return inputTarget;
    }

    it('should reject a second decimal marker typed mid-integer (issue #1250 repro)', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        typeTest('15000,53', fixture);
        // displayed 15.000,53 — user types ',' between '1' and '5'
        const inputTarget = insertCharAt('1,5.000,53', 2);

        expect(inputTarget.value).equal('15.000,53');
        expect(inputTarget.selectionStart).equal(1);
    });

    it('should reject a second decimal marker typed inside the decimal part', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        typeTest('15000,53', fixture);
        // displayed 15.000,53 — user types ',' between '5' and '3'
        const inputTarget = insertCharAt('15.000,5,3', 9);

        expect(inputTarget.value).equal('15.000,53');
        expect(inputTarget.selectionStart).equal(8);
    });

    it('should reject a second decimal marker typed at the start of the value', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        typeTest('15000,53', fixture);
        // displayed 15.000,53 — user types ',' before '1'
        const inputTarget = insertCharAt(',15.000,53', 1);

        expect(inputTarget.value).equal('15.000,53');
        expect(inputTarget.selectionStart).equal(0);
    });

    it('should reject a second decimal marker typed at the end of the value', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        typeTest('15000,53', fixture);
        // displayed 15.000,53 — user types ',' after '3'
        const inputTarget = insertCharAt('15.000,53,', 10);

        expect(inputTarget.value).equal('15.000,53');
        expect(inputTarget.selectionStart).equal(9);
    });

    it('should reject a different marker char with array decimalMarker config', () => {
        component.mask.set('separator.2');
        // default thousandSeparator is a space, default decimalMarker is ['.', ',']
        typeTest('1234.56', fixture);
        // displayed 1 234.56 — user types ',' between '2' and '3'
        const inputTarget = insertCharAt('1 2,34.56', 4);

        expect(inputTarget.value).equal('1 234.56');
        expect(inputTarget.selectionStart).equal(3);
    });

    it('should still accept the first decimal marker typed mid-value', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        typeTest('15000', fixture);
        // displayed 15.000 — user types ',' between the two zeros: 15.00,0
        const inputTarget = insertCharAt('15.00,0', 6);

        expect(inputTarget.value).equal('1.500,0');
    });
});
