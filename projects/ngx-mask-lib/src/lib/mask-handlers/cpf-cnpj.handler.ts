import { MaskExpression } from '../ngx-mask-expression.enum';
import type { MaskHandlerFn } from './mask-handler.types';

/** CPF_CNPJ / CPF_CNPJ_ALPHA pre-processor (moved verbatim from applyMask). Sets
 *  `this.cpfCnpjError`, rewrites the mask, then falls through to the generic loop.
 *  Discriminated by exact equality BEFORE any startsWith handler — the 'H' of HOURS
 *  would otherwise catch CPF_CNPJ_ALPHA by substring (CODEBASE_NOTES #3/#4). */
export const cpfCnpjHandler: MaskHandlerFn = function (state, params) {
    const isCpfCnpjAlpha = state.maskExpression === MaskExpression.CPF_CNPJ_ALPHA;
    this.cpfCnpjError = params.arr.length !== 11 && params.arr.length !== 14;
    const valueHasAnyLetter = /[a-zA-Z]/.test(state.processedValue);
    if (valueHasAnyLetter && isCpfCnpjAlpha) {
        state.maskExpression = 'AA.AAA.AAA/AAAA-00';
    } else if (params.arr.length > 11) {
        state.maskExpression = isCpfCnpjAlpha ? 'AA.AAA.AAA/AAAA-00' : '00.000.000/0000-00';
    } else {
        state.maskExpression = '000.000.000-00';
    }
    return state;
};
