import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { provideEnvironmentNgxMask, NgxMaskDirective } from 'ngx-mask';
import type { NgxMaskOptions } from 'ngx-mask';

function createComponentWithDefaultConfig(
    defaultConfig?: NgxMaskOptions
): ComponentFixture<TestMaskComponent> {
    TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
        providers: [provideEnvironmentNgxMask(defaultConfig)],
    });
    const fixture = TestBed.createComponent(TestMaskComponent);
    return fixture;
}

describe('Default config', () => {
    it('default config - decimalMarker and thousandSeparator', () => {
        const fixture = createComponentWithDefaultConfig({
            decimalMarker: ',',
            thousandSeparator: '.',
        });
        const component = fixture.componentInstance;
        component.mask.set('separator');
        component.form = new FormControl(1234.56);
        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('1.234,56');
        });
    });

    it('default config - decimalMarker and thousandSeparator', () => {
        const fixture = createComponentWithDefaultConfig({
            decimalMarker: '.',
            thousandSeparator: ' ',
        });
        const component = fixture.componentInstance;
        component.mask.set('separator');
        component.form = new FormControl(1234.56);
        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('1 234.56');
        });
    });

    it('default config overriden - decimalMarker and thousandSeparator', () => {
        const fixture = createComponentWithDefaultConfig({
            decimalMarker: '.',
            thousandSeparator: ' ',
        });
        const component = fixture.componentInstance;
        component.mask.set('separator');
        // Override default decimalMarker and thousandSeparator
        component.decimalMarker.set(',');
        component.thousandSeparator.set('.');
        component.form = new FormControl(1234.56);
        component.specialCharacters.set(['/']); // Explicit set needed to prevent bug in ngx-mask.directive.ts OnChanges event (if specialCharacters is undefined, OnChanges function will return prematurely and won't apply provided thousandSeparator and decimalMarker)
        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('1.234,56');
        });
    });

    it('default config overriden - decimalMarker and thousandSeparator and leadZero', () => {
        const fixture = createComponentWithDefaultConfig({
            thousandSeparator: '.',
            decimalMarker: ',',
            leadZero: true,
            separatorLimit: '100',
        });
        const component = fixture.componentInstance;
        component.mask.set('separator.2');

        component.form = new FormControl(123);
        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('123,00');
        });
    });

    it('default config overriden - decimalMarker and thousandSeparator and leadZero and suffix', () => {
        const fixture = createComponentWithDefaultConfig({
            suffix: ' €',
            thousandSeparator: ' ',
            decimalMarker: ',',
            leadZero: true,
        });
        const component = fixture.componentInstance;
        component.mask.set('separator.2');

        component.form = new FormControl(15000.33);
        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('15 000,33 €');
        });
    });
});
