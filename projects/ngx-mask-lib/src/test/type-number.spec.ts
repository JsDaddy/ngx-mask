import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { equal } from './utils/test-functions.component';
import { NgxMaskModule } from 'ngx-mask';

@Component({
    selector: 'jsdaddy-open-source-test',
    template: ` <input id="maska" type="number" [mask]="mask" [formControl]="form" /> `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TestTypeNumber {
    public form: FormControl = new FormControl('');
    public mask = '';
}

describe('Directive: Mask (Trigger on mask change)', () => {
    let fixture: ComponentFixture<TestTypeNumber>;
    let component: TestTypeNumber;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestTypeNumber],
            imports: [ReactiveFormsModule, NgxMaskModule.forRoot()],
        });
        fixture = TestBed.createComponent(TestTypeNumber);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('mask 0* should work with mask 0*', () => {
        component.mask = '0*';

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '12345', fixture);
    });

    it('mask 0000 should work with mask 0000', () => {
        component.mask = '0000';

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12345', '1234', fixture);
    });

    it('mask 0000 should work with mask 0000', () => {
        component.mask = 'percent';

        equal('100', '100', fixture);
        equal('99', '99', fixture);
    });
});
