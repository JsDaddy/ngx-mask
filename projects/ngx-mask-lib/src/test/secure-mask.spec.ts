import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal, typeTest, pasteTest } from './utils/test-functions.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import type { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { expect, vi } from 'vitest';

describe('Directive: Mask (Secure)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    // Simulates a real browser backspace: keydown fires with the caret at its
    // pre-deletion position, then the value is mutated and the input event fires.
    function backspaceAt(caret: number, debugElement: DebugElement): void {
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        inputTarget.setSelectionRange(caret, caret);
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        inputTarget.value = inputTarget.value.slice(0, caret - 1) + inputTarget.value.slice(caret);
        inputTarget.setSelectionRange(caret - 1, caret - 1);
        debugElement.triggerEventHandler('input', { target: inputTarget });
        fixture.detectChanges();
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('it checks secure input functionality ', () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        equal('1234', '***/*', fixture);
        expect(component.form.value).equal('1234');
    });

    it('backspace with custom patterns symbol should delete one character at length 2 (#1612)', () => {
        component.mask.set('000-00-0000');
        component.patterns.set({ '0': { pattern: /\d/, symbol: '*' } });
        component.hiddenInput.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        typeTest('12', fixture);
        expect(inputTarget.value).equal('**');

        backspaceAt(2, debugElement);
        expect(inputTarget.value).equal('*');
        expect(component.form.value).equal('1');
    });

    it('backspace with custom patterns symbol should delete one character at each step (#1612)', () => {
        component.mask.set('000-00-0000');
        component.patterns.set({ '0': { pattern: /\d/, symbol: '*' } });
        component.hiddenInput.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        typeTest('123', fixture);
        expect(inputTarget.value).equal('***');

        backspaceAt(3, debugElement);
        expect(inputTarget.value).equal('**');
        expect(component.form.value).equal('12');

        backspaceAt(2, debugElement);
        expect(inputTarget.value).equal('*');
        expect(component.form.value).equal('1');
    });

    it('backspace mid-value with custom patterns symbol should delete the hidden character at the caret (#1612)', () => {
        component.mask.set('000-00-0000');
        component.patterns.set({ '0': { pattern: /\d/, symbol: '*' } });
        component.hiddenInput.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        typeTest('123', fixture);
        expect(inputTarget.value).equal('***');

        backspaceAt(2, debugElement);
        expect(inputTarget.value).equal('**');
        expect(component.form.value).equal('13');
    });

    it('backspace with default secure mask should delete one character at length 2 (#1612)', () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        typeTest('12', fixture);
        expect(inputTarget.value).equal('**');

        backspaceAt(2, debugElement);
        expect(inputTarget.value).equal('*');
        expect(component.form.value).equal('1');
    });

    it('it checks secure input functionality ', () => {
        component.mask.set('XXX/XX/0000');
        component.hiddenInput.set(true);
        equal('123456789', '***/**/6789', fixture);
        expect(component.form.value).equal('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask.set('XXX/XX/XXX0');
        component.hiddenInput.set(true);
        equal('123456789', '***/**/***9', fixture);
        expect(component.form.value).equal('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask.set('XXX/XX/XXXX');
        component.hiddenInput.set(true);
        equal('123456789', '***/**/****', fixture);
        expect(component.form.value).equal('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask.set('0000-00-XXXX');
        component.hiddenInput.set(true);
        equal('123456789', '1234-56-***', fixture);
        expect(component.form.value).equal('123456789');
    });

    it('it checks secure input functionality ', () => {
        component.mask.set('0000-X0-XXXX');
        component.hiddenInput.set(true);
        equal('123456789', '1234-*6-***', fixture);
        expect(component.form.value).equal('123456789');
    });

    it('it checks secure input functionality on reset', () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        typeTest('54321', fixture);
        component.form.reset();

        component.form.setValue('98765');
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).equal('***/*5');
        });
    });

    it('it checks secure input functionality on reset then typed', () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        typeTest('54321', fixture);
        component.form.reset();
        equal('98765', '***/*5', fixture);
    });

    it('it checks secure input functionality on setValue(longer string)', () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        typeTest('54321', fixture);
        component.form.reset();

        component.form.setValue('1234567');
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).equal('***/*5/67');
        });
    });

    it('should be same form state (pristine) after mask change triggerOnMaskChange = true', async () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        component.triggerOnMaskChange.set(true);
        component.form.reset('123456789');
        fixture.detectChanges();
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        component.mask.set('000/00/0000');
        fixture.detectChanges();
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        return fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).equal('123/45/6789');
        });
    });

    it('should be same form state (dirty) after mask change', () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        component.form.reset('123456789');
        component.form.markAsDirty();
        component.form.markAsTouched();
        fixture.detectChanges();
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        component.mask.set('000/00/0000');
        fixture.detectChanges();
        expect(component.form.dirty).toBeTruthy();
        expect(component.form.pristine).toBeFalsy();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).equal('123/45/6789');
        });
    });

    it('should not keep shadow copy when form reset', () => {
        component.hiddenInput.set(true);
        component.mask.set('XXX/X0/0000');
        equal('54321', '***/*1', fixture);
        pasteTest('1', fixture);
        expect(component.form.value).equal('1');
        component.form.reset();
        expect(component.form.value).equal(null);
        equal('2', '*', fixture);
        expect(component.form.value).equal('2');
    });

    it('mask changes should work with null input', () => {
        component.hiddenInput.set(true);
        component.mask.set('000/00/0000');
        equal('987654321', '987/65/4321', fixture);
        component.form.reset();
        component.mask.set('XXX/X0/0000');
        equal('54321', '***/*1', fixture);
        expect(component.form.value).equal('54321');
    });

    it('it checks secure input functionality on reset then typed', () => {
        component.mask.set('XXX/X0/0000');
        component.hiddenInput.set(true);
        component.showMaskTyped.set(true);
        equal('98765', '***/*5/____', fixture);
        equal('1234', '***/*_/____', fixture);
        equal('', '___/__/____', fixture);
    });

    it('should select text in input and paste new value', async () => {
        const inputValue = '111111';
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#mask');
        inputElement.value = '000000';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(0, inputElement.value.length);
        inputElement.dispatchEvent(new MouseEvent('dblclick'));
        fixture.detectChanges();
        inputElement.value = inputValue;
        inputElement.dispatchEvent(new Event('input'));
        inputElement.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.form.value).equal(inputValue);
    });

    it('hideInput with showMaskTyped mask=XXXX', () => {
        component.mask.set('XXXX');
        component.hiddenInput.set(true);
        component.showMaskTyped.set(true);
        equal('1', '*___', fixture);
        equal('12', '**__', fixture);
        equal('123', '***_', fixture);
        equal('1234', '****', fixture);
    });

    it('hideInput with showMaskTyped mask=XX-XX', () => {
        component.mask.set('XX-XX');
        component.hiddenInput.set(true);
        component.showMaskTyped.set(true);

        equal('1234', '**-**', fixture);
    });

    it('change hiddenInput to false ', async () => {
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();
        component.mask.set('XXX-XX-XXXX');
        component.hiddenInput.set(true);
        equal('1234', '***-*', fixture);
        fixture.detectChanges();
        component.hiddenInput.set(false);
        equal(inputTarget.value, '123-4', fixture, true);
    });

    it('change hiddenInput to false ', async () => {
        const debug: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debug.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();
        component.mask.set('XXX-XX-XXXX');
        component.hiddenInput.set(true);
        equal('123456', '***-**-*', fixture);
        fixture.detectChanges();
        component.hiddenInput.set(false);
        equal(inputTarget.value, '123-45-6', fixture, true);
    });

    it('it checks secure input functionality for date mask d0/M0/0000 (partial conceal, #1574)', () => {
        component.mask.set('d0/M0/0000');
        component.hiddenInput.set(true);
        equal('01052024', '**/**/2024', fixture);
        expect(component.form.value).equal('01052024');
    });

    it('it checks secure input functionality for date mask d0/M0/XXXX (full conceal, #1574)', () => {
        component.mask.set('d0/M0/XXXX');
        component.hiddenInput.set(true);
        equal('01052024', '**/**/****', fixture);
        expect(component.form.value).equal('01052024');
    });

    it('conceals the leadZero-corrected day/month, not just the typed digit (#1574)', () => {
        component.mask.set('d0/M0/0000');
        component.hiddenInput.set(true);
        component.leadZeroDateTime.set(true);
        equal('332024', '**/**/2024', fixture);
        expect(component.form.value).equal('03032024');
    });

    it('change hiddenInput to false when mask is full', async () => {
        const debug: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debug.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();
        component.mask.set('XXX/XX/XXXX');
        component.hiddenInput.set(true);
        equal('123456789', '***/**/****', fixture);
        expect(component.form.value).equal('123456789');
        component.hiddenInput.set(false);
        fixture.detectChanges();
        return fixture.whenStable().then(() => {
            expect(inputTarget.value).equal('123/45/6789');
            expect(component.form.value).equal('123456789');
        });
    });
});
