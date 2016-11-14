/* tslint:disable:no-unused-variable */
import {ElementRef} from '@angular/core'
import {TestBed, async, inject} from '@angular/core/testing';
import {MaskDirective} from './mask.directive';

import {dispatchEvent} from '@angular/platform-browser/testing/browser_util'

import {Component} from '@angular/core';

@Component({
  selector: 'test-mask',
  template: '<input [mask]="mask">'
})
class TestMaskComponent {
}



describe('Directive: Mask', () => {
  let fixture, component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaskDirective, TestMaskComponent],
      // providers: [ElementRef]
    });
    fixture = TestBed.createComponent(TestMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function typeTest(inputValue:string):string {
    fixture.detectChanges();

    fixture.nativeElement.querySelector('input').value = inputValue;
    dispatchEvent(fixture.nativeElement.querySelector('input'), 'input');

    fixture.detectChanges();
    return fixture.nativeElement.querySelector('input').value;
  }

  function equal(value, expectedValue) : void {
    expect(typeTest(value)).toBe(expectedValue);
  }

  it('When I change the mask on-the-fly things should work normally', () => {
    component.mask = '0000.0000';
    equal( typeTest("1."), "1");
    equal( typeTest('1éáa2aaaaqwo'), "12");
    equal( typeTest('1234567'), "1234.567");

    component.mask = '0.000.000';
    equal( typeTest("1."), "1.");
    equal( typeTest('1éáa2aaaaqwo'), "1.2");
    equal( typeTest('1234567'), "1.234.567");
  });

  it('More tests', () => {
    component.mask = '0000.0000';
    equal( typeTest("1"), "1");
    equal( typeTest("12"), "12");
    equal( typeTest("123"), "123");
    equal( typeTest("1234"), "1234");
    equal( typeTest("12345"), "1234.5");
    equal( typeTest("123456"), "1234.56");
    equal( typeTest("1234567"), "1234.567");
    equal( typeTest("12345678"), "1234.5678");
  });

  it('When I typed a char thats the same as the mask char', () => {
    component.mask = '00/00/0000';
    equal( typeTest("00/"), "00/");
    equal( typeTest("00a"), "00/");
    equal( typeTest("00a00/00"), "00/00/00");
    equal( typeTest("0a/00/00"), "00/00/0");
    equal( typeTest("0a/0a/00"), "00/00");
  });

  it('When I typed exactly the same as the mask', () => {
    component.mask = '00/00/0000';
    equal( typeTest("00"), "00");
    equal( typeTest("00/"), "00/");
    equal( typeTest("aa/"), "");
    equal( typeTest("00/0"), "00/0");
    equal( typeTest("00/00"), "00/00");
    equal( typeTest("00/00/0"), "00/00/0");
    equal( typeTest("00/00/00"), "00/00/00");
  });

  it('Testing masks with a literal on the last char', () => {
    component.mask = '(99)';
    equal( typeTest("(99"), "(99)");
  });

  it('Masks with numbers and special characters.', () => {
    component.mask = '(123) 456-7899';
    equal( typeTest("1"), "(1");
    equal( typeTest('12'), "(12");
    equal( typeTest('123'), "(123");
    equal( typeTest('1234'), "(123) 4");
    equal( typeTest('12345'), "(123) 45");
    equal( typeTest('(123) 456'), "(123) 456");
    equal( typeTest('(123) 4567'), "(123) 456-7");
  });

  //TODO
  xit('Masks with numbers, strings e special characters', () => {
    component.mask = '(999) A99-SSSS';
    equal( typeTest("(1"), "(1");
    equal( typeTest('(12'), "(12");
    equal( typeTest('(123'), "(123");
    equal( typeTest('(123) 4'), "(123) 4");
    equal( typeTest('(123) A'), "(123) A");
    equal( typeTest('123.'), "(123) ");
    equal( typeTest('(123) 45'), "(123) 45");
    equal( typeTest('(123) 456'), "(123) 456");
    equal( typeTest('(123) 456-A'), "(123) 456-A");
    equal( typeTest('(123) 456-AB'), "(123) 456-AB");
    equal( typeTest('(123) 456-ABC'), "(123) 456-ABC");
    equal( typeTest('(123) 456-ABCD'), "(123) 456-ABCD");
    equal( typeTest('(123) 456-ABCDE'), "(123) 456-ABCD");
    equal( typeTest('(123) 456-ABCD1'), "(123) 456-ABCD");
  });

  //TODO
  xit('Masks with numbers, strings e special characters #2 ', () => {
    component.mask = 'AAA 000-S0S';
    equal( typeTest("1"), "1");
    equal( typeTest('12'), "12");
    equal( typeTest('123'), "123");
    equal( typeTest('123 4'), "123 4");
    equal( typeTest('123 45'), "123 45");
    equal( typeTest('123 456'), "123 456");
    equal( typeTest('123 456-7'), "123 456-");
  });
});
