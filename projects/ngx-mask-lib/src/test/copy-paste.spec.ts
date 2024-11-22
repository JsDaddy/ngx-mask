import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { By } from '@angular/platform-browser';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

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
        component.mask = '00 - 0000 - 00000';
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

        expect(inputDebuggerElement.nativeElement.value).toBe('12 - 3456 - 789');

        expect(inputDebuggerElement.nativeElement.selectionStart).toBe(15);
    });
    it('After paste to control cursor should be on the end of input for mask with separator', () => {
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
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

        expect(inputDebuggerElement.nativeElement.value).toBe('1,234,567');

        expect(inputDebuggerElement.nativeElement.selectionStart).toBe(9);
    });
});
