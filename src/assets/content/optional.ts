import { UntypedFormControl } from '@angular/forms';
import type { ComDoc, MaskOptions, TExample } from '@open-source/accordion/content.types';

export const OptDocs: ComDoc[] = [
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
    {
        header: 'Keep Character Positions',
        text: 'You can validate your formControl, default value is true',
        code: ` <input type='text' mask="000-000-000" [showMaskTyped]="true" [keepCharacterPositions]="true">`,
        id: 7,
        anchor: 'keep000',
    },
    {
        header: 'Keep Character Positions',
        text: 'You can validate your formControl, default value is true',
        code: ` <input type='text' mask="00/00/0000" [showMaskTyped]="true" [keepCharacterPositions]="true">`,
        id: 7,
        anchor: 'keep000',
    },
    {
        header: 'Keep Character Positions',
        text: 'You can validate your formControl, default value is true',
        code: ` <input type='text' mask="0000 0000 0000 0000" [showMaskTyped]="true" [keepCharacterPositions]="true">`,
        id: 7,
        anchor: 'keep000',
    },
    {
        header: 'Keep Character Positions',
        text: 'You can validate your formControl, default value is true',
        code: ` <input type='text' mask="0 000" [suffix]="'$'" [showMaskTyped]="true" [keepCharacterPositions]="true">`,
        id: 7,
        anchor: 'keep000',
    },
    {
        header: 'Keep Character Positions',
        text: 'You can validate your formControl, default value is true',
        code: ` <input type='text' mask="0000.00" [prefix]="'$'" [showMaskTyped]="true" [keepCharacterPositions]="true">`,
        id: 7,
        anchor: 'keep000',
    },
];

export const OptExamples: TExample<MaskOptions>[] = [
    {
        _placeholder: 'prefix',
        _prefix: '+7 ',
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
        _prefix: '+7',
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
        _mask: '00 00',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _showMaskTyped: true,
        _keepCharacterPositions: true,
        _mask: '000-000-000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _showMaskTyped: true,
        _keepCharacterPositions: true,
        _mask: '00/00/0000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _showMaskTyped: true,
        _keepCharacterPositions: true,
        _mask: '0000 0000 0000 0000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _showMaskTyped: true,
        _keepCharacterPositions: true,
        _suffix: '$',
        _mask: '0 000',
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _showMaskTyped: true,
        _keepCharacterPositions: true,
        _prefix: '$',
        _mask: '0000.00',
        control: { form: new UntypedFormControl(''), model: '' },
    },
];
