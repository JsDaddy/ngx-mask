import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from '../lib/ngx-mask.module';
import { TestMaskComponent } from './utils/test-component.component';
import { By } from '@angular/platform-browser';

describe('Event: paste', () => {
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

  it('After paste to control cursor should be on the end of input)', () => {
    component.mask = '00 - 0000 - 00000';
    fixture.detectChanges();

    const inputDebuggerElement = fixture.debugElement.query(By.css('#maska'));

    const pasteData = new DataTransfer();
    pasteData.setData('text', '123456789');
    inputDebuggerElement.triggerEventHandler('paste', pasteData);

    inputDebuggerElement.nativeElement.value = pasteData.getData('text/plain');
    inputDebuggerElement.triggerEventHandler('input', { target: inputDebuggerElement.nativeElement });

    fixture.detectChanges();

    expect(inputDebuggerElement.nativeElement.value).toBe('12 - 3456 - 789');

    expect(inputDebuggerElement.nativeElement.selectionStart).toBe(15);
  });
});
