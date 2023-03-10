import { TestBed } from '@angular/core/testing';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskPipe } from '../lib/ngx-mask.pipe';
import { IConfig } from 'ngx-mask';

describe('Pipe: Mask', () => {
    let maskPipe: NgxMaskPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskPipe],
            providers: [provideNgxMask()],
        }).runInInjectionContext(() => {
            maskPipe = new NgxMaskPipe();
        });
    });

    it('should mask a string', () => {
        const maskedString: string = maskPipe.transform('abcdef', 'SS-SS-SS');

        expect(maskedString).toEqual('ab-cd-ef');
    });

    it('should mask a number', () => {
        const maskedNumber: string = maskPipe.transform(123456789, '999-999-999');

        expect(maskedNumber).toEqual('123-456-789');
    });

    it('should mask a number and string', () => {
        const maskedNumberAndString: string | number = maskPipe.transform('123abc', '09A/SAS');
        expect(maskedNumberAndString).toEqual('123/abc');
    });

    it('should custom pattern', () => {
        const patterns: IConfig['patterns'] = {
            P: {
                pattern: new RegExp('\\d'),
            },
        };
        const maskedNumber: string = maskPipe.transform(123456789, 'PPP-PP-PPP', { patterns });
        expect(maskedNumber).toEqual('123-45-678');
    });

    it('should mask a zero number', () => {
        const maskedNumberAndString: string | number = maskPipe.transform(0, '0');
        expect(maskedNumberAndString).toEqual('0');
    });

    it('should mask separator', () => {
        const value: string | number = maskPipe.transform('123123123', 'separator.0');
        expect(value).toEqual('123 123 123');
    });

    it('should mask separator with thousandSeparator .', () => {
        const value: string | number = maskPipe.transform('123123123', 'separator.0', {
            thousandSeparator: '.',
        });
        expect(value).toEqual('123.123.123');
    });

    it('should mask separator with thousandSeparator ,', () => {
        const value: string | number = maskPipe.transform('123123123', 'separator.0', {
            thousandSeparator: ',',
        });
        expect(value).toEqual('123,123,123');
    });

    it('should mask separator.2 with thousandSeparator ,', () => {
        const value: string | number = maskPipe.transform('12312312.3', 'separator.2', {
            thousandSeparator: ',',
        });
        expect(value).toEqual('12,312,312.3');
    });

    it('should work with *', () => {
        let value: string | number = maskPipe.transform("11'1", "0*'09");
        expect(value).toEqual("11'1");
        value = maskPipe.transform('111111', "0*'09");
        expect(value).toEqual('111111');
    });

    it('should work with suffix', () => {
        const value: string | number = maskPipe.transform("11'1", "0*'09", { suffix: ' sm' });
        expect(value).toEqual("11'1 sm");
    });

    it('should work with suffix', () => {
        const value: string | number = maskPipe.transform("11'111", '00-00', {
            dropSpecialCharacters: true,
        });
        expect(value).toEqual('11-11');
    });
    it('should work with showMaskTyped', () => {
        const value: string | number = maskPipe.transform('11', '00-00', {
            showMaskTyped: true,
        });
        expect(value).toEqual('11-__');
    });
    it('should work with showMaskTyped', () => {
        const value: string | number = maskPipe.transform('12312312', '(000)-00-00', {
            prefix: '+380 ',
        });
        expect(value).toEqual('+380 (123)-12-31');
    });
    it('should work with shownMaskExpression', () => {
        const value: string | number = maskPipe.transform('12312312', '(000)-00-00', {
            prefix: '+380 ',
        });
        expect(value).toEqual('+380 (123)-12-31');
    });
    //TODO(inepipepnko): need cover all config options
});
