import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'jsdaddy-open-source-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: `<input mask="0000" [formControl]="form" />`,
})
class TestMaskComponent {
    public form: FormControl = new FormControl('');
}

@Component({
    selector: 'jsdaddy-phone-test',
    imports: [FormsModule, NgxMaskDirective],
    template: `
        <form #phoneForm="ngForm">
            <input
                name="phoneNumber"
                [(ngModel)]="phoneNumber"
                [pattern]="phoneValidationPattern"
                [dropSpecialCharacters]="false"
                [mask]="phoneMask" />
        </form>
    `,
})
class TestPhoneMaskComponent {
    public phoneValidationPattern =
        /^\(?([2-9][0-8][0-9])\)?[-. ]*([2-9][0-9]{2})[-. ]*([0-9]{4})$/;
    public phoneMask = '(000) 000-0000';
    public phoneNumber = '3333333333';
}

describe('Directive: Forms', () => {
    let fixture: ComponentFixture<TestMaskComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        fixture.detectChanges();
    });

    it('should not mark form as dirty on initial load with initial value', () => {
        const testBed = TestBed.createComponent(TestPhoneMaskComponent);
        const phoneComponent = testBed.componentInstance;
        phoneComponent.phoneNumber = '3333333333';
        testBed.detectChanges();

        // Get the form element and check if it's not dirty
        const formElement = testBed.nativeElement.querySelector('form');
        const inputElement = testBed.nativeElement.querySelector('input');

        // Check that the form is not dirty on initial load
        expect(formElement.classList.contains('ng-dirty')).toBe(false);
        expect(inputElement.classList.contains('ng-dirty')).toBe(false);
    });
});
