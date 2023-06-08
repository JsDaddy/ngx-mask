import { UntypedFormControl } from '@angular/forms';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';

export const SepDocs: IComDoc[] = [
    {
        header: 'Thousand separator',
        text: 'You can divide your input by thousands',
        code: `<input type='text' mask="separator">`,
        id: 1,
        anchor: 'sep',
    },
    {
        header: 'Lead zero at model',
        text: 'You can divide your input by thousands',
        code: `<input type='text' mask="separator.2" [leadZero]="true">`,
        id: 4,
        anchor: 'lead-zero',
    },
    {
        header: 'Dot separator',
        text: 'For separate input with dots',
        code: `<input type='text' mask="separator" thousandSeparator="."/>`,
        id: 2,
        anchor: 'Dsep',
    },
    {
        header: 'Dot separator',
        text: `For limiting decimal precision add ',' and the precision you want to limit too on the input. 2 is useful for currency. 0 will prevent decimals completely.`,
        code: `<input type='text' mask="separator.2" thousandSeparator="."/>`,
        id: 2,
    },
    {
        header: 'Dot separator',
        text: 'without decimal part',
        code: `<input type='text' mask="separator.0" thousandSeparator="."/>`,
        id: 2,
    },
    {
        header: 'Comma separator',
        text: `For separate input with commas`,
        code: `<input type='text' mask="separator" thousandSeparator=","/>`,
        id: 3,
        anchor: 'comma_sep',
    },
    {
        header: 'Comma separator',
        text: `For limiting decimal precision add '.' and the precision you want to limit too on the input. 2 is useful for currency. 0 will prevent decimals completely.`,
        code: `<input type='text' mask="separator.2" thousandSeparator=","/>`,
        id: 3,
    },
    {
        header: 'Comma separator',
        text: 'without decimal part',
        code: `<input type='text' mask="separator.0" thousandSeparator=","/>`,
        id: 3,
    },
];

export const SepExamples: TExample<IMaskOptions>[] = [
    {
        _placeholder: 'Separator',
        _mask: 'separator',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Separator 2 leadZero',
        _mask: 'separator.2',
        _leadZero: true,
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator',
        _mask: 'separator',
        _thousandSeparator: '.',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator.2',
        _mask: 'separator.2',
        _thousandSeparator: '.',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator.0',
        _mask: 'separator.0',
        _thousandSeparator: '.',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator',
        _mask: 'separator',
        _thousandSeparator: ',',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator.2',
        _mask: 'separator.2',
        _thousandSeparator: ',',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator.0',
        _mask: 'separator.0',
        _thousandSeparator: ',',
        control: { form: new UntypedFormControl(''), model: '' },
    },
];
