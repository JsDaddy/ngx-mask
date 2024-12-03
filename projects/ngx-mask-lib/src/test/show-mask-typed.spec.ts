import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import type { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Directive: Mask', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should clear if not match the mask!!!!', () => {
        component.mask.set('(000) 000-0000');
        component.showMaskTyped.set(true);
        equal('', '(___) ___-____', fixture);
        equal('2345678', '(234) 567-8___', fixture);

        component.prefix.set('+7');
        component.showMaskTyped.set(true);
        equal('', '+7(___) ___-____', fixture);
        equal('2345678', '+7(234) 567-8___', fixture);
    });

    it('should clear if not match the mask!!!!', () => {
        component.mask.set('A{5}-A{2}');
        component.showMaskTyped.set(true);
        equal('', '_____-__', fixture);
        equal('aaa', 'aaa__-__', fixture);
        equal('aaaaaaa', 'aaaaa-aa', fixture);
    });

    it('Mask with optional pattern 9999', () => {
        component.mask.set('(000) 000-0000 ext. 999999');
        component.showMaskTyped.set(true);
        component.specialCharacters.set(['e', 'x', 't', ' ', '(', ')', '-', '.']);
        equal('9871234223 ext. 123022', '(987) 123-4223 ext. 123022', fixture);

        component.mask.set('(000) 000-0000 testing. 999999');
        component.showMaskTyped.set(true);
        component.specialCharacters.set([
            't',
            'e',
            's',
            't',
            'i',
            'n',
            'g',
            ' ',
            '(',
            ')',
            '-',
            '.',
        ]);
        equal('1234567890 testing. 123456', '(123) 456-7890 testing. 123456', fixture);

        component.mask.set('(000) 000-0000 prefix. 999');
        component.showMaskTyped.set(true);
        component.prefix.set('+7');
        component.specialCharacters.set(['p', 'r', 'e', 'f', 'i', 'x', ' ', '(', ')', '-', '.']);
        equal('1234567890 prefix. 345', '+7(123) 456-7890 prefix. 345', fixture);

        component.mask.set('(000) 000-0000 cv. 999');
        component.showMaskTyped.set(true);
        component.prefix.set('card. ');
        component.specialCharacters.set(['c', 'v', ' ', '(', ')', '-', '.']);
        equal('1234567890 cv. 345', 'card. (123) 456-7890 cv. 345', fixture);
    });

    it('Mask with optional pattern 00000', () => {
        component.mask.set('(000) 000-0000 ext. 000000');
        component.showMaskTyped.set(true);
        component.specialCharacters.set(['e', 'x', 't', ' ', '(', ')', '-', '.']);
        equal('9871234223 ext. 123022', '(987) 123-4223 ext. 123022', fixture);

        component.mask.set('(000) 000-0000 testing. 00000');
        component.showMaskTyped.set(true);
        component.specialCharacters.set([
            't',
            'e',
            's',
            't',
            'i',
            'n',
            'g',
            ' ',
            '(',
            ')',
            '-',
            '.',
        ]);
        equal('1234567890 testing. 12345', '(123) 456-7890 testing. 12345', fixture);

        component.mask.set('(000) 000-0000 prefix. 000');
        component.showMaskTyped.set(true);
        component.prefix.set('+7');
        component.specialCharacters.set(['p', 'r', 'e', 'f', 'i', 'x', ' ', '(', ')', '-', '.']);
        equal('1234567890 prefix. 345', '+7(123) 456-7890 prefix. 345', fixture);

        component.mask.set('(000) 000-0000 cv. 000');
        component.showMaskTyped.set(true);
        component.prefix.set('card. ');
        component.specialCharacters.set(['c', 'v', ' ', '(', ')', '-', '.']);
        equal('1234567890 cv. 134', 'card. (123) 456-7890 cv. 134', fixture);
    });

    // TODO(inepipenko) for issue #880
    xit('should work right with security input', () => {
        component.mask.set('000-0X-XXXX');
        component.showMaskTyped.set(true);
        equal('', '___-__-____', fixture);
        equal('123', '123-__-____', fixture);
        equal('12345', '123-4*-____', fixture);
        equal('123456', '123-4*-*___', fixture);
        equal('1234567', '123-4*-**__', fixture);
        equal('12345678', '123-4*-***_', fixture);
        equal('12345679', '123-4*-****', fixture);
        equal('123456791', '123-4*-****', fixture);
    });

    it('showMaskTyped && placeholder XXXXX-YYYY', () => {
        component.showMaskTyped.set(true);
        component.placeHolderCharacter.set('XXXXX-YYYY');
        component.mask.set('00000-0000');
        equal('1', '1XXXX-YYYY', fixture);
        equal('12', '12XXX-YYYY', fixture);
        equal('123', '123XX-YYYY', fixture);
        equal('1234', '1234X-YYYY', fixture);
        equal('12345', '12345-YYYY', fixture);
        equal('123456', '12345-6YYY', fixture);
        equal('1234567', '12345-67YY', fixture);
        equal('12345678', '12345-678Y', fixture);
        equal('123456789', '12345-6789', fixture);
    });

    it('showMaskTyped && placeholder 00/00/0000', () => {
        component.showMaskTyped.set(true);
        component.placeHolderCharacter.set('dd/mm/yyyy');
        component.mask.set('00/00/0000');
        equal('1', '1d/mm/yyyy', fixture);
        equal('12', '12/mm/yyyy', fixture);
        equal('123', '12/3m/yyyy', fixture);
        equal('1234', '12/34/yyyy', fixture);
        equal('12345', '12/34/5yyy', fixture);
        equal('123456', '12/34/56yy', fixture);
        equal('1234567', '12/34/567y', fixture);
        equal('12345678', '12/34/5678', fixture);
    });

    it('should work with showMaskTyped', () => {
        component.mask.set('000/00000');
        component.prefix.set('06');
        component.dropSpecialCharacters.set(false);
        component.showMaskTyped.set(true);
        equal('', '06___/_____', fixture);
        equal('1', '061__/_____', fixture);
        equal('12', '0612_/_____', fixture);
        equal('123', '06123/_____', fixture);
        equal('1230', '06123/0____', fixture);
        equal('12304', '06123/04___', fixture);
        equal('123040', '06123/040__', fixture);
        equal('1230405', '06123/0405_', fixture);
        equal('12304051', '06123/04051', fixture);
    });

    it('should work with showMaskTyped', () => {
        component.mask.set('000/00000');
        component.prefix.set('06');
        equal('1', '061', fixture);
        equal('12', '0612', fixture);
        equal('123', '06123', fixture);
        equal('1230', '06123/0', fixture);
        equal('12304', '06123/04', fixture);
        equal('123040', '06123/040', fixture);
        equal('1230405', '06123/0405', fixture);
        equal('12304051', '06123/04051', fixture);
    });

    it('should work with showMaskTyped 000/00000', async () => {
        component.mask.set('000/00000');
        component.showMaskTyped.set(false);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        expect(inputTarget.selectionStart).toBe(3);
        component.showMaskTyped.set(true);
        inputTarget.focus();

        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('123/_____');
    });

    it('should work with showMaskTyped 000/00000 with prefix', async () => {
        component.mask.set('000/00000');
        component.prefix.set('+38 ');
        component.showMaskTyped.set(false);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        equal('+38 1', '+38 1', fixture);
        equal('+38 12', '+38 12', fixture);
        equal('+38 123', '+38 123', fixture);
        expect(inputTarget.selectionStart).toBe(7);
        component.showMaskTyped.set(true);
        inputTarget.focus();

        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).toBe('+38 123/_____');
    });
});
