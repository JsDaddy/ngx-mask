import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

describe('Directive: Mask', () => {
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
        component.mask.set('00*.00');
        equal('22222.333333', '22222.33', fixture);
        equal('22212323232', '22212323232', fixture);
    });

    it('custom with symbols Á, á', () => {
        const testPattern = {
            S: { pattern: new RegExp('[A-Za-z-Áá]') },
        };
        component.mask.set('S*');
        component.patterns.set(testPattern);
        equal('Fernándos', 'Fernándos', fixture);
        equal('Ánton', 'Ánton', fixture);
    });
});
