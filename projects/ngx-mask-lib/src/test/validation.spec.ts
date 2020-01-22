import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { NgxMaskModule } from '../lib/ngx-mask.module';
import { equal } from './utils/test-functions.component';

@Component({
  selector: 'mask-test-no-validation-attr',
  template: `
    <input id="maska" mask="0000" [formControl]="form" />
  `,
})
export class TestMaskNoValidationAttributeComponent {
  public form: FormControl = new FormControl('');
}

@Component({
  selector: 'mask-test-validation-attr',
  template: `
    <input id="maska" mask="0000" [validation]="validate" [formControl]="form" />
  `,
})
export class TestMaskValidationAttributeComponent {
  public form: FormControl = new FormControl('');
  public validate: boolean = true;
}

describe('Directive: Mask (Validation)', () => {
  describe('Global validation true, validation attribute on input not specified', () => {
    let fixture: ComponentFixture<TestMaskNoValidationAttributeComponent>;
    let component: TestMaskNoValidationAttributeComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestMaskNoValidationAttributeComponent],
        imports: [
          ReactiveFormsModule,
          NgxMaskModule.forRoot({
            validation: true,
          }),
        ],
      });
      fixture = TestBed.createComponent(TestMaskNoValidationAttributeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be marked as not valid if not valid', () => {
      equal('12', '12', fixture);
      expect(component.form.valid).toBeFalse();
      expect(component.form.hasError('mask')).toBeTrue();
    });

    it('should be marked as valid if valid', () => {
      equal('1234', '1234', fixture);
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('Global validation true, validation attribute on input specified', () => {
    let fixture: ComponentFixture<TestMaskValidationAttributeComponent>;
    let component: TestMaskValidationAttributeComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestMaskValidationAttributeComponent],
        imports: [
          ReactiveFormsModule,
          NgxMaskModule.forRoot({
            validation: true,
          }),
        ],
      });
      fixture = TestBed.createComponent(TestMaskValidationAttributeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be marked as not valid if not valid and validation attribute true', () => {
      equal('12', '12', fixture);
      expect(component.form.valid).toBeFalse();
      expect(component.form.hasError('mask')).toBeTrue();
    });

    it('should be marked as valid if valid and validation attribute true', () => {
      equal('1234', '1234', fixture);
      expect(component.form.valid).toBeTrue();
    });

    it('should be marked as valid if not valid and validation attribute false', () => {
      component.validate = false;
      equal('12', '12', fixture);
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('Global validation false, validation attribute on input not specified', () => {
    let fixture: ComponentFixture<TestMaskNoValidationAttributeComponent>;
    let component: TestMaskNoValidationAttributeComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestMaskNoValidationAttributeComponent],
        imports: [
          ReactiveFormsModule,
          NgxMaskModule.forRoot({
            validation: false,
          }),
        ],
      });
      fixture = TestBed.createComponent(TestMaskNoValidationAttributeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be marked as valid if not valid', () => {
      equal('12', '12', fixture);
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('Global validation false, validation attribute on input specified', () => {
    let fixture: ComponentFixture<TestMaskValidationAttributeComponent>;
    let component: TestMaskValidationAttributeComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestMaskValidationAttributeComponent],
        imports: [
          ReactiveFormsModule,
          NgxMaskModule.forRoot({
            validation: false,
          }),
        ],
      });
      fixture = TestBed.createComponent(TestMaskValidationAttributeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be marked as not valid if not valid and validation attribute true', () => {
      equal('12', '12', fixture);
      expect(component.form.valid).toBeFalse();
      expect(component.form.hasError('mask')).toBeTrue();
    });

    it('should be marked as valid if not valid and validation attribute false', () => {
      component.validate = false;
      equal('12', '12', fixture);
      expect(component.form.valid).toBeTrue();
    });
  });
});
