import type { Mock } from 'vitest';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { vi, expect } from 'vitest';

@Component({
    selector: 'jsdaddy-open-source-test',
    standalone: true,
    imports: [ReactiveFormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ` <input (maskFilled)="maskFilled()" mask="0000" [formControl]="form" /> `,
})
class TestMaskComponent {
    public form: FormControl = new FormControl('');

    public isMaskFilled = signal<boolean>(false);

    public maskFilled(): void {
        this.isMaskFilled.set(true);
    }
}

describe('Directive: Mask (Function maskFilled)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    let maskFilledSpy: Mock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        maskFilledSpy = vi.spyOn(component, 'maskFilled');
    });

    it('should call function maskFilled and isMaskFilled should be true', () => {
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '9999';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.isMaskFilled()).equal(true);
        expect(maskFilledSpy).toHaveBeenCalledTimes(1);
        expect(maskFilledSpy).toHaveBeenCalledWith();
    });

    it('isMaskFilled should be false', () => {
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '999';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.isMaskFilled()).equal(false);
    });
});
