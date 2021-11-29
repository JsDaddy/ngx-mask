"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var ngx_mask_module_1 = require("../lib/ngx-mask.module");
var test_component_component_1 = require("./utils/test-component.component");
var test_functions_component_1 = require("./utils/test-functions.component");
describe('Separator: Mask', function () {
    var fixture;
    var component;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [test_component_component_1.TestMaskComponent],
            imports: [forms_1.ReactiveFormsModule, ngx_mask_module_1.NgxMaskModule.forRoot()]
        });
        fixture = testing_1.TestBed.createComponent(test_component_component_1.TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('separator for empty', function () {
        component.mask = 'separator';
        test_functions_component_1.equal('', '', fixture);
    });
    it('separator for 100', function () {
        component.mask = 'separator';
        test_functions_component_1.equal('100', '100', fixture);
    });
    it('separator for -100', function () {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-100', '-100', fixture);
    });
    it('separator for 1000', function () {
        component.mask = 'separator';
        test_functions_component_1.equal('1000', '1 000', fixture);
    });
    it('separator for -1000', function () {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-1000', '-1 000', fixture);
    });
    it('separator for 10000', function () {
        component.mask = 'separator';
        test_functions_component_1.equal('10000', '10 000', fixture);
    });
    it('separator for -10000', function () {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-10000', '-10 000', fixture);
    });
    it('separator for -100000', function () {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-100000', '-100 000', fixture);
    });
    it('separator for 100000', function () {
        component.mask = 'separator';
        test_functions_component_1.equal('100000', '100 000', fixture);
    });
    it('separator for 1000000', function () {
        component.mask = 'separator';
        test_functions_component_1.equal('1000000', '1 000 000', fixture);
    });
    it('separator for -1000000', function () {
        component.mask = 'separator';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-1000000', '-1 000 000', fixture);
    });
    it('should limit separator to 1000', function () {
        component.mask = 'separator';
        component.separatorLimit = '1000';
        test_functions_component_1.equal('1000000', '1 000', fixture);
    });
    it('separator precision 2 for 1000000.00', function () {
        component.mask = 'separator.2';
        test_functions_component_1.equal('1000000.00', '1 000 000.00', fixture);
    });
    it('separator precision 2 for -1000000.00', function () {
        component.mask = 'separator.2';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-1000000.00', '-1 000 000.00', fixture);
    });
    it('should limit separator with precision 2 to 10000', function () {
        component.mask = 'separator.2';
        component.separatorLimit = '10000';
        test_functions_component_1.equal('1000000.00', '10 000.00', fixture);
    });
    it('should limit separator with precision 2 to 10 000', function () {
        component.mask = 'separator.2';
        component.separatorLimit = '10 000';
        test_functions_component_1.equal('1000000.00', '10 000.00', fixture);
    });
    it('separator precision 0 for 1000000.00', function () {
        component.mask = 'separator.0';
        test_functions_component_1.equal('1000000.00', '1 000 000', fixture);
    });
    it('separator precision 2 with 0 after point for 1000000.00', function () {
        component.mask = 'separator.2';
        test_functions_component_1.equal('1000000.20', '1 000 000.20', fixture);
    });
    it('separator.2 with suffix', function () {
        component.mask = 'separator.2';
        component.suffix = '₽';
        test_functions_component_1.equal('50', '50₽', fixture);
        test_functions_component_1.equal('123 4', '1 234₽', fixture);
        test_functions_component_1.equal('50.50', '50.50₽', fixture);
    });
    it('separator for letters', function () {
        component.mask = 'separator';
        test_functions_component_1.equal('a', '', fixture);
        test_functions_component_1.equal('1a', '1', fixture);
        test_functions_component_1.equal('1000a', '1 000', fixture);
        test_functions_component_1.equal('1000/', '1 000', fixture);
    });
    it('separator thousandSeparator . for 1000000', function () {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        test_functions_component_1.equal('1000000', '1.000.000', fixture);
    });
    it('should not add any sperator if thousandSeparator set as empty string', function () {
        component.mask = 'separator';
        component.thousandSeparator = '';
        test_functions_component_1.equal('1000000', '1000000', fixture);
    });
    it('should not accept more than one minus signal at the beginning of input for separator thousandSeparator . for --1000', function () {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('--1000', '-1.000', fixture);
    });
    it('should not accept more than one minus signal for separator thousandSeparator . for -100-0000', function () {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-100-0000', '-1.000.000', fixture);
    });
    it('should limit separator thousandSeparator . to 100000', function () {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        component.separatorLimit = '100000';
        test_functions_component_1.equal('1000000', '100.000', fixture);
    });
    it('should limit separator thousandSeparator . to -100000', function () {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        component.separatorLimit = '100000';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-1000000', '-100.000', fixture);
    });
    it('separator precision 2 with thousandSeparator (.) decimalMarker (,) for 12345.67', () => {
      component.mask = 'separator.2';
      component.thousandSeparator = '.';
      component.decimalMarker = ',';
      equal('12.345,67', '12.345,67', fixture);
    });
    it('separator precision 2 with thousandSeparator (.) decimalMarker (,) for 12345.67', () => {
      component.mask = 'separator.2';
      component.thousandSeparator = '.';
      component.decimalMarker = ',';
      equal('12345,67', '12.345,67', fixture);
    });
    it('separator thousandSeparator . precision 2 for 1000000.00', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        test_functions_component_1.equal('1000000,00', '1.000.000,00', fixture);
    });
    it('separator thousandSeparator . precision 2 for -1000000.00', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        component.allowNegativeNumbers = true;
        test_functions_component_1.equal('-1000000,00', '-1.000.000,00', fixture);
    });
    it('separator thousandSeparator . precision 2 with 0 after point for 1000000.00', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        test_functions_component_1.equal('1000000,20', '1.000.000,20', fixture);
    });
    it('separator thousandSeparator . precision 0 for 1000000.00', function () {
        component.mask = 'separator.0';
        component.thousandSeparator = '.';
        test_functions_component_1.equal('1000000,00', '1.000.000', fixture);
    });
    it('separator thousandSeparator , for 1000000', function () {
        component.mask = 'separator';
        component.thousandSeparator = ',';
        test_functions_component_1.equal('1000000', '1,000,000', fixture);
    });
    it('separator thousandSeparator , precision 2 for 1000000.00', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        test_functions_component_1.equal('1000000.00', '1,000,000.00', fixture);
    });
    it('separator thousandSeparator , precision 2 with 0 after point for 1000000.00', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        test_functions_component_1.equal('1000000.20', '1,000,000.20', fixture);
    });
    it('separator thousandSeparator , precision 0 for 1000000.00', function () {
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
        test_functions_component_1.equal('1000000.00', '1,000,000', fixture);
    });
    it("separator thousandSeparator ' for 1000000", function () {
        component.mask = 'separator';
        component.thousandSeparator = "'";
        test_functions_component_1.equal('1000000', "1'000'000", fixture);
    });
    it("separator thousandSeparator ' precision 2 for 1000000.00", function () {
        component.mask = 'separator.2';
        component.thousandSeparator = "'";
        test_functions_component_1.equal('1000000.00', "1'000'000.00", fixture);
    });
    it("separator thousandSeparator ' precision 2 with 0 after point for 1000000.00", function () {
        component.mask = 'separator.2';
        component.thousandSeparator = "'";
        test_functions_component_1.equal('1000000.20', "1'000'000.20", fixture);
    });
    it("separator thousandSeparator ' precision 0 for 1000000.00", function () {
        component.mask = 'separator.0';
        component.thousandSeparator = "'";
        test_functions_component_1.equal('1000000.00', "1'000'000", fixture);
    });
    it('should not shift cursor for input in-between digits', function () {
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1,5000,000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('15,000,000');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', function () {
        component.mask = 'separator.0';
        component.thousandSeparator = '.';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1.5000.000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('15.000.000');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1,5000,000.00';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('15,000,000.00');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1.5000.000,00';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('15.000.000,00');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', function () {
        component.mask = 'separator';
        component.thousandSeparator = ',';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1,5000,000.000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('15,000,000.000');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for input in-between digits', function () {
        component.mask = 'separator';
        component.thousandSeparator = '.';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1.5000.000,000';
        inputTarget.selectionStart = 3;
        inputTarget.selectionEnd = 3;
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('15.000.000,000');
        expect(inputTarget.selectionStart).toEqual(3);
    });
    it('should not shift cursor for backspace on in-between digits', function () {
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1,234,67';
        inputTarget.selectionStart = 6;
        inputTarget.selectionEnd = 6;
        debugElement.triggerEventHandler('keydown', { code: 'Backspace', keyCode: 8, target: inputTarget });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('123,467');
        expect(inputTarget.selectionStart).toEqual(4);
    });
    it('should not shift cursor for backspace on in-between digits', function () {
        component.mask = 'separator.0';
        component.thousandSeparator = '.';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1.234.67';
        inputTarget.selectionStart = 6;
        inputTarget.selectionEnd = 6;
        debugElement.triggerEventHandler('keydown', { code: 'Backspace', keyCode: 8, target: inputTarget });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('123.467');
        expect(inputTarget.selectionStart).toEqual(4);
    });
    it('should not shift cursor for backspace on in-between digits', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1,234,67.00';
        inputTarget.selectionStart = 8;
        inputTarget.selectionEnd = 8;
        debugElement.triggerEventHandler('keydown', { code: 'Backspace', keyCode: 8, target: inputTarget });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('123,467.00');
        expect(inputTarget.selectionStart).toEqual(7);
    });
    it('should not shift cursor for backspace on in-between digits', function () {
        component.mask = 'separator.2';
        component.thousandSeparator = '.';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1.234.67,00';
        inputTarget.selectionStart = 8;
        inputTarget.selectionEnd = 8;
        debugElement.triggerEventHandler('keydown', { code: 'Backspace', keyCode: 8, target: inputTarget });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('123.467,00');
        expect(inputTarget.selectionStart).toEqual(7);
    });
    it('should not shift cursor on backspace when result has no separator', function () {
        component.mask = 'separator.0';
        component.thousandSeparator = ',';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1,34';
        inputTarget.selectionStart = 2;
        inputTarget.selectionEnd = 2;
        debugElement.triggerEventHandler('keydown', { code: 'Backspace', keyCode: 8, target: inputTarget });
        debugElement.triggerEventHandler('input', { target: inputTarget });
        expect(inputTarget.value).toBe('134');
        expect(inputTarget.selectionStart).toEqual(0);
    });
    it('caret should remain in position when deleting the first digit', function () {
        component.mask = 'separator';
        component.thousandSeparator = ',';
        var debugElement = fixture.debugElement.query(platform_browser_1.By.css('input'));
        var inputTarget = debugElement.nativeElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();
        inputTarget.value = '1,000';
        inputTarget.selectionStart = 0;
        inputTarget.selectionEnd = 0;
        debugElement.triggerEventHandler('input', { target: inputTarget });
        debugElement.triggerEventHandler('keydown', { code: 'Delete', keyCode: 46, target: inputTarget });
        expect(inputTarget.selectionStart).toEqual(0);
    });
});
