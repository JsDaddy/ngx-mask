import type { WritableSignal } from '@angular/core';
import type { FormControl } from '@angular/forms';
import type { FieldTree } from '@angular/forms/signals';

export type ComDoc = {
    header: string;
    text: string;
    code: string;
    /** Optional separate TypeScript code for better syntax highlighting */
    tsCode?: string;
    id: number;
    anchor?: string;
};

/**
 * Control configuration for examples.
 * The `initialValue` is used to create a signal at runtime.
 */
export type ControlConfig = {
    initialValue: string | null;
    model: string;
};

/**
 * Runtime control with all three form types.
 * - formControl: Reactive Forms (FormControl)
 * - model: Template-driven (ngModel signal)
 * - signalForm: Signal Forms (FieldTree)
 */
export type Control = {
    formControl: FormControl<string | null>;
    model: WritableSignal<string | null>;
    signalForm: FieldTree<{ value: string | null }>;
};

/**
 * Example configuration from content files.
 * Uses ControlConfig which stores initial value (created at module load time).
 */
export type ComExampleConfig = {
    _placeholder?: string;
    _mask: string;
    control: ControlConfig;
};

/**
 * Runtime example with FieldTree created in component.
 */
export type ComExample = {
    _placeholder?: string;
    _mask: string;
    control: Control;
};

export type TextContent = {
    content: string;
    id: number;
    scrollTo?: string;
};

export type ListItem = {
    header: string;
    id: number;
    text: TextContent[];
    defaultSvg?: string;
    activeSvg?: string;
    whiteChevron?: string;
    yellowChevron?: string;
};

export type MaskOptions = {
    _prefix: string;
    _suffix: string;
    _dropSpecialCharacters: boolean | string[];
    _showMaskTyped: boolean;
    _clearIfNotMatch: boolean;
    _shownMaskExpression: string;
    _validation: boolean;
    _allowNegativeNumbers: boolean;
    _hiddenInput: boolean;
    _leadZero: boolean;
    _specialCharacters: string | string[];
    _apm: boolean;
    _decimalMarker: string | string[];
    _thousandSeparator: string;
    _keepCharacterPositions: boolean;
    _inputTransformFn: InputTransformFn;
    _outputTransformFn: OutputTransformFn;
};

export type InputTransformFn = (value: unknown) => string | number;

export type OutputTransformFn = (value: string | number | undefined | null) => unknown;

/**
 * Type for content file examples (with ControlConfig).
 */
export type TExampleConfig<T extends object> = {
    [P in keyof T]: ComExampleConfig & Partial<Pick<T, P>>;
}[keyof T];

/**
 * Type for runtime examples (with FieldTree Control).
 */
export type TExample<T extends object> = {
    [P in keyof T]: ComExample & Partial<Pick<T, P>>;
}[keyof T];
