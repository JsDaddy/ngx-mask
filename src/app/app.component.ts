import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
type SN = string | number;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    public mask: string = '';
    public phone: number = 123456789;
    public customMaska: [string, pattern];

    public form: FormControl;
    public form1: FormControl;
    public formDate: FormControl;
    public cpfFormControl: FormControl;
    public clearIfNotMatch: FormControl;
    public numberOrStringForm: FormControl;
    public sufixForm: FormControl;
    public repeatForm: FormControl;
    public separatorForm: FormControl;
    public percent: FormControl;
    public formSecureInput: FormControl;

    public pattern: pattern = {
        P: {
            pattern: new RegExp('\\d'),
        },
    };

    public numberOrStringFormModel: SN = '';
    public clearIfNotMatchModel: SN = '';
    public formModelDate: SN = '';
    public secureMask: SN = '';
    public cpfModel: SN = '';
    public dateModel: SN = '';
    public showMaskModel: SN = '';
    public suf: string = '+7';
    public sufixModel!: SN;
    public repeatFormModel!: SN;
    public separatorFormModel!: SN;
    public dotSeparatorFormModel!: SN;
    public dotPrecisionSeparatorFormModel: SN = '';
    public dotZeroPrecisionSeparatorFormModel!: SN;
    public commaSeparatorFormModel!: SN;
    public commaPrecisionSeparatorFormModel: SN = '';
    public commaZeroPrecisionSeparatorFormModel!: SN;
    public dotSeparatorForm!: FormControl;
    public dotPrecisionSeparatorForm!: FormControl;
    public dotZeroPrecisionSeparatorForm!: FormControl;
    public commaSeparatorForm!: FormControl;
    public commaPrecisionSeparatorForm!: FormControl;
    public commaZeroPrecisionSeparatorForm!: FormControl;

    public constructor() {
        this.form = new FormControl('');
        this.form1 = new FormControl('');
        this.formDate = new FormControl('');
        this.formSecureInput = new FormControl('');
        this.cpfFormControl = new FormControl();
        this.clearIfNotMatch = new FormControl();
        this.numberOrStringForm = new FormControl();
        this.sufixForm = new FormControl('');
        this.repeatForm = new FormControl('');
        this.separatorForm = new FormControl('');
        this.dotSeparatorForm = new FormControl('');
        this.dotPrecisionSeparatorForm = new FormControl(0);
        this.dotZeroPrecisionSeparatorForm = new FormControl('');
        this.commaSeparatorForm = new FormControl('');
        this.commaPrecisionSeparatorForm = new FormControl(0);
        this.commaZeroPrecisionSeparatorForm = new FormControl('');
        this.percent = new FormControl('');

        this.customMaska = ['PPP-PPP-PPP', this.pattern];

        // tslint:disable-next-line
        this.form1.valueChanges.subscribe((x: any) => console.log('Value', x));
    }
}

type pattern = {
    [character: string]: {
        pattern: RegExp;
    };
};
