import type { NgxMaskApplierService } from '../ngx-mask-applier.service';

/** Mutable per-call state threaded through one applyMask invocation. Instance
 *  config/`_shift`/`plusOnePosition` stay on the service, reached via `this`. */
export type MaskHandlerState = {
    processedValue: string;
    processedPosition: number;
    cursor: number;
    result: string;
    multi: boolean;
    backspaceShift: boolean;
    shift: number;
    stepBack: boolean;
    /** SEPARATOR `typeFromDecimals` already called `cb()` and produced the final
     *  string — `applyMask` returns this verbatim, skipping shared post-processing. */
    earlyReturn?: string;
    /** Possibly rewritten mask expression — IP/CPF_CNPJ rewrite it in place. */
    maskExpression: string;
};

/** Read-only call parameters that do not mutate during a handler. */
export type MaskHandlerParams = {
    readonly inputValue: string;
    readonly position: number;
    readonly justPasted: boolean;
    readonly backspaced: boolean;
    readonly cb: (...args: any[]) => any;
    readonly inputArray: string[];
    /** digit-only array (CPF_CNPJ length check). */
    readonly arr: string[];
    readonly startsWithPrefix: boolean;
    readonly prefixAlreadyRemovedByCaller: boolean;
};

/** A handler transforms `state` (mutates and returns it). `this` is bound to the
 *  calling service via `.call(this, ...)` — handlers read instance state (config,
 *  `_shift`, `actualValue`, `writingValue`, `plusOnePosition`, ...), so they are
 *  `function` methods, not free functions. */
export type MaskHandlerFn = (
    this: NgxMaskApplierService,
    state: MaskHandlerState,
    params: MaskHandlerParams
) => MaskHandlerState;

/** Discriminator entry. `match` is checked in registration order — exact-match
 *  entries MUST precede `startsWith` entries (H-substring collision, CODEBASE_NOTES #3/#4). */
export type MaskHandlerEntry = {
    readonly id: string;
    readonly match: (maskExpression: string) => boolean;
    readonly handle: MaskHandlerFn;
};
