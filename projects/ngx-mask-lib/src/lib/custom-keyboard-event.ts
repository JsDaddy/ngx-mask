declare let global: any;

const commonjsGlobal =
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
    if (!commonjsGlobal.KeyboardEvent) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        commonjsGlobal.KeyboardEvent = function (_eventType: any, _init: any) {};
    }
})();

export type CustomKeyboardEvent = KeyboardEvent;
