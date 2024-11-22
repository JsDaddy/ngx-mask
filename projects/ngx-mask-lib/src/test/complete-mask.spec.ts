import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

@Component({
    selector: 'jsdaddy-open-source-test',
    standalone: true,
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: ` <input (maskFilled)="maskFilled()" mask="0000" [formControl]="form" /> `,
})
class TestMaskComponent {
    public form: FormControl = new FormControl('');

    public isMaskFilled = false;

    public maskFilled(): void {
        this.isMaskFilled = true;
    }
}

describe('Directive: Mask (Function maskFilled)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    let maskFilledSpy: jasmine.Spy<jasmine.Func>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        maskFilledSpy = spyOn(component, 'maskFilled').and.callThrough();
    });
    it('should call function maskFilled and isMaskFilled should be true', () => {
        component.form.setValue('9999');
        expect(component.isMaskFilled).toBeTrue();
        expect(maskFilledSpy).toHaveBeenCalledOnceWith();
    });
    it('isMaskFilled should be false', () => {
        component.form.setValue('999');
        expect(component.isMaskFilled).toBeFalse();
    });
});
