import { UntypedFormControl } from '@angular/forms';
import { IComDoc, IMaskOptions, TExample } from './content.interfaces';

export const OptDocs: IComDoc[] = [
    {
        header: 'Prefix (string)',
        text: 'You can add prefix to you masked value',
        code: `<input type='text' prefix="+7 " mask="(000) 000 00 00" >`,
        id: 1,
        anchor: 'prefix',
    },
    {
        header: 'Suffix (string)',
        text: 'You can add suffix to you masked value',
        code: `<input type='text' suffix=" $" mask="0000" >`,
        id: 2,
        anchor: 'suffix',
    },
    {
        header: 'dropSpecialCharacters (boolean)',
        text: 'You can choose if mask will drop special character in the model, or not, default value true',
        code: `<input type='text' [dropSpecialCharacters]="false" mask="000-000.00" >`,
        id: 3,
        anchor: 'special-ch',
    },
    {
        header: 'showMaskTyped (boolean)',
        text: 'You can choose if mask is shown while typing, or not, default value false',
        code: ` <input mask="(000) 000-0000" prefix="+7" [showMaskTyped] = "true">`,
        id: 4,
        anchor: 'show-mask',
    },
    {
        header: 'clearIfNotMatch (boolean)',
        text: 'You can choose clear the input if the input value not match the mask, default value false',
        code: `<input type='text' [clearIfNotMatch]="true" mask="000-000.00" >`,
        id: 5,
        anchor: 'clear',
    },
    {
        header: 'FormControl validation',
        text: 'You can validate your formControl, default value is true',
        code: ` <input type='text' mask="00 00" [validation]="true">`,
        id: 6,
        anchor: 'valid',
    },
];

export const OptExamples: TExample<IMaskOptions>[] = [
    {
        _placeholder: 'prefix',
        _prefix: '+75',
        _mask: '(00) 000 000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'suffix',
        _suffix: ' $',
        _mask: '0 000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'dropSpecialCharacters',
        _dropSpecialCharacters: false,
        _mask: '000-000.00',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'showMaskTyped',
        _showMaskTyped: true,
        _mask: '(000) 000-0000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'clearIfNotMatch',
        _clearIfNotMatch: true,
        _mask: '000-000.00',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'validation',
        _validation: true,
        _mask: '000-000.00',
        control: { form: new UntypedFormControl(''), model: '' },
    },
];
