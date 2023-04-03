import { UntypedFormControl } from '@angular/forms';

export interface IComDoc {
    header: string;
    text: string;
    code: string;
    id: number;
    anchor?: string;
}

export interface IControl {
    form: UntypedFormControl;
    model: string;
}

export interface IComExample {
    _placeholder: string;
    _mask: string;
    control: IControl;
}

export interface ITextContent {
    content: string;
    id: number;
    scrollTo?: string;
}

export interface IListItem {
    header: string;
    id: number;
    text: ITextContent[];
    defaultSvg?: string;
    activeSvg?: string;
}

export interface IMaskOptions {
    _prefix: string;
    _suffix: string;
    _dropSpecialCharacters: boolean;
    _showMaskTyped: boolean;
    _clearIfNotMatch: boolean;

    _validation: boolean;

    _hiddenInput: boolean;

    _specialCharacters: string;

    _thousandSeparator: string;
}

export type TExample<T extends object> = {
    [P in keyof T]: IComExample & Partial<Pick<T, P>>;
}[keyof T];
