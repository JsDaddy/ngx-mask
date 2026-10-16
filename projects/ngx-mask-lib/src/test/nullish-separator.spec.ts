/* eslint-disable no-undefined -- `undefined` is the unset value under test */
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import type { NgxMaskConfig, NgxMaskOptions } from 'ngx-mask';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

describe('Separator: Mask with an unset thousandSeparator', () => {
    const create = (options?: NgxMaskOptions): ComponentFixture<TestMaskComponent> => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask(options)],
        });
        const fixture = TestBed.createComponent(TestMaskComponent);
        fixture.detectChanges();
        return fixture;
    };

    // `null`/`undefined` are not part of the declared type but reach the directive from unset
    // dynamic config; the mask must simply skip the grouping.
    const unset = [null, undefined] as unknown as NgxMaskConfig['thousandSeparator'][];

    it.each(unset)('does not throw or group for the input value %s', (value) => {
        const fixture = create();
        fixture.componentInstance.mask.set('separator.2');
        fixture.componentInstance.thousandSeparator.set(value);
        equal('1234567.89', '1234567.89', fixture);
    });

    it.each(unset)('does not throw or group for the provided config value %s', (value) => {
        const fixture = create({ thousandSeparator: value });
        fixture.componentInstance.mask.set('separator.2');
        equal('1234567.89', '1234567.89', fixture);
    });

    it.each(unset)('does not throw for the decimalMarker value %s', (value) => {
        const fixture = create();
        fixture.componentInstance.mask.set('separator.2');
        fixture.componentInstance.decimalMarker.set(
            value as unknown as NgxMaskConfig['decimalMarker']
        );
        equal('12345', '12 345', fixture);
    });
});
