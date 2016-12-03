import { TestBed } from '@angular/core/testing';
import { MaskDirective } from './mask.directive';
import { dispatchEvent } from '@angular/platform-browser/testing/browser_util';
import { Component } from '@angular/core';
var TestMaskComponent = (function () {
    function TestMaskComponent() {
    }
    TestMaskComponent.decorators = [
        { type: Component, args: [{
                    selector: 'test-mask',
                    template: '<input [mask]="mask">'
                },] },
    ];
    /** @nocollapse */
    TestMaskComponent.ctorParameters = [];
    return TestMaskComponent;
}());
describe('Directive: Mask', function () {
    var fixture, component;
    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [MaskDirective, TestMaskComponent],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    function typeTest(inputValue) {
        fixture.detectChanges();
        fixture.nativeElement.querySelector('input').value = inputValue;
        dispatchEvent(fixture.nativeElement.querySelector('input'), 'input');
        fixture.detectChanges();
        return fixture.nativeElement.querySelector('input').value;
    }
    function equal(value, expectedValue) {
        expect(typeTest(value)).toBe(expectedValue);
    }
    it('When I change the mask on-the-fly things should work normally', function () {
        component.mask = '0000.0000';
        equal(typeTest("1."), "1");
        equal(typeTest('1éáa2aaaaqwo'), "12");
        equal(typeTest('1234567'), "1234.567");
        component.mask = '0.000.000';
        equal(typeTest("1."), "1.");
        equal(typeTest('1éáa2aaaaqwo'), "1.2");
        equal(typeTest('1234567'), "1.234.567");
    });
    it('More tests', function () {
        component.mask = '0000.0000';
        equal(typeTest("1"), "1");
        equal(typeTest("12"), "12");
        equal(typeTest("123"), "123");
        equal(typeTest("1234"), "1234");
        equal(typeTest("12345"), "1234.5");
        equal(typeTest("123456"), "1234.56");
        equal(typeTest("1234567"), "1234.567");
        equal(typeTest("12345678"), "1234.5678");
    });
    it('When I typed a char thats the same as the mask char', function () {
        component.mask = '00/00/0000';
        equal(typeTest("00/"), "00/");
        equal(typeTest("00a"), "00/");
        equal(typeTest("00a00/00"), "00/00/00");
        equal(typeTest("0a/00/00"), "00/00/0");
        equal(typeTest("0a/0a/00"), "00/00");
    });
    it('When I typed exactly the same as the mask', function () {
        component.mask = '00/00/0000';
        equal(typeTest("00"), "00");
        equal(typeTest("00/"), "00/");
        equal(typeTest("aa/"), "");
        equal(typeTest("00/0"), "00/0");
        equal(typeTest("00/00"), "00/00");
        equal(typeTest("00/00/0"), "00/00/0");
        equal(typeTest("00/00/00"), "00/00/00");
    });
    it('Testing masks with a literal on the last char', function () {
        component.mask = '(99)';
        equal(typeTest("(99"), "(99)");
    });
    it('Masks with numbers and special characters.', function () {
        component.mask = '(123) 456-7899';
        equal(typeTest("1"), "(1");
        equal(typeTest('12'), "(12");
        equal(typeTest('123'), "(123");
        equal(typeTest('1234'), "(123) 4");
        equal(typeTest('12345'), "(123) 45");
        equal(typeTest('(123) 456'), "(123) 456");
        equal(typeTest('(123) 4567'), "(123) 456-7");
    });
    it('Masks with numbers, strings e special characters', function () {
        component.mask = '(999) A99-SSSS';
        equal(typeTest("(1"), "(1");
        equal(typeTest('(12'), "(12");
        equal(typeTest('(123'), "(123");
        equal(typeTest('(123) 4'), "(123) 4");
        equal(typeTest('(123) A'), "(123) A");
        equal(typeTest('123.'), "(123) ");
        equal(typeTest('(123) 45'), "(123) 45");
        equal(typeTest('(123) 456'), "(123) 456");
        equal(typeTest('(123) 456-A'), "(123) 456-A");
        equal(typeTest('(123) 456-AB'), "(123) 456-AB");
        equal(typeTest('(123) 456-ABC'), "(123) 456-ABC");
        equal(typeTest('(123) 456-ABCD'), "(123) 456-ABCD");
        equal(typeTest('(123) 456-ABCDE'), "(123) 456-ABCD");
        equal(typeTest('(123) 456-ABCD1'), "(123) 456-ABCD");
    });
    it('Masks with ip', function () {
        component.mask = '099.099.099.099';
        equal(typeTest("1.1.1.1"), "1.1.1.1");
        equal(typeTest("12.1.12.1"), "12.1.12.1");
        equal(typeTest("127.001.1.1"), "127.001.1.1");
        equal(typeTest("192.168.1.78"), "192.168.1.78");
    });
    it('Masks with numbers, strings e special characters #2 ', function () {
        component.mask = 'AAA 000-S0S';
        equal(typeTest("1"), "1");
        equal(typeTest('12'), "12");
        equal(typeTest('123'), "123");
        equal(typeTest('123 4'), "123 4");
        equal(typeTest('123 45'), "123 45");
        equal(typeTest('123 456'), "123 456");
        equal(typeTest('123 456-7'), "123 456-");
    });
});
//# sourceMappingURL=/Users/stevermeister/workspace/ng2-mask/src/app/ng2-mask/mask.directive.spec.js.map