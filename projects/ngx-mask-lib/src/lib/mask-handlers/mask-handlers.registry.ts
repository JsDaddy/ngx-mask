import { MaskExpression } from '../ngx-mask-expression.enum';
import type { NgxMaskApplierService } from '../ngx-mask-applier.service';
import { cpfCnpjHandler } from './cpf-cnpj.handler';
import { genericPatternHandler } from './generic-pattern.handler';
import { ipHandler } from './ip.handler';
import type { MaskHandlerEntry, MaskHandlerParams, MaskHandlerState } from './mask-handler.types';
import { percentHandler } from './percent.handler';
import { separatorHandler } from './separator.handler';

/** Ordered dispatch table. Exact-match entries (IP, CPF_CNPJ) MUST precede
 *  startsWith entries (PERCENT, SEPARATOR) — mirrors the original `if/else if` order
 *  and preserves the exact-before-substring guarantee (CODEBASE_NOTES #3/#4).
 *  `terminal: false` = pre-processor (rewrites mask, falls through to generic loop);
 *  `terminal: true` = resolves `result` and skips the generic loop. */
type RegistryEntry = MaskHandlerEntry & {
    readonly terminal: boolean;
};

const MASK_HANDLERS: readonly RegistryEntry[] = [
    {
        id: 'ip',
        terminal: false,
        match: (maskExpression) => maskExpression === MaskExpression.IP,
        handle: ipHandler,
    },
    {
        id: 'cpf-cnpj',
        terminal: false,
        match: (maskExpression) =>
            maskExpression === MaskExpression.CPF_CNPJ ||
            maskExpression === MaskExpression.CPF_CNPJ_ALPHA,
        handle: cpfCnpjHandler,
    },
    {
        id: 'percent',
        terminal: true,
        match: (maskExpression) => maskExpression.startsWith(MaskExpression.PERCENT),
        handle: percentHandler,
    },
    {
        id: 'separator',
        terminal: true,
        match: (maskExpression) => maskExpression.startsWith(MaskExpression.SEPARATOR),
        handle: separatorHandler,
    },
];

/** Runs mask-type dispatch: first matching entry wins. IP/CPF_CNPJ pre-process then
 *  fall through to the generic loop; PERCENT/SEPARATOR resolve terminally; no match →
 *  generic loop directly (the original `else`). IP and CPF_CNPJ are mutually exclusive
 *  exact matches, so scanning the ordered table is behavior-identical to the original
 *  IP → CPF_CNPJ → PERCENT → SEPARATOR → else chain. */
export function dispatchMaskHandler(
    self: NgxMaskApplierService,
    state: MaskHandlerState,
    params: MaskHandlerParams
): MaskHandlerState {
    for (const entry of MASK_HANDLERS) {
        if (entry.match(state.maskExpression)) {
            const next = entry.handle.call(self, state, params);
            return entry.terminal ? next : genericPatternHandler.call(self, next, params);
        }
    }
    return genericPatternHandler.call(self, state, params);
}
