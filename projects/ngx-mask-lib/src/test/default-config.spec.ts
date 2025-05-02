import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { provideEnvironmentNgxMask, NgxMaskDirective } from 'ngx-mask';
import type { NgxMaskOptions } from 'ngx-mask';
import { By } from '@angular/platform-browser';

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

    it('default config - triggerOnMaskChange', async () => {
        const fixture = createComponentWithDefaultConfig({
            triggerOnMaskChange: true,
        });
        const component = fixture.componentInstance;
        component.mask.set('');
        fixture.detectChanges();

        component.form.setValue('7912345678');
        fixture.detectChanges();
        await fixture.whenStable();
        let inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).toEqual('7912345678');
        expect(component.form.value).toEqual('7912345678');

        component.mask.set('00 000 00 00');
        fixture.detectChanges();
        await fixture.whenStable();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).toEqual('79 123 45 67');
        expect(component.form.value).toEqual('791234567');
    });

    it('default config overridden - triggerOnMaskChange', async () => {
        const fixture = createComponentWithDefaultConfig({
            triggerOnMaskChange: false,
        });
        const component = fixture.componentInstance;
        // Override default triggerOnMaskChange
        component.triggerOnMaskChange.set(true);
        component.mask.set('');
        fixture.detectChanges();

        component.form.setValue('7912345678');
        fixture.detectChanges();
        await fixture.whenStable();
        let inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).toEqual('7912345678');
        expect(component.form.value).toEqual('7912345678');

        component.mask.set('00 000 00 00');
        fixture.detectChanges();
        await fixture.whenStable();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).toEqual('79 123 45 67');
        expect(component.form.value).toEqual('791234567');
    });
});
