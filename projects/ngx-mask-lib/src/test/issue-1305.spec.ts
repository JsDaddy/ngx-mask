import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';

// Issue #1305 (dup #1264): Material's floating label does not float for initial values.
// Root cause: the directive rendered writeValue() through the service's
// `formElementProperty` setter, which defers the DOM write via queueMicrotask. MatInput
// decides emptiness (`shouldLabelFloat`) by reading `nativeElement.value` DURING the
// change-detection pass — a value that only lands in a later microtask is invisible to
// it, so the label stays down until something else (focus/CD) re-checks.
// The contract asserted here: after a writeValue-driven render, the native input value
// must be populated SYNCHRONOUSLY — before any microtask flush — so that consumers
// reading the native value inside the same CD pass (Angular Material, CDK autofill,
// autosize) observe it.
@Component({
    selector: 'jsdaddy-open-source-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: `<input mask="separator.2" thousandSeparator="," [formControl]="control" />`,
})
class InitialSeparatorValueComponent {
    public control = new FormControl(1500);
}

@Component({
    selector: 'jsdaddy-open-source-digit-test',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: `<input mask="0000" [formControl]="control" />`,
})
class InitialDigitValueComponent {
    public control = new FormControl('3333');
}

describe('Directive: Mask (issue #1305 — initial value must render synchronously)', () => {
    it('should render the initial separator value in the same CD pass (no microtask)', () => {
        TestBed.configureTestingModule({
            imports: [InitialSeparatorValueComponent],
            providers: [provideNgxMask()],
        });
        const fixture: ComponentFixture<InitialSeparatorValueComponent> = TestBed.createComponent(
            InitialSeparatorValueComponent
        );
        fixture.detectChanges();

        // Deliberately NO await / whenStable here: Material reads the native value
        // synchronously during this very CD pass.
        const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(el.value).toBe('1,500');
    });

    it('should render the initial digit value in the same CD pass (no microtask)', () => {
        TestBed.configureTestingModule({
            imports: [InitialDigitValueComponent],
            providers: [provideNgxMask()],
        });
        const fixture: ComponentFixture<InitialDigitValueComponent> = TestBed.createComponent(
            InitialDigitValueComponent
        );
        fixture.detectChanges();

        const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(el.value).toBe('3333');
    });

    it('should render a later programmatic setValue synchronously as well', async () => {
        TestBed.configureTestingModule({
            imports: [InitialSeparatorValueComponent],
            providers: [provideNgxMask()],
        });
        const fixture: ComponentFixture<InitialSeparatorValueComponent> = TestBed.createComponent(
            InitialSeparatorValueComponent
        );
        const component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();

        component.control.setValue(2500);
        const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(el.value).toBe('2,500');

        // And the deferred write must not clobber it afterwards.
        await fixture.whenStable();
        fixture.detectChanges();
        expect(el.value).toBe('2,500');
    });
});
