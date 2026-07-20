declare let global: typeof globalThis | undefined;

const commonjsGlobal: Record<string, unknown> =
    typeof globalThis !== 'undefined'
        ? globalThis
        : typeof window !== 'undefined'
          ? window
          : typeof global !== 'undefined'
            ? global
            : typeof self !== 'undefined'
              ? self
              : {};

(function () {
    if (!commonjsGlobal['KeyboardEvent']) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        commonjsGlobal['KeyboardEvent'] = function (_eventType: unknown, _init: unknown) {};
    }
})();

export type CustomKeyboardEvent = KeyboardEvent;
