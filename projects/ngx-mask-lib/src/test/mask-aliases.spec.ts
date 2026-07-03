import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { expect, vi } from 'vitest';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { createTriModeFixture, TRI_MODES } from './utils/tri-mode-harness';
import { provideNgxMask, NgxMaskDirective, NgxMaskPipe, initialConfig } from 'ngx-mask';

// Issues #1376 + #1091: user-defined named mask aliases via DI config (maskAliases).
// An alias key that exactly matches the `mask` input is expanded to its mask expression
// BEFORE any other processing (including the `||` multi-mask split). Alias keys that
// shadow built-in tokens (IP, CPF_CNPJ, ...) are ignored with a one-time warning.
describe('Directive: Mask (maskAliases — user-defined named masks)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    const configureWith = (maskAliases: Record<string, string>): void => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask({ maskAliases })],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('should resolve an alias to its mask expression', () => {
        configureWith({ PHONE_BR: '(00) 00000-0000' });
        component.mask.set('PHONE_BR');
        equal('11987654321', '(11) 98765-4321', fixture);
    });

    it('should resolve an alias that expands to a || multi-mask', () => {
        configureWith({ MY_PHONE: '(00) 00000000||+00 (00) 00000000' });
        component.mask.set('MY_PHONE');
        equal('1234567890', '(12) 34567890', fixture);
    });

    it('should apply per-instance custom patterns to the expanded alias expression', () => {
        configureWith({ PLATE: 'PPP-000' });
        component.patterns.set({
            ...initialConfig.patterns,
            P: { pattern: new RegExp('[a-zA-Z]') },
        });
        component.mask.set('PLATE');
        equal('abc123', 'abc-123', fixture);
    });

    it('should keep the built-in token and warn once when an alias shadows it', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        configureWith({ IP: '000' });
        component.mask.set('IP');
        // Typed with dots, exactly like the built-in IP mask expects — the '000' alias
        // would have produced '192' instead.
        equal('192.168.1.78', '192.168.1.78', fixture);
        expect(warnSpy).toHaveBeenCalledWith(
            'ngx-mask: mask alias "IP" shadows a built-in mask token and is ignored. Rename the alias.'
        );
        warnSpy.mockRestore();
    });

    it('should leave mask expressions that match no alias untouched', () => {
        configureWith({ PHONE_BR: '(00) 00000-0000' });
        component.mask.set('00-00');
        equal('1234', '12-34', fixture);
    });
});

describe('Pipe: Mask (maskAliases — user-defined named masks)', () => {
    it('should resolve an alias from the DI config', () => {
        let maskPipe!: NgxMaskPipe;
        TestBed.configureTestingModule({
            imports: [NgxMaskPipe],
            providers: [
                provideNgxMask({ maskAliases: { PHONE_BR: '(00) 00000-0000' } }),
                NgxMaskDirective,
            ],
        }).runInInjectionContext(() => {
            maskPipe = new NgxMaskPipe();
        });

        expect(maskPipe.transform('11987654321', 'PHONE_BR')).equal('(11) 98765-4321');
    });

    it('should resolve an alias passed through the per-call config', () => {
        let maskPipe!: NgxMaskPipe;
        TestBed.configureTestingModule({
            imports: [NgxMaskPipe],
            providers: [provideNgxMask(), NgxMaskDirective],
        }).runInInjectionContext(() => {
            maskPipe = new NgxMaskPipe();
        });

        expect(
            maskPipe.transform('123456789', 'MY_DOC', {
                maskAliases: { MY_DOC: '000.000.000' },
            })
        ).equal('123.456.789');
    });

    it('should leave mask expressions that match no alias untouched', () => {
        let maskPipe!: NgxMaskPipe;
        TestBed.configureTestingModule({
            imports: [NgxMaskPipe],
            providers: [
                provideNgxMask({ maskAliases: { PHONE_BR: '(00) 00000-0000' } }),
                NgxMaskDirective,
            ],
        }).runInInjectionContext(() => {
            maskPipe = new NgxMaskPipe();
        });

        expect(maskPipe.transform('abcdef', 'SS-SS-SS')).equal('ab-cd-ef');
    });
});

describe('Tri-mode parity: maskAliases', () => {
    TRI_MODES.forEach((mode) => {
        it(`should resolve an alias in ${mode} mode`, async () => {
            const harness = await createTriModeFixture(mode, {
                mask: 'PHONE_BR',
                providerOptions: { maskAliases: { PHONE_BR: '(00) 00000-0000' } },
            });

            const display = await harness.typeValue('11987654321');
            expect(display).equal('(11) 98765-4321');
            expect(harness.getBoundValue()).equal('11987654321');
        });
    });
});
