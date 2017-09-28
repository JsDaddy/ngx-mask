import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from './ngx-mask.module';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IConfig } from './config';

@Component({
  selector: 'test-mask',
  template: `<input [mask]="mask"
    [clearIfNotMatch]="clearIfNotMatch"
    [dropSpecialCharacters]="dropSpecialCharacters"
    [specialCharacters]="specialCharacters"
    [patterns]="patterns"
    [formControl]="form"
    [(ngModel)]="ngModelValue">`
})
class TestMaskComponent {

  public mask: string;
  public ngModelValue: string;
  public form: FormControl = new FormControl(null);
  public dropSpecialCharacters: IConfig['dropSpecialCharacters'] = true;
  public clearIfNotMatch: IConfig['clearIfNotMatch'] = false;
  public patterns: IConfig['patterns'];
  public specialCharacters: IConfig['specialCharacters'];

}

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

  function typeTest(inputValue: string): string {
    fixture.detectChanges();

    fixture.nativeElement.querySelector('input').value = inputValue;
    fixture.nativeElement.querySelector('input')
      .dispatchEvent(new Event('input'));

    fixture.detectChanges();
    return fixture.nativeElement.querySelector('input').value;
  }

  function equal(value: string, expectedValue: string): void {
    expect(typeTest(value))
      .toBe(expectedValue);
  }

  it('When I change the mask on-the-fly things should work normally', () => {
    component.mask = '0000.0000';
    equal('1.', '1');
    equal('1éáa2aaaaqwo', '12');
    equal('1234567', '1234.567');

    component.mask = '0.000.000';
    equal('1.', '1.');
    equal('1éáa2aaaaqwo', '1.2');
    equal('1234567', '1.234.567');
  });

  it('More tests', () => {
    component.mask = '0000.0000';
    equal('1', '1');
    equal('12', '12');
    equal('123', '123');
    equal('1234', '1234');
    equal('12345', '1234.5');
    equal('123456', '1234.56');
    equal('1234567', '1234.567');
    equal('12345678', '1234.5678');
  });

  it('When I typed a char thats the same as the mask char', () => {
    component.mask = '00/00/0000';
    equal('00/', '00/');
    equal('00a', '00/');
    equal('00a00/00', '00/00/00');
    equal('0a/00/00', '00/00/0');
    equal('0a/0a/00', '00/00');
  });

  it('When I typed exactly the same as the mask', () => {
    component.mask = '00/00/0000';
    equal('00', '00');
    equal('00/', '00/');
    equal('aa/', '');
    equal('00/0', '00/0');
    equal('00/00', '00/00');
    equal('00/00/0', '00/00/0');
    equal('00/00/00', '00/00/00');
  });

  it('Testing masks with a literal on the last char', () => {
    component.mask = '(99)';
    equal('(99', '(99)');
  });

  it('Masks with numbers and special characters.', () => {
    component.mask = '(123) 456-7899';
    equal('1', '(1');
    equal('12', '(12');
    equal('123', '(123');
    equal('1234', '(123) 4');
    equal('12345', '(123) 45');
    equal('(123) 456', '(123) 456');
    equal('(123) 4567', '(123) 456-7');
  });

  it('Masks with numbers, strings e special characters', () => {
    component.mask = '(999) A99-SSSS';
    equal('as', '(');
    equal('(1', '(1');
    equal('(12', '(12');
    equal('(123', '(123');
    equal('(123) 4', '(123) 4');
    equal('(123) A', '(123) A');
    equal('123.', '(123) ');
    equal('(123) 45', '(123) 45');
    equal('(123) 456', '(123) 456');
    equal('(123) 456-A', '(123) 456-A');
    equal('(123) 456-AB', '(123) 456-AB');
    equal('(123) 456-ABC', '(123) 456-ABC');
    equal('(123) 456-ABCD', '(123) 456-ABCD');
    equal('(123) 456-ABCDE', '(123) 456-ABCD');
    equal('(123) 456-ABCD1', '(123) 456-ABCD');
  });

  it('Masks with ip', () => {
    component.mask = '099.099.099.099';
    equal('1.1.1.1', '1.1.1.1');
    equal('12.1.12.1', '12.1.12.1');
    equal('127.001.1.1', '127.001.1.1');
    equal('192.168.1.78', '192.168.1.78');

  });

  it('Masks with numbers, strings e special characters #2 ', () => {
    component.mask = 'AAA 000-S0S';
    equal('1', '1');
    equal('12', '12');
    equal('123', '123');
    equal('123 4', '123 4');
    equal('123 45', '123 45');
    equal('123 456', '123 456');
    equal('123 456-7', '123 456-');
  });

  it('Result should be the same for FormControl and NgModel', () => {
    component.mask = '00/00/0000';
    typeTest('30/08/19921');
    expect(component.form.value)
      .toBe('30081992');
    expect(component.ngModelValue)
      .toBe('30081992');
  });

  it('FormControl or NgModel should be filled without special characters', () => {
    component.mask = '00-00-00';
    component.dropSpecialCharacters = false;
    equal('257898', '25-78-98');
    expect(component.form.value)
      .toBe('25-78-98');
    expect(component.ngModelValue)
      .toBe('25-78-98');
  });

  it('model values shouldnt be bigger length than masks', () => {
    component.mask = '00-00-00';
    component.dropSpecialCharacters = false;
    equal('2578989', '25-78-98');
    expect(component.form.value)
      .toBe('25-78-98');
    expect(component.ngModelValue)
      .toBe('25-78-98');
  });

  it('should clear if not match the mask', () => {
    component.mask = '000.000-00';
    component.clearIfNotMatch = true;
    equal('', '');
    equal('2578989', '');
    equal('2578989888988', '257.898-98');
    equal('111.111-11', '111.111-11');
  });

  it('should work with custom special characters', () => {
    component.mask = '[000]-[000]*[00]';
    component.specialCharacters = ['[', ']', '-', '*'];
    equal('', '');
    equal('2578989', '[257]-[898]*[9');
    equal('2578989888988', '[257]-[898]*[98]');
    equal('111.111-11', '[111]-[111]*[11]');
  });

  it('should work with custom patterns', () => {
    component.mask = '[000]-[000]*[00]';
    component.specialCharacters = ['[', ']', '-', '*'];
    component.patterns = {
      '0': {
        pattern: new RegExp('\[a-zA-Z\]')
      }
    };
    equal('', '');
    equal('2578989', '[');
    equal('hello world', '[hel]-[low]*[or]');
    equal('111.111-11', '[');

    component.mask = '(000-000)';
    component.specialCharacters = ['(', '-', ')'];
    equal('323HelloWorld', '(Hel-loW)');

    component.mask = '[00]*[000]';
    component.specialCharacters = ['[', ']', '*'];
    component.patterns = {
      '0': {
        pattern: new RegExp('\\d')
      }
    };
    equal('789-874.98', '[78]*[987]');
  });

});
