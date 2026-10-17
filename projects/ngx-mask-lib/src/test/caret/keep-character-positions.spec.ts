import { describe, expect, it } from 'vitest';

import type {
    KeepCharacterPositionsEdit,
    KeepCharacterPositionsResult,
    KeepCharacterPositionsState,
} from '../../lib/caret/keep-character-positions';
import { resolveKeepCharacterPositions } from '../../lib/caret/keep-character-positions';
import { MaskExpression } from '../../lib/ngx-mask-expression.enum';

const digitOnly = (symbol: string, maskSymbol: string): boolean =>
    maskSymbol === '0' && /\d/.test(symbol);

type Case = Partial<KeepCharacterPositionsState> & Partial<KeepCharacterPositionsEdit>;

function input(overrides: Case): Required<Case> {
    return {
        elValue: '',
        position: 0,
        code: 'Digit5',
        prefix: '',
        suffix: '',
        showMaskTyped: true,
        maskExpression: '00-00',
        maskIsShown: '__-__',
        placeHolderCharacter: '_',
        specialCharacters: ['-'],
        selStart: 0,
        selEnd: 0,
        actualValue: '',
        _checkSymbolMask: digitOnly,
        ...overrides,
    };
}

function resolve(c: Required<Case>): KeepCharacterPositionsResult {
    const { elValue, position, code, ...state } = c;
    return resolveKeepCharacterPositions(state, { elValue, position, code });
}

describe('resolveKeepCharacterPositions', () => {
    it('leaves a placeholder behind a backspaced character', () => {
        expect(
            resolve(input({ elValue: '12-4', position: 3, code: MaskExpression.BACKSPACE }))
        ).toEqual({ actualValue: '12-_4', position: 3, handled: true });
    });

    it('leaves a placeholder at a deleted character and steps past it', () => {
        expect(
            resolve(input({ elValue: '2-34', position: 0, code: MaskExpression.DELETE }))
        ).toEqual({ actualValue: '_2-34', position: 1, handled: true });
    });

    it('hands the deletion of the last character to regular masking without showMaskTyped', () => {
        expect(
            resolve(
                input({
                    elValue: '12-3',
                    position: 4,
                    code: MaskExpression.BACKSPACE,
                    showMaskTyped: false,
                    maskIsShown: '',
                })
            )
        ).toEqual({ actualValue: null, position: 4, handled: false });
    });

    it('blanks a deleted selection to the mask skeleton', () => {
        expect(
            resolve(
                input({
                    elValue: '-34',
                    position: 0,
                    code: MaskExpression.BACKSPACE,
                    selStart: 0,
                    selEnd: 2,
                })
            )
        ).toEqual({ actualValue: '__-34', position: 0, handled: true });
    });

    it('overwrites the first fillable slot with a typed symbol', () => {
        expect(resolve(input({ elValue: '5__-__', position: 1 }))).toEqual({
            actualValue: '5_-__',
            position: 1,
            handled: true,
        });
    });

    it('skips a special character to land the typed symbol', () => {
        expect(resolve(input({ elValue: '125-__', position: 3 }))).toEqual({
            actualValue: '12-5_',
            position: 4,
            handled: true,
        });
    });

    it('rejects a symbol the slot does not accept and keeps the display', () => {
        expect(resolve(input({ elValue: 'a__-__', position: 1 }))).toEqual({
            actualValue: null,
            position: 0,
            handled: true,
        });
    });

    it('rejects a symbol typed inside the prefix', () => {
        expect(resolve(input({ elValue: '5+1__', position: 1, prefix: '+1' }))).toEqual({
            actualValue: null,
            position: 0,
            handled: true,
        });
    });

    it('puts a symbol that replaced a selection into the first fillable slot of it', () => {
        expect(resolve(input({ elValue: '9-34', position: 1, selStart: 0, selEnd: 2 }))).toEqual({
            actualValue: '9_-34',
            position: 1,
            handled: true,
        });
    });

    it('hands a replaced whole value to regular masking without showMaskTyped', () => {
        expect(
            resolve(
                input({
                    elValue: '9',
                    position: 1,
                    selStart: 0,
                    selEnd: 5,
                    showMaskTyped: false,
                    maskIsShown: '',
                })
            )
        ).toEqual({ actualValue: null, position: 1, handled: false });
    });

    it('hands an append at the end to regular masking without showMaskTyped', () => {
        expect(
            resolve(input({ elValue: '12-3', position: 4, showMaskTyped: false, maskIsShown: '' }))
        ).toEqual({ actualValue: null, position: 4, handled: false });
    });
});
