import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'jsdaddy-open-source-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: `<input mask="0000" [formControl]="form" />`,
})
class TestMaskComponent {
    public form: FormControl = new FormControl('');
}

describe('Directive: Forms', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should propagate masked value to the form control value', () => {
        component.form.setValue('A1234Z');
        expect(component.form.value).toBe('1234');
    });

    it('should propagate masked value to the form control valueChanges observable', () => {
        component.form.valueChanges.subscribe((newValue) => {
            expect(newValue).toEqual('1234');
        });

        component.form.setValue('A1234Z');
    });
});
