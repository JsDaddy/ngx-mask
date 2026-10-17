import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal, Paste } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';

describe('Directive: Mask (Custom date)', () => {
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

    it('repeat mask', () => {
        component.mask.set('d0/m0/0000');

        equal('18', '18', fixture);
        equal('11111111', '11/11/1111', fixture);
    });

    // Issue #1611: pasted/pre-populated dates were misparsed with month-first masks
    // ('01071941' -> '01/0/7194') because the day-validity window was sliced by the
    // mask cursor instead of the input index. Typing was unaffected.
    it('should parse pasted date with M0/d0/0000 mask (issue #1611)', () => {
        component.mask.set('M0/d0/0000');

        equal('01071941', '01/07/1941', fixture, false, Paste);
        equal('12251999', '12/25/1999', fixture, false, Paste);
    });

    it('should parse typed date with M0/d0/0000 mask (issue #1611)', () => {
        component.mask.set('M0/d0/0000');

        equal('01071941', '01/07/1941', fixture);
        equal('12251999', '12/25/1999', fixture);
    });

    it('should parse pasted date with d0/M0/0000 mask (issue #1611)', () => {
        component.mask.set('d0/M0/0000');

        equal('01071941', '01/07/1941', fixture, false, Paste);
        equal('25121999', '25/12/1999', fixture, false, Paste);
    });

    it('should parse pasted date with M0/d0 mask (issue #1611)', () => {
        component.mask.set('M0/d0');

        equal('0107', '01/07', fixture, false, Paste);
        equal('1225', '12/25', fixture, false, Paste);
    });

    it('should parse pre-populated (writeValue) date with M0/d0/0000 mask (issue #1611)', async () => {
        component.mask.set('M0/d0/0000');
        fixture.detectChanges();

        component.form.setValue('01071941');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('input').value).equal('01/07/1941');
    });

    // A pasted bare digit string runs behind the mask cursor by every separator the mask emits,
    // so the month window of year-first masks read the day digits ('20231215' -> '2023.1.21').
    // Typing was unaffected.
    it('should parse pasted date with year-first masks 0000.M0.d0 / 0000-M0-d0', () => {
        component.mask.set('0000.M0.d0');
        equal('20231215', '2023.12.15', fixture, false, Paste);
        equal('20240131', '2024.01.31', fixture, false, Paste);
        equal('20250712', '2025.07.12', fixture, false, Paste);

        component.mask.set('0000-M0-d0');
        equal('20231215', '2023-12-15', fixture, false, Paste);
        equal('20231115', '2023-11-15', fixture, false, Paste);
    });

    it('should parse typed date with year-first masks 0000.M0.d0 / 0000-M0-d0', () => {
        component.mask.set('0000.M0.d0');
        equal('20231215', '2023.12.15', fixture);

        component.mask.set('0000-M0-d0');
        equal('20231215', '2023-12-15', fixture);
    });

    it('should parse a pasted year-first date that already carries its separators', () => {
        component.mask.set('0000.M0.d0');
        equal('2023.12.15', '2023.12.15', fixture, false, Paste);
    });

    it('should treat one multi-character insertText edit as a paste', () => {
        component.mask.set('0000.M0.d0');
        fixture.detectChanges();
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.value = '20231215';
        input.setSelectionRange(8, 8);
        input.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: '20231215' }));
        fixture.detectChanges();

        expect(input.value).equal('2023.12.15');
    });

    it('should parse pre-populated (writeValue) date with a year-first mask', async () => {
        component.mask.set('0000.M0.d0');
        fixture.detectChanges();

        component.form.setValue('20231215');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('input').value).equal('2023.12.15');
    });

    it('should keep the cursor position after deleting a character', () => {
        // Set the initial input value and trigger an input event
        const inputElement = fixture.nativeElement.querySelector('input');
        component.mask.set('Hh:m0:s0');
        inputElement.value = '12:34:56';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(3, 3);

        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
        fixture.detectChanges();

        expect(inputElement.selectionStart).equal(3);
    });

    // Issue #1523: date masks starting with a 2-digit year (e.g. 00M0d0) broke in 17.x —
    // the M0/d0 segments were skipped/zeroed because cursor-anchored day/month
    // heuristics read year digits as day/month digits.
    describe('year-first date masks without separators (#1523)', () => {
        it('00M0d0 typing valid dates', () => {
            component.mask.set('00M0d0');
            equal('250712', '250712', fixture);
            equal('991231', '991231', fixture);
            equal('000101', '000101', fixture);
            equal('501215', '501215', fixture);
        });

        it('00M0d0 pasting valid dates', () => {
            component.mask.set('00M0d0');
            equal('250712', '250712', fixture, false, Paste);
            equal('991231', '991231', fixture, false, Paste);
        });

        it('00/M0/d0 typing valid dates', () => {
            component.mask.set('00/M0/d0');
            equal('250712', '25/07/12', fixture);
            equal('991231', '99/12/31', fixture);
        });

        it('0000M0d0 typing valid dates (4-digit year control)', () => {
            component.mask.set('0000M0d0');
            equal('20250712', '20250712', fixture);
            equal('19991231', '19991231', fixture);
        });

        it('00M0d0 with leadZeroDateTime', () => {
            component.leadZeroDateTime.set(true);
            component.mask.set('00M0d0');
            equal('250712', '250712', fixture);
        });
    });
});
