import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { NgxMaskModule } from '../lib/ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';

describe('Directive: Mask (Dynamic)', () => {
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

  it('The input value when set by the FormControl should be masked accordingly the dynamic mask', async () => {
    component.mask = '000-0||0000-0||00000-0';
    fixture.detectChanges();

    component.form.setValue({
      value: 1234,
    });
    fixture.detectChanges();
    let inputEl = fixture.debugElement.query(By.css('input'));
    Promise.resolve().then(() => {
      expect(inputEl.nativeElement.value).toEqual('123-4');
    });

    component.form.setValue({
      value: 12345,
    });
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input'));
    Promise.resolve().then(() => {
      expect(inputEl.nativeElement.value).toEqual('1234-5');
    });

    component.form.setValue({
      value: 123456,
    });
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input'));
    Promise.resolve().then(() => {
      expect(inputEl.nativeElement.value).toEqual('12345-6');
    });
  });

  it('The input value when set by the FormControl should be masked accordingly the dynamic mask', async () => {

    var inputEl: any;
    component.mask = 'separator.2';
    component.thousandSeparator = '.';
    component.decimalMarker = ',';

    fixture.detectChanges();

    component.form.setValue({
      value: 12345.67,
    });

    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input'));
    Promise.resolve().then(() => {
      expect(inputEl.nativeElement.value).toEqual('12.345,67');
    });

    component.form.setValue({
      value: '12345.67',
    });

    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input'));
    Promise.resolve().then(() => {
      expect(inputEl.nativeElement.value).toEqual('12.345,67');
    });

    component.form.setValue({
      value: '12345.67',
    });
  });

});
