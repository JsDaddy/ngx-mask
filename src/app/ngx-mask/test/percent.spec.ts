import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from '../ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

describe('Separator: Mask', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskModule.forRoot()],
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

    it('percent with sufix', () => {
        component.mask = 'percent';
        component.sufix = '%';
        equal('50', '50%', fixture);
        equal('123', '12%', fixture);
        equal('50.50', '50.50%', fixture);
    });
});
