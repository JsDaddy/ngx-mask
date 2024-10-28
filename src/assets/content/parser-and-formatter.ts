import { UntypedFormControl } from '@angular/forms';
import { ComDoc, MaskOptions, TExample } from '@open-source/accordion/content.types';

export const ParserAndFormatterDocs: ComDoc[] = [
    {
        header: 'toUpperCase',
        text: 'You can hide symbols in input field and get the actual value in formcontrol',
        code: ` <input
                    [inputTransformFn]="inputTransformFn" 
                    [outputTransformFn]="outputTransformFn"
                    mask="S*"
                 /> 
        
        
       
        public inputTransformFn = (value: unknown): string =>
             typeof value === 'string' ? value.toUpperCase() : String(value);
     
         public outputTransformFn = (value: string | number | null | undefined): string => {
            return value ? String(value).toUpperCase() : ''
         };
    };
`,
        id: 1,
        anchor: 'toUpperCase',
    },
    {
        header: 'to date',
        text: 'Also you can use mask pipe',
        code: ` <input
                    mask="Hh:m0"
                    [dropSpecialCharacters]="false"
                    [inputTransformFn]="_format"
                    [outputTransformFn]="_parser"
                 />
                 
        public date = new Date();

         public _format = (value: unknown): string => {
        if (typeof value !== 'object') {
            return String(value);
        } 
            return  $ {String(this.date.getHours()).padStart(2, '0')}$ {String(
                this.date.getMinutes()
            ).padStart(2, '0')};
        };
        
        public _parser = (value: string | number | undefined | null) => {
             if (value) {
                const fetch = new Date();
                const values = String(value).split(':');
                if (values.length >= 2) {
                    const hour = Number(values[0]);
                    const minuts = Number(values[1]);
                    fetch.setHours(hour);
                    fetch.setMinutes(minuts);
                }
                fetch.setSeconds(0);
                return fetch.toString();
             }
            return;
         };
`,
        id: 2,
        anchor: 'to_date',
    },
    {
        header: 'replace dot',
        text: '',

        code: ` <input type='text' mask="separator.2" [outputTransformFn]="replaceDot"
        public replaceDot = (value: string | number | undefined | null): string => {
            if (String(value).includes('.')) {
                return String(value).replace('.', ',');
            }
            return String(value);
        }; />`,
        id: 3,
        anchor: 'replace_dot',
    },
    {
        header: 'toFixed(2)',
        text: '',

        code: ` <input type="text" mask="separator.3" [outputTransformFn]="toFixed" />
        public toFixed = (value: string | number | undefined | null): number => {
            const formattedValue = String(value).split(' ').join('');
            if (String(value).includes('.') && String(value).split('.').length === 2) {
                const decimal = String(value).split('.')[1]?.length;
                if (decimal && decimal > 2) {
                    return Number(parseFloat(formattedValue).toFixed(2));
                }
            }
            return Number(formattedValue);
        };
`,
        id: 4,
        anchor: 'toFixed',
    },
];

export const FormatAndParserExamples: TExample<MaskOptions>[] = [
    {
        _placeholder: 'S*',
        _mask: 'S*',
        _inputTransformFn: (value: unknown): string => String(value).toUpperCase(),
        _outputTransformFn: (value: string | number | undefined | null): string =>
            String(value).toUpperCase(),
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'Hh:m0',
        _mask: 'Hh:m0',
        _dropSpecialCharacters: false,
        _inputTransformFn: (value: unknown): string => {
            if (typeof value !== 'object') {
                return String(value);
            }
            return `${String((value as Date).getHours()).padStart(2, '0')}${String(
                (value as Date).getMinutes()
            ).padStart(2, '0')}`;
        },
        _outputTransformFn: (value: string | number | undefined | null) => {
            if (value) {
                const fetch = new Date();
                const values = String(value).split(':');
                if (values.length >= 2) {
                    const hour = Number(values[0]);
                    const minuts = Number(values[1]);
                    fetch.setHours(hour);
                    fetch.setMinutes(minuts);
                }
                fetch.setSeconds(0);
                return fetch.toString();
            }
            return;
        },
        control: {
            form: new UntypedFormControl(new Date()),
            model: new Date() as never,
        },
    },
    {
        _placeholder: 'separator.2',
        _mask: 'separator.2',
        _inputTransformFn: (value: unknown): string => String(value),
        _outputTransformFn: (value: string | number | undefined | null): string => {
            if (String(value).includes('.')) {
                return String(value).split(' ').join('').replace('.', ',');
            }
            return String(value).split(' ').join('');
        },
        control: { form: new UntypedFormControl(''), model: '' },
    },
    {
        _placeholder: 'separator.3',
        _mask: 'separator.3',
        _inputTransformFn: (value: unknown): string => String(value),
        _outputTransformFn: (value: string | number | undefined | null): number => {
            const formattedValue = String(value).split(' ').join('');
            if (String(value).includes('.') && String(value).split('.').length === 2) {
                const decimal = String(value).split('.')[1]?.length;
                if (decimal && decimal > 2) {
                    return Number(parseFloat(formattedValue).toFixed(2));
                }
            }
            return Number(formattedValue);
        },
        control: { form: new UntypedFormControl(''), model: '' },
    },
];
