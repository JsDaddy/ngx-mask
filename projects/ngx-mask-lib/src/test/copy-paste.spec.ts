import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { By } from '@angular/platform-browser';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect, vi } from 'vitest';

describe('Event: paste', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('After paste to control cursor should be on the end of input)', () => {
        component.mask.set('00 - 0000 - 00000');
        fixture.detectChanges();

        const inputDebuggerElement = fixture.debugElement.query(By.css('#mask'));

        const pasteData = new DataTransfer();
        pasteData.setData('text', '123456789');
        inputDebuggerElement.triggerEventHandler('paste', pasteData);

        inputDebuggerElement.nativeElement.value = pasteData.getData('text/plain');
        inputDebuggerElement.triggerEventHandler('input', {
            target: inputDebuggerElement.nativeElement,
        });

        fixture.detectChanges();

        expect(inputDebuggerElement.nativeElement.value).equal('12 - 3456 - 789');

        expect(inputDebuggerElement.nativeElement.selectionStart).equal(15);
    });
    it('After paste to control cursor should be on the end of input for mask with separator', () => {
        component.mask.set('separator.0');
        component.thousandSeparator.set(',');
        fixture.detectChanges();

        const inputDebuggerElement = fixture.debugElement.query(By.css('#mask'));

        const pasteData = new DataTransfer();
        pasteData.setData('text', '1234567');
        inputDebuggerElement.triggerEventHandler('paste', pasteData);

        inputDebuggerElement.nativeElement.value = pasteData.getData('text/plain');
        inputDebuggerElement.triggerEventHandler('input', {
            target: inputDebuggerElement.nativeElement,
        });

        fixture.detectChanges();

        expect(inputDebuggerElement.nativeElement.value).equal('1,234,567');

        expect(inputDebuggerElement.nativeElement.selectionStart).equal(9);
    });

    it('should place caret at the end after paste with prefix and separator mask (#1571)', () => {
        component.mask.set('separator.2');
        component.prefix.set('$');
        fixture.detectChanges();

        const inputDebuggerElement = fixture.debugElement.query(By.css('#mask'));
        const inputTarget: HTMLInputElement = inputDebuggerElement.nativeElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);

        const pasteData = new DataTransfer();
        pasteData.setData('text', '123.45');
        inputDebuggerElement.triggerEventHandler('paste', pasteData);
        inputTarget.value = pasteData.getData('text/plain');
        inputTarget.setSelectionRange(inputTarget.value.length, inputTarget.value.length);
        inputDebuggerElement.triggerEventHandler('input', { target: inputTarget });

        fixture.detectChanges();

        expect(inputTarget.value).equal('$123.45');
        expect(inputTarget.selectionStart).equal(7);
    });

    it('should place caret at the end after paste with prefix and separator mask with thousand separator (#1571)', () => {
        component.mask.set('separator.2');
        component.prefix.set('$');
        component.thousandSeparator.set(',');
        fixture.detectChanges();

        const inputDebuggerElement = fixture.debugElement.query(By.css('#mask'));
        const inputTarget: HTMLInputElement = inputDebuggerElement.nativeElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);

        const pasteData = new DataTransfer();
        pasteData.setData('text', '1234.56');
        inputDebuggerElement.triggerEventHandler('paste', pasteData);
        inputTarget.value = pasteData.getData('text/plain');
        inputTarget.setSelectionRange(inputTarget.value.length, inputTarget.value.length);
        inputDebuggerElement.triggerEventHandler('input', { target: inputTarget });

        fixture.detectChanges();

        expect(inputTarget.value).equal('$1,234.56');
        expect(inputTarget.selectionStart).equal(9);
    });
});
