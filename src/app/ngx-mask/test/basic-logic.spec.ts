import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from '../ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal, typeTest } from './utils/test-functions.component';

describe('Directive: Mask', () => {

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

  it('Pristine and dirty', () => {
    component.mask = '0000.0000';
    expect(component.form.dirty)
      .toBeFalsy();
    expect(component.form.pristine)
      .toBeTruthy();
    equal('1.', '1', fixture);
    equal('1éáa2aaaaqwo', '12', fixture);
    equal('1234567', '1234.567', fixture);
    expect(component.form.dirty)
      .toBeTruthy();
    expect(component.form.pristine)
      .toBeFalsy();
    component.form.reset();
    expect(component.form.dirty)
      .toBeFalsy();
    expect(component.form.pristine)
      .toBeTruthy();
  });

  it('When I change the mask on-the-fly things should work normally', () => {
    component.mask = '0000.0000';
    equal('1.', '1', fixture);
    equal('1éáa2aaaaqwo', '12', fixture);
    equal('1234567', '1234.567', fixture);

    component.mask = '0.000.000';
    equal('1.', '1.', fixture);
    equal('1éáa2aaaaqwo', '1.2', fixture);
    equal('1234567', '1.234.567', fixture);
  });

  it('More tests', () => {
    component.mask = '0.00';
    equal('1', '1', fixture);
    equal('12', '1.2', fixture);
    equal('123', '1.23', fixture);
    equal('1234', '1.23', fixture);
    equal('12345', '1.23', fixture);
    equal('123456', '1.23', fixture);
    equal('1234567', '1.23', fixture);
    equal('12345678', '1.23', fixture);

    component.mask = '0000.0000';
    equal('1', '1', fixture);
    equal('12', '12', fixture);
    equal('123', '123', fixture);
    equal('1234', '1234', fixture);
    equal('12345', '1234.5', fixture);
    equal('123456', '1234.56', fixture);
    equal('1234567', '1234.567', fixture);
    equal('12345678', '1234.5678', fixture);
  });

  it('When I typed a char thats the same as the mask char', () => {
    component.mask = '00/00/0000';
    equal('00/', '00/', fixture);
    equal('00a', '00/', fixture);
    equal('00a00/00', '00/00/00', fixture);
    equal('0a/00/00', '00/00/0', fixture);
    equal('0a/0a/00', '00/00', fixture);
  });

  it('When I typed exactly the same as the mask', () => {
    component.mask = '00/00/0000';
    equal('00', '00', fixture);
    equal('00/', '00/', fixture);
    equal('aa/', '', fixture);
    equal('00/0', '00/0', fixture);
    equal('00/00', '00/00', fixture);
    equal('00/00/0', '00/00/0', fixture);
    equal('00/00/00', '00/00/00', fixture);
  });

  it('Testing masks with a literal on the last char', () => {
    component.mask = '(99)';
    equal('99', '(99)', fixture);
  });

  it('Masks with numbers and special characters.', () => {
    component.mask = '(000) 000-0000';
    equal('1', '(1', fixture);
    equal('12', '(12', fixture);
    equal('123', '(123', fixture);
    equal('1234', '(123) 4', fixture);
    equal('12345', '(123) 45', fixture);
    equal('(123) 456', '(123) 456', fixture);
    equal('(123) 4567', '(123) 456-7', fixture);
  });

  it('Masks with numbers, strings e special characters', () => {
    component.mask = '(099) A99-SSSS';
    equal('as', '(', fixture);
    equal('(1', '(1', fixture);
    equal('(12', '(12', fixture);
    equal('(123', '(123', fixture);
    equal('(123) 4', '(123) 4', fixture);
    equal('(123) A', '(123) A', fixture);
    equal('123.', '(123) ', fixture);
    equal('(123) 45', '(123) 45', fixture);
    equal('(123) 456', '(123) 456', fixture);
    equal('(123) 456-A', '(123) 456-A', fixture);
    equal('(123) 456-AB', '(123) 456-AB', fixture);
    equal('(123) 456-ABC', '(123) 456-ABC', fixture);
    equal('(123) 456-ABCD', '(123) 456-ABCD', fixture);
    equal('(123) 456-ABCDE', '(123) 456-ABCD', fixture);
    equal('(123) 456-ABCD1', '(123) 456-ABCD', fixture);
  });

  it('Masks with ip', () => {
    component.mask = '099.099.099.099';
    equal('1.1.1.1', '1.1.1.1', fixture);
    equal('12.1.12.1', '12.1.12.1', fixture);
    equal('127.001.1.1', '127.001.1.1', fixture);
    equal('192.168.1.78', '192.168.1.78', fixture);

  });

  it('Masks with numbers, strings e special characters #2 ', () => {
    component.mask = 'AAA 000-S0S';
    equal('1', '1', fixture);
    equal('12', '12', fixture);
    equal('123', '123', fixture);
    equal('123 4', '123 4', fixture);
    equal('123 45', '123 45', fixture);
    equal('123 456', '123 456', fixture);
    equal('123 456-7', '123 456-', fixture);
  });

  it('Result should be the same for FormControl and NgModel', () => {
    component.mask = '00/00/0000';
    typeTest('30/08/19921', fixture);
    expect(component.form.value)
      .toBe('30081992');
    expect(component.ngModelValue)
      .toBe('30081992');
  });

  it('model values shouldnt be bigger length than masks', () => {
    component.mask = '00-00-00';
    component.dropSpecialCharacters = false;
    equal('2578989', '25-78-98', fixture);
    expect(component.form.value)
      .toBe('25-78-98');
    expect(component.ngModelValue)
      .toBe('25-78-98');
  });

  it('should work with custom special characters', () => {
    component.mask = '[000]-[000]*[00]';
    component.specialCharacters = ['[', ']', '-', '*'];
    equal('', '', fixture);
    equal('2578989', '[257]-[898]*[9', fixture);
    equal('2578989888988', '[257]-[898]*[98]', fixture);
    equal('111.111-11', '[111]-[111]*[11]', fixture);
  });

  it('should work with custom patterns', () => {
    component.mask = '[000]-[000]*[00]';
    component.specialCharacters = ['[', ']', '-', '*'];
    component.patterns = {
      '0': {
        pattern: new RegExp('\[a-zA-Z\]')
      }
    };
    equal('', '', fixture);
    equal('2578989', '[', fixture);
    equal('hello world', '[hel]-[low]*[or]', fixture);
    equal('111.111-11', '[', fixture);

    component.mask = '(000-000)';
    component.specialCharacters = ['(', '-', ')'];
    equal('323HelloWorld', '(Hel-loW)', fixture);

    component.mask = '[00]*[000]';
    component.specialCharacters = ['[', ']', '*'];
    component.patterns = {
      '0': {
        pattern: new RegExp('\\d')
      }
    };
    equal('789-874.98', '[78]*[987]', fixture);
  });

  it('When I change the mask on-the-fly things should work normally', () => {
    component.mask = '0000.0000';
    equal('1.', '1', fixture);
    equal('1éáa2aaaaqwo', '12', fixture);
    equal('1234567', '1234.567', fixture);

    component.mask = '0.000.000';
    equal('1.', '1.', fixture);
    equal('1éáa2aaaaqwo', '1.2', fixture);
    equal('1234567', '1.234.567', fixture);

    component.mask = null;
    equal('1.', '1.', fixture);
    equal('1éáa2aaaaqwo', '1éáa2aaaaqwo', fixture);
    equal('1234567', '1234567', fixture);

    component.mask = '0000.0000';
    equal('1.', '1', fixture);
    equal('1éáa2aaaaqwo', '12', fixture);
    equal('1234567', '1234.567', fixture);
  });

  it('should work even has no mask', () => {
    component.mask = '';

    equal('1234567', '1234567', fixture);

    expect(component.form.value)
      .toBe('1234567');
  });

  it('should be a UA phone', () => {
    component.mask = '000-00-00-00-000';
    equal('380975577234', '380-97-55-77-234', fixture);
  });

  it('should be a pasport number', () => {
    component.mask = 'AA 000000';
    equal('GH 234098', 'GH 234098', fixture);
  });

  it('should be bank card number', () => {
    component.mask = '0000-0000-0000-0000';
    equal('1234567890123456', '1234-5678-9012-3456', fixture);
  });
});
