import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { NgxMaskModule } from '../lib/ngx-mask.module';
import { optionsConfig } from '../lib/ngx-mask.config';

function createComponentWithDefaultConfig(
    defaultConfig?: optionsConfig
): ComponentFixture<TestMaskComponent> {
    TestBed.configureTestingModule({
        declarations: [TestMaskComponent],
        imports: [ReactiveFormsModule, NgxMaskModule.forRoot(defaultConfig)],
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
        component.mask = 'separator';
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
        component.mask = 'separator';
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
        component.mask = 'separator';
        // Override default decimalMarker and thousandSeparator
        component.decimalMarker = ',';
        component.thousandSeparator = '.';
        component.form = new FormControl(1234.56);
        component.specialCharacters = ['/']; // Explicit set needed to prevent bug in ngx-mask.directive.ts OnChanges event (if specialCharacters is undefined, OnChanges function will return prematurely and won't apply provided thousandSeparator and decimalMarker)
        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe('1.234,56');
        });
    });
});
