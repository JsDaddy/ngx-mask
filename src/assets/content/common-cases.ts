import { UntypedFormControl } from '@angular/forms';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';

export const ComDocs: IComDoc[] = [
    {
        header: 'Date',
        text: '',
        code: `<input matInput mask="00/00/0000"/>`,
        id: 1,
        anchor: 'date',
    },
    {
        header: 'Date and hour',
        text: '',
        code: `<input matInput mask="00/00/00 00:00:00" />`,
        id: 2,
        anchor: 'date-and-hour',
    },
    {
        header: 'Hour',
        text: '',
        code: `<input matInput mask="00:00:00" />`,
        id: 3,
        anchor: 'hour',
    },
    {
        header: 'Valid 24 hour format',
        text: '',
        code: `<input matInput mask="Hh:m0:s0" />`,
        id: 4,
        anchor: 'valid24',
    },
    {
        header: 'Mixed types',
        text: '',
        code: `<input matInput mask="AAA 000-S0S" />`,
        id: 5,
        anchor: 'mixed',
    },
    {
        header: 'Valid date and month',
        text: '',
        code: `<input matInput mask="d0/M0/0000" />`,
        id: 6,
        anchor: 'validdate',
    },
    {
        header: 'Valid date start with years',
        text: '',
        code: `<input matInput mask="0000.M0.d0" />`,
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
];

export const ComExamples: TExample<IMaskOptions>[] = [
    {
        _placeholder: 'Date',
        _mask: '00/00/0000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Date and Hour',
        _mask: '00/00/00 00:00:00',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Hour',
        _mask: '00:00:00',
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
        _placeholder: 'Valid date and month',
        _mask: 'd0/M0/0000',
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
];
