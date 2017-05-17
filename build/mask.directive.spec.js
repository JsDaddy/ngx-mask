var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { TestBed } from '@angular/core/testing';
import { MaskDirective } from './mask.directive';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
var TestMaskComponent = (function () {
    function TestMaskComponent() {
        this.form = new FormControl(null);
        this.specialCharacters = true;
    }
    return TestMaskComponent;
}());
TestMaskComponent = __decorate([
    Component({
        selector: 'test-mask',
        template: '<input [mask]="mask" [specialCharacters]="specialCharacters" [formControl]="form" [(ngModel)]="ngModelValue">'
    }),
    __metadata("design:paramtypes", [])
], TestMaskComponent);
describe('Directive: Mask', function () {
    var fixture, component;
    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [MaskDirective, TestMaskComponent],
            imports: [ReactiveFormsModule]
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    function typeTest(inputValue) {
        fixture.detectChanges();
        fixture.nativeElement.querySelector('input').value = inputValue;
        fixture.nativeElement.querySelector('input').dispatchEvent(new Event('input'));
        fixture.detectChanges();
        return fixture.nativeElement.querySelector('input').value;
    }
    function equal(value, expectedValue) {
        expect(typeTest(value)).toBe(expectedValue);
    }
    it('When I change the mask on-the-fly things should work normally', function () {
        component.mask = '0000.0000';
        equal(typeTest('1.'), '1');
        equal(typeTest('1éáa2aaaaqwo'), '12');
        equal(typeTest('1234567'), '1234.567');
        component.mask = '0.000.000';
        equal(typeTest('1.'), '1.');
        equal(typeTest('1éáa2aaaaqwo'), '1.2');
        equal(typeTest('1234567'), '1.234.567');
    });
    it('More tests', function () {
        component.mask = '0000.0000';
        equal(typeTest('1'), '1');
        equal(typeTest('12'), '12');
        equal(typeTest('123'), '123');
        equal(typeTest('1234'), '1234');
        equal(typeTest('12345'), '1234.5');
        equal(typeTest('123456'), '1234.56');
        equal(typeTest('1234567'), '1234.567');
        equal(typeTest('12345678'), '1234.5678');
    });
    it('When I typed a char thats the same as the mask char', function () {
        component.mask = '00/00/0000';
        equal(typeTest('00/'), '00/');
        equal(typeTest('00a'), '00/');
        equal(typeTest('00a00/00'), '00/00/00');
        equal(typeTest('0a/00/00'), '00/00/0');
        equal(typeTest('0a/0a/00'), '00/00');
    });
    it('When I typed exactly the same as the mask', function () {
        component.mask = '00/00/0000';
        equal(typeTest('00'), '00');
        equal(typeTest('00/'), '00/');
        equal(typeTest('aa/'), '');
        equal(typeTest('00/0'), '00/0');
        equal(typeTest('00/00'), '00/00');
        equal(typeTest('00/00/0'), '00/00/0');
        equal(typeTest('00/00/00'), '00/00/00');
    });
    it('Testing masks with a literal on the last char', function () {
        component.mask = '(99)';
        equal(typeTest('(99'), '(99)');
    });
    it('Masks with numbers and special characters.', function () {
        component.mask = '(123) 456-7899';
        equal(typeTest('1'), '(1');
        equal(typeTest('12'), '(12');
        equal(typeTest('123'), '(123');
        equal(typeTest('1234'), '(123) 4');
        equal(typeTest('12345'), '(123) 45');
        equal(typeTest('(123) 456'), '(123) 456');
        equal(typeTest('(123) 4567'), '(123) 456-7');
    });
    it('Masks with numbers, strings e special characters', function () {
        component.mask = '(999) A99-SSSS';
        equal(typeTest('(1'), '(1');
        equal(typeTest('(12'), '(12');
        equal(typeTest('(123'), '(123');
        equal(typeTest('(123) 4'), '(123) 4');
        equal(typeTest('(123) A'), '(123) A');
        equal(typeTest('123.'), '(123) ');
        equal(typeTest('(123) 45'), '(123) 45');
        equal(typeTest('(123) 456'), '(123) 456');
        equal(typeTest('(123) 456-A'), '(123) 456-A');
        equal(typeTest('(123) 456-AB'), '(123) 456-AB');
        equal(typeTest('(123) 456-ABC'), '(123) 456-ABC');
        equal(typeTest('(123) 456-ABCD'), '(123) 456-ABCD');
        equal(typeTest('(123) 456-ABCDE'), '(123) 456-ABCD');
        equal(typeTest('(123) 456-ABCD1'), '(123) 456-ABCD');
    });
    it('Masks with ip', function () {
        component.mask = '099.099.099.099';
        equal(typeTest('1.1.1.1'), '1.1.1.1');
        equal(typeTest('12.1.12.1'), '12.1.12.1');
        equal(typeTest('127.001.1.1'), '127.001.1.1');
        equal(typeTest('192.168.1.78'), '192.168.1.78');
    });
    it('Masks with numbers, strings e special characters #2 ', function () {
        component.mask = 'AAA 000-S0S';
        equal(typeTest('1'), '1');
        equal(typeTest('12'), '12');
        equal(typeTest('123'), '123');
        equal(typeTest('123 4'), '123 4');
        equal(typeTest('123 45'), '123 45');
        equal(typeTest('123 456'), '123 456');
        equal(typeTest('123 456-7'), '123 456-');
    });
    it('Result should be the same for FormControl and NgModel', function () {
        component.mask = '00/00/0000';
        typeTest('30/08/19921');
        expect(component.form.value).toBe('30/08/1992');
        expect(component.ngModelValue).toBe('30/08/1992');
    });
    it('FormControl or NgModel should be filled without special characters', function () {
        component.mask = '00-00-00';
        component.specialCharacters = false;
        equal('257898', '25-78-98');
        expect(component.form.value).toBe('257898');
        expect(component.ngModelValue).toBe('257898');
    });
});
