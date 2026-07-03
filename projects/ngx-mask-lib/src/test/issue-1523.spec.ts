import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal, Paste } from './utils/test-functions.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

// Issue #1523: date masks starting with a 2-digit year (e.g. 00M0d0) broke in 17.x —
// the M0/d0 segments were skipped/zeroed because cursor-anchored day/month
// heuristics read year digits as day/month digits.
describe('Directive: Mask (issue #1523 — year-first date masks without separators)', () => {
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
