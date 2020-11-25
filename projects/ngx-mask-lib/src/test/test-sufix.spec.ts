import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxMaskModule } from '../lib/ngx-mask.module';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

describe('Directive: Mask (Suffix)', () => {
  let fixture: ComponentFixture<TestMaskComponent>;
  let component: TestMaskComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestMaskComponent],
      imports: [ReactiveFormsModule, NgxMaskModule.forRoot()],
    });
    fixture = TestBed.createComponent(TestMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should clear if not match the mask!!!!', () => {
    component.mask = '0000';
    component.suffix = ' $';
    equal('', '', fixture);
    equal('123', '123 $', fixture);
    equal('1234', '1234 $', fixture);
  });

  it('should clear if not match the mask!!!!', () => {
    component.mask = '0*.00';
    component.suffix = ' $';
    equal('', '', fixture);
    equal('12345', '12345 $', fixture);
    equal('12344.44', '12344.44 $', fixture);
  });

  it('should work correct with suffix .com', () => {
    component.mask = '0000';
    component.suffix = '.com';
    equal('', '', fixture);
    equal('12', '12.com', fixture);
    equal('12344', '1234.com', fixture);
    equal('1234.co7m', '1234.com', fixture);
    equal('123.co4m', '1234.com', fixture);
  });

  it('separator should work correct with suffix', () => {
    component.mask = 'separator';
    component.suffix = '$';
    equal('', '', fixture);
    equal('123', '123$', fixture);
    equal('1234', '1 234$', fixture);
  });
  it('should not delete suffix', () => {
    component.mask = '0000';
    component.suffix = '$';
    const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
    const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
    spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
    fixture.detectChanges();

    inputTarget.value = '5678$';
    inputTarget.selectionStart = 5;
    inputTarget.selectionEnd = 5;
    debugElement.triggerEventHandler('keydown', { code: 'Backspace', keyCode: 8, target: inputTarget });
    debugElement.triggerEventHandler('input', { target: inputTarget });

    expect(inputTarget.value).toBe('5678$');
    expect(inputTarget.selectionStart).toEqual(4);
  });
  it('should delete all if value and part of suffix are deleted', () => {
    component.mask = 'A*';
    component.suffix = ' test';
    const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
    const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
    spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
    fixture.detectChanges();

    inputTarget.value = '10 test';
    debugElement.triggerEventHandler('input', { target: inputTarget });

    expect(inputTarget.value).toBe('10 test');

    inputTarget.value = 'st';
    debugElement.triggerEventHandler('input', { target: inputTarget });

    expect(inputTarget.value).toBe('');
  });
  it('should not delete suffix', () => {
    component.mask = 'A{5}';
    component.suffix = '.com';
    const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
    const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
    spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
    fixture.detectChanges();

    inputTarget.value = 'qwert.com';
    inputTarget.selectionStart = 10;
    inputTarget.selectionEnd = 10;
    debugElement.triggerEventHandler('keydown', { code: 'Backspace', keyCode: 8, target: inputTarget });
    debugElement.triggerEventHandler('input', { target: inputTarget });

    expect(inputTarget.value).toBe('qwert.com');
    expect(inputTarget.selectionStart).toEqual(5);
  });
});
