import { UntypedFormControl } from '@angular/forms';
import { IComDoc, IMaskOptions, TExample } from './content.interfaces';

export const ComDocs: IComDoc[] = [
    {
        header: 'Date',
        text: '',
        code: `<input matInput mask="00/00/0000"/>`,
        id: 1,
        anchor: 'prefix',
    },
    {
        header: 'Date and hour',
        text: '',
        code: `<input matInput mask="00/00/00 00:00:00" />`,
        id: 2,
        anchor: 'date',
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
        header: 'Dynamic mask',
        text: '',
        code: `<input type='text' mask="(00) 00000000||+00 (00) 00000000" >`,
        id: 7,
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
        _placeholder: 'Dynamic',
        _mask: '(00) 00000000||+00 (00) 00000000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
];
