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

  it('it checks secure input functionality on programmic update', () => {
    component.mask = 'XXX/X0/0000';
    component.hiddenInput = true;
    typeTest('54321', fixture);
    typeTest('1', fixture);
    expect(component.form.value).toBe('1');
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
});
