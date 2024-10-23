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
        id: 2,
        anchor: 'lead-zero',
    },
    {
        header: 'Dot separator',
        text: 'For separate input with dots',
        code: `<input type='text' mask="separator" thousandSeparator="." decimalMarker="," />`,
        id: 3,
        anchor: 'Dsep',
    },
    {
        header: 'Comma separator',
        text: `For separate input with commas`,
        code: `<input type='text' mask="separator" thousandSeparator="," decimalMarker="." />`,
        id: 4,
        anchor: 'comma_sep',
    },
    {
        header: 'Zero separator',
        text: 'You can divide your input by thousands',
        code: `<input type='text' mask="separator.0">`,
        id: 5,
        anchor: 'sep0',
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
        _leadZero: true,
        _mask: 'separator.2',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator',
        _mask: 'separator',
        _thousandSeparator: '.',
        _decimalMarker: ',',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator',
        _mask: 'separator',
        _thousandSeparator: ',',
        _decimalMarker: '.',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator.0',
        _mask: 'separator.0',
        control: { form: new UntypedFormControl(''), model: '' },
    },
];
