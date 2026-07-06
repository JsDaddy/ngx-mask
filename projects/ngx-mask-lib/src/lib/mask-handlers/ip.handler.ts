import { MaskExpression } from '../ngx-mask-expression.enum';
import type { MaskHandlerFn } from './mask-handler.types';

/** IP pre-processor (moved verbatim from applyMask). Sets `this.ipError`, rewrites
 *  the mask to `099.099.099.099`, then falls through to the generic loop. */
export const ipHandler: MaskHandlerFn = function (state) {
    const valuesIP = state.processedValue.split(MaskExpression.DOT);
    this.ipError = this._validIP(valuesIP);

    state.maskExpression = '099.099.099.099';
    return state;
};
