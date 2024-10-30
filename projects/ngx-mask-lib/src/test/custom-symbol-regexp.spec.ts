import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask', () => {
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
        component.mask = '00*.00';
        equal('22222.333333', '22222.33', fixture);
        equal('22212323232', '22212323232', fixture);
    });

    it('custom with symbols Á, á', () => {
        const testPattern = {
            S: { pattern: new RegExp('[A-Za-z-Áá]') },
        };
        component.mask = 'S*';
        component.patterns = testPattern;
        equal('Fernándos', 'Fernándos', fixture);
        equal('Ánton', 'Ánton', fixture);
    });
});
