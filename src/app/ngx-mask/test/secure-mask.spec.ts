import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from '../ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

describe('Directive: Mask', () => {
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

    it('it checks secure input functionality ', () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        equal('1234', '***/*', fixture);
        expect(component.form.value).toBe('1234');
        expect(component.ngModelValue).toBe('1234');
    });

    it('it checks secure input functionality ', () => {
        component.mask = 'XXX/XX/0000';
        component.hiddenInput = true;
        equal('123456789', '***/**/6789', fixture);
        expect(component.form.value).toBe('123456789');
        expect(component.ngModelValue).toBe('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask = 'XXX/XX/XXX0';
        component.hiddenInput = true;
        equal('123456789', '***/**/***9', fixture);
        expect(component.form.value).toBe('123456789');
        expect(component.ngModelValue).toBe('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask = 'XXX/XX/XXXX';
        component.hiddenInput = true;
        equal('123456789', '***/**/****', fixture);
        expect(component.form.value).toBe('123456789');
        expect(component.ngModelValue).toBe('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask = '0000-00-XXXX';
        component.hiddenInput = true;
        equal('123456789', '1234-56-***', fixture);
        expect(component.form.value).toBe('123456789');
        expect(component.ngModelValue).toBe('123456789');
    });
});
