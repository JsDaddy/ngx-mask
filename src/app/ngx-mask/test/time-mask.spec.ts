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

    it('empty', () => {
        component.mask = 'Hh:m0:s0';
        equal('', '', fixture);
    });

    it('Hours', () => {
        component.mask = 'Hh:m0:s0';
        equal('20', '20', fixture);
    });

    it('Hours', () => {
        component.mask = 'Hh:m0:s0';
        equal('03', '03', fixture);
    });

    it('Hours', () => {
        component.mask = 'Hh:m0:s0';
        equal('730', '7:30', fixture);
    });

    it('Minutes', () => {
        component.mask = 'Hh:m0:s0';
        equal('1212', '12:12', fixture);
    });

    it('Minutes', () => {
        component.mask = 'Hh:m0:s0';
        equal('1207', '12:07', fixture);
    });
    it('Minutes', () => {
        component.mask = 'Hh:m0:s0';
        equal('127', '12:7', fixture);
    });
    it('Hours and minutes', () => {
        component.mask = 'Hh:m0:s0';
        equal('7712', '7:7:12', fixture);
    });
    // it('Date', () => {
    //     component.mask = 'd0/M0/0000';
    //     equal('321234', '3/2/1234', fixture);
    // });
    it('Date', () => {
        component.mask = 'd0/M0/0000';
        equal('3113123', '31/1/3123', fixture);
    });
    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('413234', '4/1/3234', fixture);
    });
    // it('Date ', () => {
    //     component.mask = 'd0/M0/0000';
    //     equal('4121234', '4/12/1234', fixture);
    // });
    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('01011234', '01/01/1234', fixture);
    });
    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('10101234', '10/10/1234', fixture);
    });
    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('2222123', '22/2/2123', fixture);
    });
    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('0314123', '03/1/4123', fixture);
    });
});
