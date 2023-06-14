import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask (Percent)', () => {
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

    it('percent for empty', () => {
        component.mask = 'percent';
        equal('', '', fixture);
    });

    it('percent for 100', () => {
        component.mask = 'percent';
        equal('100', '100', fixture);
    });

    it('percent for 99', () => {
        component.mask = 'percent';
        equal('99', '99', fixture);
    });

    it('percent for 123', () => {
        component.mask = 'percent';
        equal('123', '12', fixture);
    });

    it('percent for 99.99', () => {
        component.mask = 'percent';
        equal('99.99', '99.99', fixture);
    });

    it('percent for 99', () => {
        component.mask = 'percent.0';
        equal('99.99999', '99', fixture);
    });

    it('percent for 99.99', () => {
        component.mask = 'percent.2';
        equal('99.9999', '99.99', fixture);
    });

    it('percent for 1.123', () => {
        component.mask = 'percent.3';
        equal('1.12345', '1.123', fixture);
    });

    it('percent for 123.23', () => {
        component.mask = 'percent';
        equal('123.23', '12.23', fixture);
    });

    it('percent with suffix', () => {
        component.mask = 'percent';
        component.suffix = '%';
        equal('50', '50%', fixture);
        equal('123', '12%', fixture);
        equal('50.50', '50.50%', fixture);
    });

    it('percent for split zero percent.2', () => {
        component.mask = 'percent.2';
        equal('01.23', '1.23', fixture);
        equal('012.23', '12.23', fixture);
        equal('099.23', '99.23', fixture);
        equal('0999.23', '99.23', fixture);
        equal('034.023', '34.02', fixture);
    });

    it('percent for split zero percent', () => {
        component.mask = 'percent';
        equal('01.23', '1.23', fixture);
        equal('012.23', '12.23', fixture);
        equal('099.23', '99.23', fixture);
        equal('0999.23', '99.23', fixture);
        equal('034.023', '34.023', fixture);
    });

    it('percent for split zero percent.3', () => {
        component.mask = 'percent.3';
        equal('01.233', '1.233', fixture);
        equal('012.232', '12.232', fixture);
        equal('099.230', '99.230', fixture);
        equal('0999.000', '99.000', fixture);
        equal('034.023', '34.023', fixture);
    });
});
