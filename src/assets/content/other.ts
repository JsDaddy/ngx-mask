import { UntypedFormControl } from '@angular/forms';
import type { ComDoc, MaskOptions, TExample } from '@open-source/accordion/content.types';

export const OthDocs: ComDoc[] = [
    {
        header: 'Secure input',
        text: 'You can hide symbols in input field and get the actual value in formcontrol',
        code: ` <input [hiddenInput]="true" mask="XXX/X0/0000">`,
        id: 1,
        anchor: 'secure',
    },
    {
        header: 'Pipe',
        text: 'Also you can use mask pipe',
        code: ` <span>{{phone | mask: '(000) 000-0000'}}</span>`,
        id: 2,
        anchor: 'pipe',
    },
    {
        header: 'specialCharacters',
        text: '',
        // eslint-disable-next-line no-useless-escape
        code: ` <input type='text' [specialCharacters]="[ '[' ,']' , '\\' ]" mask="[00]\[000]" >`,
        id: 3,
        anchor: 'special',
    },
    {
        header: '12 hour format',
        text: '',

        code: ` <input type='text'[apm]="true" mask="Hh:m0:s0" >`,
        id: 4,
        anchor: '12hour',
    },
    {
        header: 'Percent with decimalMarker ,',
        text: '',

        code: ` <input type='text'[decimalMarker]="','" mask="percent.2" >`,
        id: 5,
        anchor: 'percentDecimalMarker',
    },
];

export const OthExamples: (TExample<MaskOptions> | { _pipe: string })[] = [
    {
        _placeholder: 'Secure input',
        _hiddenInput: true,
        _mask: 'XXX/X0/0000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _pipe: '(000) 000-0000',
    },
    {
        _placeholder: 'specialCharacters',
        _specialCharacters: `[ '[' ,']' , '\\' ]`,
        _mask: '[00][000]',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: '12 hour format',
        _mask: 'Hh:m0:s0',
        _apm: true,
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: '12 hour format',
        _mask: 'percent.2',
        _decimalMarker: ',',
        control: { form: new UntypedFormControl(''), model: '' },
    },
];
