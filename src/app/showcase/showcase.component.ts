import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

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

	public cControl = new UntypedFormControl(1);

	public form: UntypedFormControl;

	public form1: UntypedFormControl;

	public formDate: UntypedFormControl;

	public ipFormControl: UntypedFormControl;

	public cpfFormControl: UntypedFormControl;

	public cpfCnpjFormControl: UntypedFormControl;

	public cpfCnpjDynamicFormControl: UntypedFormControl;

	public textFormControl: UntypedFormControl;

	public phoneBrFormControl: UntypedFormControl;

	public clearIfNotMatch: UntypedFormControl;

	public numberOrStringForm: UntypedFormControl;

	public suffixForm: UntypedFormControl;

	public repeatForm: UntypedFormControl;

	public emptyMaskForm: UntypedFormControl;

	public separatorForm: UntypedFormControl;

	public percent: UntypedFormControl;

	public formSecureInput: UntypedFormControl;

	public customPatternForm: UntypedFormControl;

	public hourTimeForm: UntypedFormControl;

	public hourForm: UntypedFormControl;

	public hour24Form: UntypedFormControl;

	public mixedTypeForm: UntypedFormControl;

	public dateMonthForm: UntypedFormControl;

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

	public separatorPrecisionSeparatorForm: UntypedFormControl;

	public separatorZeroPrecisionSeparatorForm: UntypedFormControl;

	public dotSeparatorForm!: UntypedFormControl;

	public dotPrecisionSeparatorForm!: UntypedFormControl;

	public dotZeroPrecisionSeparatorForm!: UntypedFormControl;

	public commaSeparatorForm!: UntypedFormControl;

	public spacebarSeparatorForm!: UntypedFormControl;

	public emptySeparatorForm!: UntypedFormControl;

	public commaPrecisionSeparatorForm!: UntypedFormControl;

	public spacebarPrecisionSeparatorForm!: UntypedFormControl;

	public commaZeroPrecisionSeparatorForm!: UntypedFormControl;

	public spacebarZeroPrecisionSeparatorForm!: UntypedFormControl;

	public triggerSelectFormControl!: UntypedFormControl;

	public triggerInputFormControl!: UntypedFormControl;

	public triggerMask = '';

	public constructor() {
		this.form = new UntypedFormControl('');
		this.form1 = new UntypedFormControl('');
		this.formDate = new UntypedFormControl('');
		this.formSecureInput = new UntypedFormControl('');
		this.ipFormControl = new UntypedFormControl();
		this.cpfFormControl = new UntypedFormControl();
		this.cpfCnpjFormControl = new UntypedFormControl();
		this.cpfCnpjDynamicFormControl = new UntypedFormControl();
		this.textFormControl = new UntypedFormControl();
		this.phoneBrFormControl = new UntypedFormControl();
		this.clearIfNotMatch = new UntypedFormControl();
		this.numberOrStringForm = new UntypedFormControl();
		this.suffixForm = new UntypedFormControl('');
		this.repeatForm = new UntypedFormControl('');
		this.emptyMaskForm = new UntypedFormControl('');
		this.separatorForm = new UntypedFormControl('');
		this.separatorPrecisionSeparatorForm = new UntypedFormControl('');
		this.separatorZeroPrecisionSeparatorForm = new UntypedFormControl('');
		this.dotSeparatorForm = new UntypedFormControl('');
		this.dotPrecisionSeparatorForm = new UntypedFormControl(0);
		this.dotZeroPrecisionSeparatorForm = new UntypedFormControl('');
		this.commaSeparatorForm = new UntypedFormControl('');
		this.spacebarSeparatorForm = new UntypedFormControl('');
		this.emptySeparatorForm = new UntypedFormControl('');
		this.commaPrecisionSeparatorForm = new UntypedFormControl(0);
		this.spacebarPrecisionSeparatorForm = new UntypedFormControl(0);
		this.commaZeroPrecisionSeparatorForm = new UntypedFormControl('');
		this.spacebarZeroPrecisionSeparatorForm = new UntypedFormControl('');
		this.percent = new UntypedFormControl('');
		this.customPatternForm = new UntypedFormControl('');
		this.hourTimeForm = new UntypedFormControl('');
		this.hourForm = new UntypedFormControl('');
		this.hour24Form = new UntypedFormControl('');
		this.mixedTypeForm = new UntypedFormControl('');
		this.dateMonthForm = new UntypedFormControl('');
		this.triggerSelectFormControl = new UntypedFormControl('de');
		this.triggerSelectFormControl.valueChanges.subscribe((value) => {
			this.triggerMask = value === 'de' ? '' : '00 000 00 00';
		});
		this.triggerInputFormControl = new UntypedFormControl('123456789');

		this.customMaska = ['PPP-PPP-PPP', this.pattern];
	}
}
