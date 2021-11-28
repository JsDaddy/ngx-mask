import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from '../lib/ngx-mask.module';
import { TestMaskComponent } from './utils/test-component.component';
import { equal, typeTest } from './utils/test-functions.component';

describe('Directive: Mask (Secure)', () => {
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

  it('it checks secure input functionality ', () => {
    component.mask = 'XXX/X0/0000';
    component.hiddenInput = true;
    equal('1234', '***/*', fixture);
    expect(component.form.value).toBe('1234');
  });

  it('it checks secure input functionality ', () => {
    component.mask = 'XXX/XX/0000';
    component.hiddenInput = true;
    equal('123456789', '***/**/6789', fixture);
    expect(component.form.value).toBe('123456789');
  });

  it('it checks secure input functionality ', () => {
    component.mask = 'XXX/XX/XXX0';
    component.hiddenInput = true;
    equal('123456789', '***/**/***9', fixture);
    expect(component.form.value).toBe('123456789');
  });

  it('it checks secure input functionality ', () => {
    component.mask = 'XXX/XX/XXXX';
    component.hiddenInput = true;
    equal('123456789', '***/**/****', fixture);
    expect(component.form.value).toBe('123456789');
  });

  it('it checks secure input functionality ', () => {
    component.mask = '0000-00-XXXX';
    component.hiddenInput = true;
    equal('123456789', '1234-56-***', fixture);
    expect(component.form.value).toBe('123456789');
  });

  it('it checks secure input functionality ', () => {
    component.mask = '0000-X0-XXXX';
    component.hiddenInput = true;
    equal('123456789', '1234-*6-***', fixture);
    expect(component.form.value).toBe('123456789');
  });

  it('it checks secure input functionality on reset', () => {
    component.mask = 'XXX/X0/0000';
    component.hiddenInput = true;
    typeTest('54321', fixture);
    component.form.reset('98765');
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('input').value).toBe('***/*5');
    });
  });

  it('it checks secure input functionality on reset then typed', () => {
    component.mask = 'XXX/X0/0000';
    component.hiddenInput = true;
    typeTest('54321', fixture);
    component.form.reset();
    equal('98765', '***/*5', fixture);
  });

  it('it checks secure input functionality on setValue(longer string)', () => {
    component.mask = 'XXX/X0/0000';
    component.hiddenInput = true;
    typeTest('54321', fixture);
    component.form.setValue('1234567');
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('input').value).toBe('***/*5/67');
    });
  });

  it('should be same form state (pristine) after mask change', () => {
    component.mask = 'XXX/X0/0000';
    component.hiddenInput = true;
    component.form.reset('123456789');
    fixture.detectChanges();
    expect(component.form.dirty).toBeFalsy();
    expect(component.form.pristine).toBeTruthy();
    component.mask = '000/00/0000';
    fixture.detectChanges();
    expect(component.form.dirty).toBeFalsy();
    expect(component.form.pristine).toBeTruthy();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('input').value).toBe('123/45/6789');
    });
  });

  it('should be same form state (dirty) after mask change', () => {
    component.mask = 'XXX/X0/0000';
    component.hiddenInput = true;
    component.form.reset('123456789');
    component.form.markAsDirty();
    component.form.markAsTouched();
    fixture.detectChanges();
    expect(component.form.dirty).toBeTruthy();
    expect(component.form.pristine).toBeFalsy();
    component.mask = '000/00/0000';
    fixture.detectChanges();
    expect(component.form.dirty).toBeTruthy();
    expect(component.form.pristine).toBeFalsy();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('input').value).toBe('123/45/6789');
    });
  });

  it('should not keep shadow copy when form reset', () => {
    component.hiddenInput = true;
    component.mask = 'XXX/X0/0000';
    equal('54321', '***/*1', fixture);
    typeTest('1', fixture);
    expect(component.form.value).toBe('1');
    component.form.reset();
    expect(component.form.value).toBe(null);
    equal('2', '*', fixture);
    expect(component.form.value).toBe('2');
  });

  it('mask changes should work with null input', () => {
    component.hiddenInput = true;
    component.mask = '000/00/0000';
    equal('987654321', '987/65/4321', fixture);
    component.form.reset();
    component.mask = 'XXX/X0/0000';
    equal('54321', '***/*1', fixture);
    expect(component.form.value).toBe('54321');
  });
});
