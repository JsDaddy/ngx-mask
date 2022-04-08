import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

type SN = string | number;

interface IPattern {
	[character: string]: {
		pattern: RegExp;
	};
}

@Component({
	templateUrl: './showcase.component.html',
})
export class ShowcaseComponent {
	public mask: string = '';

	public phone: number = 123456789;

	public customMaska: [string, IPattern];

	public pipeSeparatorValue: string = '123456789';

	public cControl = new FormControl(1);

	public form: FormControl;

	public form1: FormControl;

	public formDate: FormControl;

	public ipFormControl: FormControl;

	public cpfFormControl: FormControl;

	public cpfCnpjFormControl: FormControl;

	public cpfCnpjDynamicFormControl: FormControl;

	public textFormControl: FormControl;

	public phoneBrFormControl: FormControl;

	public clearIfNotMatch: FormControl;

	public numberOrStringForm: FormControl;

	public suffixForm: FormControl;

	public repeatForm: FormControl;

	public emptyMaskForm: FormControl;

	public separatorForm: FormControl;

	public percent: FormControl;

	public formSecureInput: FormControl;

	public customPatternForm: FormControl;

	public hourTimeForm: FormControl;

	public hourForm: FormControl;

	public hour24Form: FormControl;

	public mixedTypeForm: FormControl;

	public dateMonthForm: FormControl;

	public pattern: IPattern = {
		P: {
			pattern: new RegExp('\\d'),
		},
	};

	public surnamePattern = { N: { pattern: new RegExp(`[A-Za-z '-]`) } };

	public numberOrStringFormModel: SN = '';

	public clearIfNotMatchModel: SN = '';

	public formModelDate: SN = '';

	public secureMask: SN = '';

	public ipModel: SN = '';

	public cpfModel: SN = '';

	public cpfCnpjModel: SN = '';

	public cpfCnpjDynamicModel: SN = '';

	public textModel: SN = '';

	public phoneBrModel: SN = '';

	public dateModel: SN = '';

	public showMaskModel: SN = '';

	public suf: string = '+7';

	public suffixModel!: SN;

	public repeatFormModel!: SN;

	public emptyMaskFormModel!: SN;

	public customPatternFormModel!: SN;

	public separatorFormModel!: SN;

	public separatorPrecisionSeparatorFormModel!: SN;

	public separatorZeroPrecisionSeparatorFormModel!: SN;

	public dotSeparatorFormModel!: string;

	public dotPrecisionSeparatorFormModel: SN = '';

	public dotZeroPrecisionSeparatorFormModel!: SN;

	public commaSeparatorFormModel!: SN;

	public spacebarSeparatorFormModel!: SN;

	public emptySeparatorFormModel!: SN;

	public commaPrecisionSeparatorFormModel: SN = '';

	public spacebarPrecisionSeparatorFormModel: SN = '';

	public commaZeroPrecisionSeparatorFormModel!: SN;

	public spacebarZeroPrecisionSeparatorFormModel!: SN;

	public separatorPrecisionSeparatorForm: FormControl;

	public separatorZeroPrecisionSeparatorForm: FormControl;

	public dotSeparatorForm!: FormControl;

	public dotPrecisionSeparatorForm!: FormControl;

	public dotZeroPrecisionSeparatorForm!: FormControl;

	public commaSeparatorForm!: FormControl;

	public spacebarSeparatorForm!: FormControl;

	public emptySeparatorForm!: FormControl;

	public commaPrecisionSeparatorForm!: FormControl;

	public spacebarPrecisionSeparatorForm!: FormControl;

	public commaZeroPrecisionSeparatorForm!: FormControl;

	public spacebarZeroPrecisionSeparatorForm!: FormControl;

	public triggerSelectFormControl!: FormControl;

	public triggerInputFormControl!: FormControl;

	public triggerMask = '';

	public constructor() {
		this.form = new FormControl('');
		this.form1 = new FormControl('');
		this.formDate = new FormControl('');
		this.formSecureInput = new FormControl('');
		this.ipFormControl = new FormControl();
		this.cpfFormControl = new FormControl();
		this.cpfCnpjFormControl = new FormControl();
		this.cpfCnpjDynamicFormControl = new FormControl();
		this.textFormControl = new FormControl();
		this.phoneBrFormControl = new FormControl();
		this.clearIfNotMatch = new FormControl();
		this.numberOrStringForm = new FormControl();
		this.suffixForm = new FormControl('');
		this.repeatForm = new FormControl('');
		this.emptyMaskForm = new FormControl('');
		this.separatorForm = new FormControl('');
		this.separatorPrecisionSeparatorForm = new FormControl('');
		this.separatorZeroPrecisionSeparatorForm = new FormControl('');
		this.dotSeparatorForm = new FormControl('');
		this.dotPrecisionSeparatorForm = new FormControl(0);
		this.dotZeroPrecisionSeparatorForm = new FormControl('');
		this.commaSeparatorForm = new FormControl('');
		this.spacebarSeparatorForm = new FormControl('');
		this.emptySeparatorForm = new FormControl('');
		this.commaPrecisionSeparatorForm = new FormControl(0);
		this.spacebarPrecisionSeparatorForm = new FormControl(0);
		this.commaZeroPrecisionSeparatorForm = new FormControl('');
		this.spacebarZeroPrecisionSeparatorForm = new FormControl('');
		this.percent = new FormControl('');
		this.customPatternForm = new FormControl('');
		this.hourTimeForm = new FormControl('');
		this.hourForm = new FormControl('');
		this.hour24Form = new FormControl('');
		this.mixedTypeForm = new FormControl('');
		this.dateMonthForm = new FormControl('');
		this.triggerSelectFormControl = new FormControl('de');
		this.triggerSelectFormControl.valueChanges.subscribe((value) => {
			this.triggerMask = value === 'de' ? '' : '00 000 00 00';
		});
		this.triggerInputFormControl = new FormControl('123456789');

		this.customMaska = ['PPP-PPP-PPP', this.pattern];
	}
}
