import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';
import { provideNgxMask } from '../lib/ngx-mask.providers';

describe('Directive: Mask (Delete)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('delete character in input', () => {
        component.mask = '00/00/0000';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '2/34/5678';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('23/45/678');
        expect(inputTarget.selectionStart).toEqual(1);
    });

    it('delete special character in input', () => {
        component.mask = '00/00/0000';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '12/34/5678';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.value).toBe('12/34/5678');
        expect(inputTarget.selectionStart).toEqual(2);
    });

    it('delete special character in secure input', () => {
        component.mask = 'XXX/X0/0000';
        component.hiddenInput = true;
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '123/45/6789';
        inputTarget.selectionStart = 7;
        inputTarget.selectionEnd = 7;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        debugElement.triggerEventHandler('ngModelChange', { target: inputTarget });

        expect(inputTarget.value).toEqual('***/*5/6789');
        expect(inputTarget.selectionStart).toEqual(6);
    });

    it('delete special character on 1 position', () => {
        component.mask = '[00]';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '[12]';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.selectionStart).toEqual(1);
    });

    it('delete suffix with backspace and delete', () => {
        component.mask = 'A{5}';
        component.suffix = '.com';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '123.com';
        inputTarget.selectionStart = 4;
        inputTarget.selectionEnd = 4;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 46,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.selectionStart).toEqual(3);

        inputTarget.selectionStart = 4;
        inputTarget.selectionEnd = 4;

        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.selectionStart).toEqual(3);
    });

    it('prefix shouldn`t be deleted', () => {
        component.mask = '00 00';
        component.prefix = '+1';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '+100 00';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,

            preventDefault: () => {
                void 0;
            },
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).toEqual(2);
    });

    it('prefix shouldn`t be deleted', () => {
        component.mask = '00 00';
        component.prefix = '+1 ';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '+1 00 00';
        inputTarget.selectionStart = 1;
        inputTarget.selectionEnd = 1;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,

            preventDefault: () => {
                void 0;
            },
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).toEqual(3);
    });

    it('prefix shouldn`t be deleted', () => {
        component.mask = '(00) 00';
        component.prefix = '+1';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '+1(00) 00';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,

            preventDefault: () => {
                void 0;
            },
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).toEqual(2);
    });

    it('prefix shouldn`t be deleted', () => {
        component.mask = '(00) 00';
        component.prefix = '+1 ';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '+1 (00) 00';
        inputTarget.selectionStart = 4;
        inputTarget.selectionEnd = 4;
        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            target: inputTarget,

            preventDefault: () => {
                void 0;
            },
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).toEqual(3);
    });

    it('date mask should show keep right value d0/M0/0000', () => {
        component.mask = 'd0/M0/0000';
        const inputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '4/4/4444';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(8, 8);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4/4/444';
        inputElement.setSelectionRange(7, 7);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4/4/44';
        inputElement.setSelectionRange(6, 6);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4/4/4';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).toBe('4/4/4');
    });

    it('date mask should show keep right value d0:M0:0000', () => {
        component.mask = 'd0:M0:0000';
        const inputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '4:4:4444';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(8, 8);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4:4:444';
        inputElement.setSelectionRange(7, 7);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4:4:44';
        inputElement.setSelectionRange(6, 6);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4:4:4';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).toBe('4:4:4');
    });

    it('date mask should show keep right value d0-M0-0000', () => {
        component.mask = 'd0-M0-0000';
        const inputElement = fixture.nativeElement.querySelector('input');

        inputElement.value = '4-4-4444';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(8, 8);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4-4-444';
        inputElement.setSelectionRange(7, 7);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4-4-44';
        inputElement.setSelectionRange(6, 6);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        inputElement.value = '4-4-4';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(inputElement.value).toBe('4-4-4');
    });
});
