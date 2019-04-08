/** Just copy-paste on native KeyboardEvent interface for SSR */
export interface IKeyboardEvent extends UIEvent {
  readonly altKey: boolean;
  /** @deprecated */
  char: string;
  /** @deprecated */
  readonly charCode: number;
  readonly code: string;
  readonly ctrlKey: boolean;
  readonly key: string;
  /** @deprecated */
  readonly keyCode: number;
  readonly location: number;
  readonly metaKey: boolean;
  readonly repeat: boolean;
  readonly shiftKey: boolean;
  /** @deprecated */
  readonly which: number;
  readonly DOM_KEY_LOCATION_JOYSTICK: number;
  readonly DOM_KEY_LOCATION_LEFT: number;
  readonly DOM_KEY_LOCATION_MOBILE: number;
  readonly DOM_KEY_LOCATION_NUMPAD: number;
  readonly DOM_KEY_LOCATION_RIGHT: number;
  readonly DOM_KEY_LOCATION_STANDARD: number;
  getModifierState(keyArg: string): boolean;
  /** @deprecated */
  initKeyboardEvent(
    typeArg: string,
    canBubbleArg: boolean,
    cancelableArg: boolean,
    viewArg: Window,
    keyArg: string,
    locationArg: number,
    modifiersListArg: string,
    repeat: boolean,
    locale: string
  ): void;
}
