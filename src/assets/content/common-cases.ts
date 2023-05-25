import { UntypedFormControl } from '@angular/forms';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';

export const ComDocs: IComDoc[] = [
    {
        header: 'Date',
        text: '',
        code: `<input mask="d0/M0/0000" />`,
        id: 1,
        anchor: 'date',
    },
    {
        header: 'Date and hour',
        text: '',
        code: `<input mask="d0/M0/0000 Hh:m0:s0" />`,
        id: 2,
        anchor: 'date-and-hour',
    },
    {
        header: 'Valid 24 hour format',
        text: '',
        code: `<input mask="Hh:m0:s0" />`,
        id: 4,
        anchor: 'valid24',
    },
    {
        header: 'Mixed types',
        text: '',
        code: `<input mask="AAA 000-S0S" />`,
        id: 5,
        anchor: 'mixed',
    },
    {
        header: 'Valid date start with years',
        text: '',
        code: `<input mask="0000.M0.d0" />`,
        id: 9,
        anchor: 'startWithYears',
    },
    {
        header: 'Mask with specialCharacters',
        text: '',
        code: `<input
        showMaskTyped="true"
        [specialCharacters]="['e', 'x', 't', ' ', '(', ')', '-', '.']"
        shownMaskExpression="'(___) ___-____ ext. ______'"
        mask="(000) 000-0000 ext. 000000"
        >`,
        id: 7,
        anchor: 'mask-specialCharacters',
    },
    {
        header: 'Dynamic mask',
        text: '',
        code: `<input type='text' mask="(00) 00000000||+00 (00) 00000000" >`,
        id: 8,
        anchor: 'dynamic-mask',
    },
    {
        header: 'Optional mask',
        text: '',
        code: `<input type='text' mask="9999 999 999" >`,
        id: 12,
        anchor: 'optional-mask',
    },
    {
        header: 'Allow negative numbers to mask',
        text: 'You can allow negative numbers',
        code: ` <input type='text' mask="0000" [allowNegativeNumbers]="true">`,
        id: 11,
        anchor: 'allowMask',
    },
    {
        header: 'Allow negative numbers to separator',
        text: 'You can allow negative numbers to',
        code: ` <input type='text' mask="separator" [allowNegativeNumbers]="true">`,
        id: 11,
        anchor: 'allowSeparator',
    },
    {
        header: 'Allow negative numbers to percent',
        text: 'You can allow negative numbers',
        code: ` <input type='text' mask="percent.2" [allowNegativeNumbers]="true">`,
        id: 11,
        anchor: 'allowPercent',
    },
];

export const ComExamples: TExample<IMaskOptions>[] = [
    {
        _placeholder: 'Date',
        _mask: 'd0/M0/0000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Date and Hour',
        _mask: 'd0/M0/0000 Hh:m0:s0',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Valid 24 hour format',
        _mask: 'Hh:m0:s0',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Mixed Type',
        _mask: 'AAA 000-S0S',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Valid date start with years',
        _mask: '0000.M0.d0',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Mask with specialCharacters',
        _mask: '(000) 000-0000 ext. 000000',
        _showMaskTyped: true,
        _shownMaskExpression: '(___) ___-____ ext. ______',
        _specialCharacters: ['e', 'x', 't', ' ', '(', ')', '-', '.'],
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Dynamic',
        _mask: '(00) 00000000||+00 (00) 00000000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Optional mask',
        _mask: '9999 999 999',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'allowNegativeNumbers mask',
        _allowNegativeNumbers: true,
        _mask: '0000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'allowNegativeNumbers separator',
        _allowNegativeNumbers: true,
        _mask: 'separator',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'allowNegativeNumbers percent',
        _allowNegativeNumbers: true,
        _mask: 'percent.2',
        control: { form: new UntypedFormControl(''), model: '' },
    },
];
