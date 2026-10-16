import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { expect } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

// A letter used as a special character must be matched literally when the click handler skips the
// leading special characters. Interpolated unescaped (`\w`, `\s`, `\d`) it became a character
// class and swallowed the digit placeholders as well.
describe('Click caret with a letter as special character', () => {
    let fixture: ComponentFixture<TestMaskComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        fixture.detectChanges();
    });

    it.each(['w', 's'])('places the caret after the leading "%s-" on click at 0', (letter) => {
        fixture.componentInstance.mask.set(`${letter}-000`);
        fixture.componentInstance.specialCharacters.set(['-', letter]);
        fixture.detectChanges();
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.value = `${letter}-123`;
        input.setSelectionRange(0, 0);
        fixture.debugElement
            .query(By.css('input'))
            .triggerEventHandler('click', { target: input } as unknown as Event);

        expect(input.selectionStart).toBe(2);
    });
});
