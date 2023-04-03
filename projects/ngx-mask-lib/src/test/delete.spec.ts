import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
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
            keyCode: 8,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        equal(inputTarget.value, '***/*5/6789', fixture);
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
            keyCode: 46,
            target: inputTarget,
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });

        expect(inputTarget.selectionStart).toEqual(3);

        inputTarget.selectionStart = 4;
        inputTarget.selectionEnd = 4;

        debugElement.triggerEventHandler('keydown', {
            code: 'Backspace',
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
            keyCode: 8,
            target: inputTarget,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            preventDefault: () => {},
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
            keyCode: 8,
            target: inputTarget,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            preventDefault: () => {},
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
            keyCode: 8,
            target: inputTarget,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            preventDefault: () => {},
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
            keyCode: 8,
            target: inputTarget,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            preventDefault: () => {},
        });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.selectionStart).toEqual(3);
    });
});
