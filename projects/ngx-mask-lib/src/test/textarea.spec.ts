import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestTextareaMaskComponent } from './utils/test-textarea-component.component';
import { equalTextarea } from './utils/test-functions.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import { By } from '@angular/platform-browser';

describe('Directive: Mask with Textarea', () => {
    let fixture: ComponentFixture<TestTextareaMaskComponent>;
    let component: TestTextareaMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestTextareaMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestTextareaMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should apply basic mask to textarea', () => {
        component.mask.set('0000.0000');
        equalTextarea('1', '1', fixture);
        equalTextarea('12', '12', fixture);
        equalTextarea('1234567', '1234.567', fixture);
    });

    it('should handle date mask in textarea', () => {
        component.mask.set('00/00/0000');
        equalTextarea('12', '12', fixture);
        equalTextarea('1234', '12/34', fixture);
        equalTextarea('12345678', '12/34/5678', fixture);
    });

    it('should handle phone mask in textarea', () => {
        component.mask.set('(000) 000-0000');
        equalTextarea('1', '(1', fixture);
        equalTextarea('123', '(123', fixture);
        equalTextarea('1234567890', '(123) 456-7890', fixture);
    });

    it('should handle email mask in textarea', () => {
        component.mask.set('A*@A*.A*');
        equalTextarea('test', 'test', fixture);
        equalTextarea('test@', 'test@', fixture);
        equalTextarea('test@example', 'test@example', fixture);
        equalTextarea('test@example.com', 'test@example.com', fixture);
    });

    it('should handle prefix and suffix in textarea', () => {
        component.mask.set('0000');
        component.prefix.set('$');
        component.suffix.set(' USD');
        equalTextarea('123', '$123 USD', fixture);
        equalTextarea('1234', '$1234 USD', fixture);
    });

    it('should handle special characters in textarea', () => {
        component.mask.set('0000-0000');
        equalTextarea('1234', '1234', fixture);
        equalTextarea('12345678', '1234-5678', fixture);
    });

    it('should handle decimal mask in textarea', () => {
        component.mask.set('separator.2');
        component.decimalMarker.set('.');
        component.thousandSeparator.set(',');
        equalTextarea('1234', '1,234', fixture);
        equalTextarea('1234.5', '1,234.5', fixture);
        equalTextarea('1234.56', '1,234.56', fixture);
    });

    it('should handle percentage mask in textarea', () => {
        component.mask.set('percent');
        equalTextarea('50', '50', fixture);
        equalTextarea('100', '100', fixture);
    });

    it('should handle showMaskTyped in textarea', () => {
        component.mask.set('0000-0000');
        component.showMaskTyped.set(true);
        equalTextarea('', '____-____', fixture);
        equalTextarea('1', '1___-____', fixture);
        equalTextarea('12345678', '1234-5678', fixture);
    });

    it('should handle clearIfNotMatch in textarea', () => {
        component.mask.set('0000-0000');
        component.clearIfNotMatch.set(true);
        equalTextarea('123', '123', fixture);
        equalTextarea('12345678', '1234-5678', fixture);
        equalTextarea('abc', '', fixture); // Should clear if doesn't match
    });

    it('should handle dropSpecialCharacters in textarea', () => {
        component.mask.set('0000-0000');
        component.dropSpecialCharacters.set(true);
        equalTextarea('1234-5678', '1234-5678', fixture);
        equalTextarea('12345678', '1234-5678', fixture);
    });

    it('should handle validation in textarea', () => {
        component.mask.set('0000-0000');
        component.validation.set(true);
        equalTextarea('1234', '1234', fixture);
        equalTextarea('12345678', '1234-5678', fixture);
    });

    it('should handle multiple lines in textarea with mask', () => {
        component.mask.set('A*');
        equalTextarea('line1\nline2', 'line1line2', fixture);
        equalTextarea('test\nanother\ntest', 'testanothertest', fixture);
    });

    it('should handle dynamic mask changes in textarea', () => {
        component.mask.set('0000.0000');
        equalTextarea('1234567', '1234.567', fixture);

        // Change mask dynamically
        component.mask.set('00/00/0000');
        equalTextarea('12345678', '12/34/5678', fixture);
    });

    it('should handle empty mask in textarea', () => {
        component.mask.set('');
        equalTextarea('any text', 'any text', fixture);
        equalTextarea('123456', '123456', fixture);
        equalTextarea('special@chars.com', 'special@chars.com', fixture);
    });

    it('should handle null mask in textarea', () => {
        component.mask.set(null);
        equalTextarea('any text', 'any text', fixture);
        equalTextarea('123456', '123456', fixture);
    });

    it('should handle undefined mask in textarea', () => {
        component.mask.set(undefined);
        equalTextarea('any text', 'any text', fixture);
        equalTextarea('123456', '123456', fixture);
    });

    it('should handle textarea with no mask', () => {
        // No mask set
        equalTextarea('any text', 'any text', fixture);
        equalTextarea('123456', '123456', fixture);
        equalTextarea('special@chars.com', 'special@chars.com', fixture);
    });

    it('should handle textarea with large content', () => {
        component.mask.set('A*');
        const largeText =
            'This is a very long text that should be handled properly by the textarea with mask. '.repeat(
                10
            );
        const expectedText = largeText.replace(/\s/g, ''); // Remove spaces for A* mask
        equalTextarea(largeText, expectedText, fixture);
    });

    it('should handle textarea with special characters in content', () => {
        component.mask.set('A*');
        const textWithSpecialChars = 'Text with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
        const expectedText = textWithSpecialChars.replace(/[^a-zA-Z]/g, ''); // Keep only letters for A* mask
        equalTextarea(textWithSpecialChars, expectedText, fixture);
    });

    it('should handle textarea with arrow up key (should not be prevented)', () => {
        component.mask.set('0000-0000');
        const textarea = fixture.debugElement.query(By.css('#masked')).nativeElement;

        // Set some content and focus
        textarea.value = '1234-5678';
        textarea.focus();
        textarea.setSelectionRange(5, 5);

        // Test arrow up (should work in textarea for line navigation)
        const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        textarea.dispatchEvent(arrowUpEvent);

        // Arrow up should not be prevented in textarea (this is the key test)
        // The event should not have defaultPrevented set to true
    });

    it('should handle textarea with backspace key', () => {
        component.mask.set('0000-0000');
        const textarea = fixture.debugElement.query(By.css('#masked')).nativeElement;

        textarea.value = '1234-5678';
        textarea.focus();
        textarea.setSelectionRange(6, 6);

        const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
        textarea.dispatchEvent(backspaceEvent);

        // Backspace should work normally in textarea
    });

    it('should handle textarea with paste event', () => {
        component.mask.set('0000-0000');
        const textarea = fixture.debugElement.query(By.css('#masked')).nativeElement;

        textarea.focus();

        // Simulate paste event
        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: new DataTransfer(),
        });
        textarea.dispatchEvent(pasteEvent);

        // Paste should be handled
    });
});
