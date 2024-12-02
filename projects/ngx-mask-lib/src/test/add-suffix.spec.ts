import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

describe('Directive: Mask (Add suffix)', () => {
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

    it('should have a suffix', () => {
        component.mask.set('00-000-000-00');
        component.suffix.set('$');
        equal('6', '6$', fixture);
    });

    it('should have a suffix if first letter entered is y', () => {
        component.mask.set('L{80}');
        component.suffix.set('.sh');
        equal('y', 'y.sh', fixture);
    });

    it('should have a suffix if the first character entered same as the last letter of the suffix', () => {
        component.mask.set('L{80}');
        component.suffix.set('.sh');
        equal('h', 'h.sh', fixture);
    });

    it('should display suffix at the end with showMaskTyped mask 0 000', () => {
        component.mask.set('0 000');
        component.suffix.set('$');
        component.showMaskTyped.set(true);
        equal('1', '1 ___$', fixture);
        equal('12', '1 2__$', fixture);
        equal('123', '1 23_$', fixture);
        equal('1234', '1 234$', fixture);
    });
});
