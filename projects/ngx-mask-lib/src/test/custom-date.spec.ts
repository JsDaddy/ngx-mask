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
});
