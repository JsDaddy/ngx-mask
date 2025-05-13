import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { provideEnvironmentNgxMask, NgxMaskDirective, NgxMaskService } from 'ngx-mask';
import type { NgxMaskOptions, NgxMaskConfig } from 'ngx-mask';
import { Component, EventEmitter } from '@angular/core';

function createComponentWithDefaultConfigAndSimpleInputs(
    defaultConfig?: NgxMaskOptions
): ComponentFixture<TestMaskSimpleInputsComponent> {
    TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
        providers: [provideEnvironmentNgxMask(defaultConfig)],
    });
    return TestBed.createComponent(TestMaskSimpleInputsComponent);
}

@Component({
    selector: 'jsdaddy-open-source-test',
    standalone: true,
    imports: [ReactiveFormsModule, NgxMaskDirective],
    template: `<input [mask]="mask" [formControl]="form" />`,
})
export class TestMaskSimpleInputsComponent {
    public form: FormControl = new FormControl();
    public mask?: string;
}

describe('provideNgxMask', () => {
    it('config - suffix', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({
            suffix: 'aaa',
        });
        const service = TestBed.inject(NgxMaskService);
        expect(service.suffix).toBe('aaa');
    });

    it('config - prefix', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ prefix: 'bbb' });
        const service = TestBed.inject(NgxMaskService);
        expect(service.prefix).toBe('bbb');
    });

    it('config - thousandSeparator', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ thousandSeparator: '-' });
        const service = TestBed.inject(NgxMaskService);
        expect(service.thousandSeparator).toBe('-');
    });

    it('config - decimalMarker', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ decimalMarker: '.' });
        const service = TestBed.inject(NgxMaskService);
        expect(service.decimalMarker).toBe('.');
    });

    it('config - clearIfNotMatch', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ clearIfNotMatch: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.clearIfNotMatch).toBeTrue();
    });

    it('config - showMaskTyped', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ showMaskTyped: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.showMaskTyped).toBeTrue();
    });

    it('config - placeHolderCharacter', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ placeHolderCharacter: 'ccc' });
        const service = TestBed.inject(NgxMaskService);
        expect(service.placeHolderCharacter).toBe('ccc');
    });

    it('config - shownMaskExpression', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({
            shownMaskExpression: 'ddd',
        });
        const service = TestBed.inject(NgxMaskService);
        expect(service.shownMaskExpression).toBe('ddd');
    });

    it('config - specialCharacters', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ specialCharacters: ['a'] });
        const service = TestBed.inject(NgxMaskService);
        expect(service.specialCharacters).toEqual(['a']);
    });

    it('config - dropSpecialCharacters', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ dropSpecialCharacters: ['a'] });
        const service = TestBed.inject(NgxMaskService);
        expect(service.dropSpecialCharacters).toEqual(['a']);
    });

    it('config - hiddenInput', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ hiddenInput: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.hiddenInput).toBeTrue();
    });

    it('config - validation', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ validation: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.validation).toBeTrue();
    });

    it('config - instantPrefix', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ instantPrefix: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.instantPrefix).toBeTrue();
    });

    it('config - separatorLimit', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ separatorLimit: 'a' });
        const service = TestBed.inject(NgxMaskService);
        expect(service.separatorLimit).toBe('a');
    });

    it('config - apm', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ apm: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.apm).toBeTrue();
    });

    it('config - allowNegativeNumbers', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ allowNegativeNumbers: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.allowNegativeNumbers).toBeTrue();
    });

    it('config - leadZeroDateTime', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ leadZeroDateTime: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.leadZeroDateTime).toBeTrue();
    });

    it('config - leadZero', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ leadZero: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.leadZero).toBeTrue();
    });

    it('config - triggerOnMaskChange', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ triggerOnMaskChange: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.triggerOnMaskChange).toBeTrue();
    });

    it('config - keepCharacterPositions', async () => {
        createComponentWithDefaultConfigAndSimpleInputs({ keepCharacterPositions: true });
        const service = TestBed.inject(NgxMaskService);
        expect(service.keepCharacterPositions).toBeTrue();
    });

    it('config - inputTransformFn', async () => {
        const mockInputTransformFn = () => 'test';
        createComponentWithDefaultConfigAndSimpleInputs({
            inputTransformFn: mockInputTransformFn,
        });
        const service = TestBed.inject(NgxMaskService);
        expect(service.inputTransformFn).toBe(mockInputTransformFn);
    });

    it('config - outputTransformFn', async () => {
        const mockOutputTransformFn = () => 'test';
        createComponentWithDefaultConfigAndSimpleInputs({
            outputTransformFn: mockOutputTransformFn,
        });
        const service = TestBed.inject(NgxMaskService);
        expect(service.outputTransformFn).toBe(mockOutputTransformFn);
    });

    it('config - patterns', async () => {
        const mockPatterns = {
            '0': {
                pattern: new RegExp('[a-zA-Z]'),
            },
        };
        createComponentWithDefaultConfigAndSimpleInputs({
            patterns: mockPatterns,
        });
        const service = TestBed.inject(NgxMaskService);
        expect(service.patterns).toBe(mockPatterns);
    });

    it('config - all values', async () => {
        const allConfigValues: NgxMaskConfig = {
            suffix: 'aaa',
            prefix: 'bbb',
            thousandSeparator: ',',
            decimalMarker: '.',
            clearIfNotMatch: true,
            showMaskTyped: true,
            placeHolderCharacter: '_',
            shownMaskExpression: 'c',
            specialCharacters: ['d'],
            dropSpecialCharacters: true,
            hiddenInput: true,
            validation: true,
            instantPrefix: true,
            separatorLimit: '1',
            apm: true,
            allowNegativeNumbers: true,
            leadZeroDateTime: true,
            leadZero: true,
            triggerOnMaskChange: true,
            keepCharacterPositions: true,
            inputTransformFn: () => 'e',
            outputTransformFn: () => 'f',
            maskFilled: new EventEmitter<void>(),
            patterns: {
                '0': {
                    pattern: new RegExp('[a-zA-Z]'),
                },
            },
        };
        createComponentWithDefaultConfigAndSimpleInputs(allConfigValues);
        const service = TestBed.inject(NgxMaskService);

        // Exclude the below config keys from the test which do not exist in the service or cannot be tested.
        const excludeConfig = ['maskFilled'];

        // Ensure that all provided config values are passed through to the service.
        for (const key of Object.keys(allConfigValues)) {
            if (!excludeConfig.includes(key)) {
                expect((service as any)[key]).toEqual((allConfigValues as any)[key]);
            }
        }
    });
});
