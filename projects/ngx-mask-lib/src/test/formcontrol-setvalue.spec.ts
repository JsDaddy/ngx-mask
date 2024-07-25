import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask (formControl.setValue)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    const mask = '(000) 000-0000';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        component.mask = mask;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    // it('(MATCH) should set the native element to the masked value, and set the form control to the unmasked value, which also emits the unmasked value', async () => {
    //     const inputValue = '5555555555';
    //     const expectedFormControlValue = '5555555555';
    //     const expectedEmitedValues = '5555555555';
    //     const expectedNativeElementValue = '(555) 555-5555';
    //     const expectedConsoleWarnings = 0;

    //     const {
    //         actualNativeElementValue,
    //         actualFormControlValue,
    //         actualEmitedValue,
    //         consoleWarningCount,
    //         errors
    //     } = await setValue(inputValue);
        
    //     expect(actualNativeElementValue).toEqual(expectedNativeElementValue);
    //     expect(actualEmitedValue).toEqual(expectedEmitedValues);
    //     expect(actualFormControlValue).toEqual(expectedFormControlValue);
    //     expect(consoleWarningCount).toEqual(expectedConsoleWarnings);
    //     expect(errors).toBeNull();
    // });

    it('(NOT MATCH) should set the native element to the raw value, and set the form control to the raw value, which also emits the raw value, AND log a warning AND have a validation error', async () => {
        const expectedNativeElementValue = 'AAA';
        const expectedFormControlValue = 'AAA';
        const expectedEmitedValue = 'AAA';
        const expectedConsoleWarnings = 1;
        
        const inputValue = 'AAA';
        const {
            actualNativeElementValue,
            actualFormControlValue,
            actualEmitedValue,
            consoleWarningCount,
            errors
        } = await setValue(inputValue);

        expect(actualNativeElementValue).toEqual(expectedNativeElementValue);
        expect(actualEmitedValue).toEqual(expectedEmitedValue);
        expect(actualFormControlValue).toEqual(expectedFormControlValue);
        expect(consoleWarningCount).toEqual(expectedConsoleWarnings);
        expect(errors).not.toBeNull();
    });

    const setValue = async (value: string | number): Promise<{
        actualNativeElementValue: string | number,
        actualFormControlValue: string | number,
        actualEmitedValue: string | null,
        consoleWarningCount: number,
        errors: ValidationErrors | null
    }> => {
        const warnSpy = spyOn(console, 'warn');

        let actualEmitedValue = null;
        component.form.valueChanges.subscribe(emitedValue => {
            actualEmitedValue = emitedValue;
        });
        component.form.setValue(value);
        fixture.detectChanges();
        await fixture.whenStable();

        const actualNativeElementValue = fixture.debugElement.query(By.css('input')).nativeElement.value;
        const actualFormControlValue = component.form.getRawValue();
        const consoleWarningCount = warnSpy.calls.count();
        const errors = component.form.errors;
        return {
            actualNativeElementValue,
            actualFormControlValue,
            actualEmitedValue,
            consoleWarningCount,
            errors
        }
    }
});
