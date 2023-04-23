import { UntypedFormControl } from '@angular/forms';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';

export const OthDocs: IComDoc[] = [
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
];

export const OthExamples: (TExample<IMaskOptions> | { _pipe: string })[] = [
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
];
