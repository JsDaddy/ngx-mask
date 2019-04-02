import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from '../ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core/src/debug/debug_node';

describe('Separator: Mask', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskModule.forRoot()]
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('separator for empty', () => {
        component.mask = 'separator';
        equal('', '', fixture);
    });

    it('separator for 100', () => {
        component.mask = 'separator';
        equal('100', '100', fixture);
    });

    it('separator for 1000', () => {
        component.mask = 'separator';
        equal('1000', '1 000', fixture);
    });

    it('separator for 10000', () => {
        component.mask = 'separator';
        equal('10000', '10 000', fixture);
    });

    it('separator for 100000', () => {
        component.mask = 'separator';
        equal('100000', '100 000', fixture);
    });

    it('separator for 1000000', () => {
        component.mask = 'separator';
        equal('1000000', '1 000 000', fixture);
    });

    it('separator for letters', () => {
        component.mask = 'separator';
        equal('a', '', fixture);
        equal('1a', '1', fixture);
        equal('1000a', '1 000', fixture);
        equal('1000/', '1 000', fixture);
    });

    it('dot_separator for 1000000', () => {
        component.mask = 'dot_separator';
        equal('1000000', '1.000.000', fixture);
    });

    it('dot_separator precision 2 for 1000000.00', () => {
        component.mask = 'dot_separator.2';
        equal('1000000,00', '1.000.000,00', fixture);
    });

    it('dot_separator precision 0 for 1000000.00', () => {
        component.mask = 'dot_separator.0';
        equal('1000000,00', '1.000.000', fixture);
    });

    it('comma_separator for 1000000', () => {
        component.mask = 'comma_separator';
        equal('1000000', '1,000,000', fixture);
    });

    it('comma_separator precision 2 for 1000000.00', () => {
        component.mask = 'comma_separator.2';
        equal('1000000.00', '1,000,000.00', fixture);
    });

    it('comma_separator precision 0 for 1000000.00', () => {
        component.mask = 'comma_separator.0';
        equal('1000000.00', '1,000,000', fixture);
    });

    it('should not shift cursor for input in-between digits', () => {
        component.mask = 'comma_separator.0';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,5000,000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', {target: inputTarget});

        expect(inputTarget.value).toBe('15,000,000');
        expect(inputTarget.selectionStart).toEqual(3);
    });

    it('sould not shift cursor for backspce on in-between digits', () => {
        component.mask = 'comma_separator.0';
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        inputTarget.value = '1,234,67';
        inputTarget.selectionStart = 6;
        inputTarget.selectionEnd = 6;
        debugElement.triggerEventHandler('keydown', {code: 'Backspace', keyCode: 8, target: inputTarget});
        debugElement.triggerEventHandler('input', {target: inputTarget});

        expect(inputTarget.value).toBe('123,467');
        expect(inputTarget.selectionStart).toEqual(5);
    });
});
