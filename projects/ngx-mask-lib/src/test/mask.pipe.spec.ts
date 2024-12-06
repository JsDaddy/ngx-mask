import { TestBed } from '@angular/core/testing';
import type { NgxMaskConfig } from 'ngx-mask';
import { NgxMaskDirective, provideNgxMask, NgxMaskPipe } from 'ngx-mask';

describe('Pipe: Mask', () => {
    let maskPipe: NgxMaskPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxMaskPipe],
            providers: [provideNgxMask(), NgxMaskDirective],
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
        const patterns: NgxMaskConfig['patterns'] = {
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
    it('should work with dynamicMask 0,00||00,00||000,00||0000,00||00.000,00', () => {
        const value: string | number = maskPipe.transform(
            '123',
            '0,00||00,00||000,00||0000,00||00.000,00'
        );
        const value1: string | number = maskPipe.transform(
            '1232',
            '0,00||00,00||000,00||0000,00||00.000,00'
        );
        const value2: string | number = maskPipe.transform(
            '12322',
            '0,00||00,00||000,00||0000,00||00.000,00'
        );
        const value3: string | number = maskPipe.transform(
            '123222',
            '0,00||00,00||000,00||0000,00||00.000,00'
        );
        const value4: string | number = maskPipe.transform(
            '1232222',
            '0,00||00,00||000,00||0000,00||00.000,00'
        );
        expect(value).toEqual('1,23');
        expect(value1).toEqual('12,32');
        expect(value2).toEqual('123,22');
        expect(value3).toEqual('1232,22');
        expect(value4).toEqual('12.322,22');
    });

    it('should work with dynamicMask 0000 0000 0000 0000||0000 0000 0000 0000 00||0000 0000 0000 0000 000', () => {
        const value: string | number = maskPipe.transform(
            '1234 1234 1234 1234',
            '0000 0000 0000 0000||0000 0000 0000 0000 00||0000 0000 0000 0000 000'
        );
        const value1: string | number = maskPipe.transform(
            '1234 1234 1234 1234 12',
            '0000 0000 0000 0000||0000 0000 0000 0000 00||0000 0000 0000 0000 000'
        );
        const value2: string | number = maskPipe.transform(
            '1234 1234 1234 1234 123',
            '0000 0000 0000 0000||0000 0000 0000 0000 00||0000 0000 0000 0000 000'
        );

        expect(value).toEqual('1234 1234 1234 1234');
        expect(value1).toEqual('1234 1234 1234 1234 12');
        expect(value2).toEqual('1234 1234 1234 1234 123');
    });

    it('should work with dynamicMask (00) 0000-0000||(00) 00000-0000', () => {
        const value: string | number = maskPipe.transform(
            '1234123412',
            '(00) 0000-0000||(00) 00000-0000'
        );
        const value1: string | number = maskPipe.transform(
            '12341234123',
            '(00) 0000-0000||(00) 00000-0000'
        );

        expect(value).toEqual('(12) 3412-3412');
        expect(value1).toEqual('(12) 34123-4123');
    });

    it('should work with custom pattern and hideInput', () => {
        const SSN_PATTERNS: NgxMaskConfig['patterns'] = {
            0: { pattern: new RegExp('\\d') },
            A: { pattern: new RegExp('\\d'), symbol: '●' },
        };
        const value: string | number = maskPipe.transform('1234122', 'AAA - AA - 0000', {
            hiddenInput: true,
            patterns: SSN_PATTERNS,
        });
        const value1: string | number = maskPipe.transform('123412', 'AAA - AA - 0000', {
            hiddenInput: true,
            patterns: SSN_PATTERNS,
        });
        const value2: string | number = maskPipe.transform('12341', 'AAA - AA - 0000', {
            hiddenInput: true,
            patterns: SSN_PATTERNS,
        });
        const value3: string | number = maskPipe.transform('1234', 'AAA - AA - 0000', {
            hiddenInput: true,
            patterns: SSN_PATTERNS,
        });
        const value4: string | number = maskPipe.transform('123', 'AAA - AA - 0000', {
            hiddenInput: true,
            patterns: SSN_PATTERNS,
        });
        const value5: string | number = maskPipe.transform('12', 'AAA - AA - 0000', {
            hiddenInput: true,
            patterns: SSN_PATTERNS,
        });
        const value6: string | number = maskPipe.transform('1', 'AAA - AA - 0000', {
            hiddenInput: true,
            patterns: SSN_PATTERNS,
        });
        expect(value).toEqual('●●● - ●● - 22');
        expect(value1).toEqual('●●● - ●● - 2');
        expect(value2).toEqual('●●● - ●●');
        expect(value3).toEqual('●●● - ●');
        expect(value4).toEqual('●●●');
        expect(value5).toEqual('●●');
        expect(value6).toEqual('●');
    });

    it('should work with repeatMask A{4}', () => {
        const value: string | number = maskPipe.transform('1234', 'A{4}');
        const value1: string | number = maskPipe.transform('1', 'A{4}');
        const value2: string | number = maskPipe.transform('12', 'A{4}');
        const value3: string | number = maskPipe.transform('123', 'A{4}');

        expect(value).toEqual('1234');
        expect(value1).toEqual('1');
        expect(value2).toEqual('12');
        expect(value3).toEqual('123');
    });

    it('should work with repeatMask A{4}', () => {
        const value: string | number = maskPipe.transform('1234', 'A{4}');
        const value1: string | number = maskPipe.transform('1', 'A{4}');
        const value2: string | number = maskPipe.transform('12', 'A{4}');
        const value3: string | number = maskPipe.transform('123', 'A{4}');

        expect(value).toEqual('1234');
        expect(value1).toEqual('1');
        expect(value2).toEqual('12');
        expect(value3).toEqual('123');
    });

    it('should work with repeatMask SS0{4}', () => {
        const value: string | number = maskPipe.transform('d', 'SS0{4}');
        const value1: string | number = maskPipe.transform('dd', 'SS0{4}');
        const value2: string | number = maskPipe.transform('dd1', 'SS0{4}');
        const value3: string | number = maskPipe.transform('dd12', 'SS0{4}');
        const value4: string | number = maskPipe.transform('dd123', 'SS0{4}');
        const value5: string | number = maskPipe.transform('dd1234', 'SS0{4}');

        expect(value).toEqual('d');
        expect(value1).toEqual('dd');
        expect(value2).toEqual('dd1');
        expect(value3).toEqual('dd12');
        expect(value4).toEqual('dd123');
        expect(value5).toEqual('dd1234');
    });

    it('should work with leadZero separator.2', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.2', {
            leadZero: true,
        });
        const value1: string | number = maskPipe.transform('1', 'separator.2', {
            leadZero: true,
        });
        const value2: string | number = maskPipe.transform('12', 'separator.2', {
            leadZero: true,
        });
        const value3: string | number = maskPipe.transform('123', 'separator.2', {
            leadZero: true,
        });

        expect(value).toEqual('3 000.00');
        expect(value1).toEqual('1.00');
        expect(value2).toEqual('12.00');
        expect(value3).toEqual('123.00');
    });

    it('should work with leadZero separator.3', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.3', {
            leadZero: true,
        });
        const value1: string | number = maskPipe.transform('1', 'separator.3', {
            leadZero: true,
        });
        const value2: string | number = maskPipe.transform('12', 'separator.3', {
            leadZero: true,
        });
        const value3: string | number = maskPipe.transform('123', 'separator.3', {
            leadZero: true,
        });

        expect(value).toEqual('3 000.000');
        expect(value1).toEqual('1.000');
        expect(value2).toEqual('12.000');
        expect(value3).toEqual('123.000');
    });

    it('should work with leadZero separator.2 thousandSeparator decimalMarker', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.2', {
            leadZero: true,
            thousandSeparator: '.',
            decimalMarker: ',',
        });
        expect(value).toEqual('3.000,00');
    });

    it('should work with leadZero separator.2 thousandSeparator decimalMarker', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.2', {
            leadZero: true,
            thousandSeparator: ',',
            decimalMarker: '.',
        });
        expect(value).toEqual('3,000.00');
    });

    it('should work with leadZero separator.3 thousandSeparator decimalMarker', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.3', {
            leadZero: true,
            thousandSeparator: '.',
            decimalMarker: ',',
        });
        expect(value).toEqual('3.000,000');
    });

    it('should work with leadZero separator.3 thousandSeparator decimalMarker', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.3', {
            leadZero: true,
            thousandSeparator: ',',
            decimalMarker: '.',
        });
        expect(value).toEqual('3,000.000');
    });

    it('should work with  separator.3 thousandSeparator decimalMarker', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.3', {
            thousandSeparator: ',',
            decimalMarker: '.',
        });
        expect(value).toEqual('3,000');
    });

    it('should work with  separator.2 thousandSeparator decimalMarker', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.3', {
            thousandSeparator: ',',
            decimalMarker: '.',
        });
        expect(value).toEqual('3,000');
    });

    it('should work with  separator.2 thousandSeparator decimalMarker', () => {
        const value: string | number = maskPipe.transform('3000', 'separator.3', {
            thousandSeparator: '.',
            decimalMarker: ',',
        });
        expect(value).toEqual('3.000');
    });

    it('should show second pipe without suffix', () => {
        const valueWithSuffix: string | number = maskPipe.transform('55555', '00 (000)', {
            suffix: ' DDD',
        });
        const valueWithPrefix: string | number = maskPipe.transform('55555', '00 (000)', {
            prefix: 'DDD ',
        });

        requestAnimationFrame(() => {
            expect(valueWithSuffix).toEqual('55 (555) DDD');
            expect(valueWithPrefix).toEqual('DDD 55 (555)');
        });
    });
});
