import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should clear if not match the mask!!!!', () => {
        component.mask = '(000) 000-0000';
        component.showMaskTyped = true;
        equal('', '(___) ___-____', fixture);
        equal('2345678', '(234) 567-8___', fixture);

        component.prefix = '+7';
        component.showMaskTyped = true;
        equal('', '+7(___) ___-____', fixture);
        equal('2345678', '+7(234) 567-8___', fixture);
    });

    it('should clear if not match the mask!!!!', () => {
        component.mask = 'A{5}-A{2}';
        component.showMaskTyped = true;
        equal('', '_____-__', fixture);
        equal('aaa', 'aaa__-__', fixture);
        equal('aaaaaaa', 'aaaaa-aa', fixture);
    });

    it('Mask with optional pattern 9999', () => {
        component.mask = '(000) 000-0000 ext. 999999';
        component.showMaskTyped = true;
        component.specialCharacters = ['e', 'x', 't', ' ', '(', ')', '-', '.'];
        equal('9871234223 ext. 123022', '(987) 123-4223 ext. 123022', fixture);

        component.mask = '(000) 000-0000 testing. 999999';
        component.showMaskTyped = true;
        component.specialCharacters = ['t', 'e', 's', 't', 'i', 'n', 'g', ' ', '(', ')', '-', '.'];
        equal('1234567890 testing. 123456', '(123) 456-7890 testing. 123456', fixture);

        component.mask = '(000) 000-0000 prefix. 999';
        component.showMaskTyped = true;
        component.prefix = '+7';
        component.specialCharacters = ['p', 'r', 'e', 'f', 'i', 'x', ' ', '(', ')', '-', '.'];
        equal('1234567890 prefix. 345', '+7(123) 456-7890 prefix. 345', fixture);

        component.mask = '(000) 000-0000 cv. 999';
        component.showMaskTyped = true;
        component.prefix = 'card. ';
        component.specialCharacters = ['c', 'v', ' ', '(', ')', '-', '.'];
        equal('1234567890 cv. 345', 'card. (123) 456-7890 cv. 345', fixture);
    });

    it('Mask with optional pattern 00000', () => {
        component.mask = '(000) 000-0000 ext. 000000';
        component.showMaskTyped = true;
        component.specialCharacters = ['e', 'x', 't', ' ', '(', ')', '-', '.'];
        equal('9871234223 ext. 123022', '(987) 123-4223 ext. 123022', fixture);

        component.mask = '(000) 000-0000 testing. 00000';
        component.showMaskTyped = true;
        component.specialCharacters = ['t', 'e', 's', 't', 'i', 'n', 'g', ' ', '(', ')', '-', '.'];
        equal('1234567890 testing. 12345', '(123) 456-7890 testing. 12345', fixture);

        component.mask = '(000) 000-0000 prefix. 000';
        component.showMaskTyped = true;
        component.prefix = '+7';
        component.specialCharacters = ['p', 'r', 'e', 'f', 'i', 'x', ' ', '(', ')', '-', '.'];
        equal('1234567890 prefix. 345', '+7(123) 456-7890 prefix. 345', fixture);

        component.mask = '(000) 000-0000 cv. 000';
        component.showMaskTyped = true;
        component.prefix = 'card. ';
        component.specialCharacters = ['c', 'v', ' ', '(', ')', '-', '.'];
        equal('1234567890 cv. 134', 'card. (123) 456-7890 cv. 134', fixture);
    });

    // TODO(inepipenko) for issue #880
    xit('should work right with security input', () => {
        component.mask = '000-0X-XXXX';
        component.showMaskTyped = true;
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
        component.showMaskTyped = true;
        component.placeHolderCharacter = 'XXXXX-YYYY';
        component.mask = '00000-0000';
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
        component.showMaskTyped = true;
        component.placeHolderCharacter = 'dd/mm/yyyy';
        component.mask = '00/00/0000';
        equal('1', '1d/mm/yyyy', fixture);
        equal('12', '12/mm/yyyy', fixture);
        equal('123', '12/3m/yyyy', fixture);
        equal('1234', '12/34/yyyy', fixture);
        equal('12345', '12/34/5yyy', fixture);
        equal('123456', '12/34/56yy', fixture);
        equal('1234567', '12/34/567y', fixture);
        equal('12345678', '12/34/5678', fixture);
    });
});
