import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NgZone, SimpleChange } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxMaskDirective, NgxMaskService, provideNgxMask } from 'ngx-mask';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Directive: deferred work runs through afterNextRender and dies with the host', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    let input: HTMLInputElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('the library never schedules a requestAnimationFrame', async () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        component.showMaskTyped.set(false);
        fixture.detectChanges();
        component.form.setValue('10.2');
        await fixture.whenStable();

        input.dispatchEvent(new Event('focus'));
        component.showMaskTyped.set(true);
        fixture.detectChanges();
        await fixture.whenStable();

        // Angular's own scheduler uses requestAnimationFrame, so a spy cannot isolate the
        // library: assert on the directive's compiled source instead.
        expect(NgxMaskDirective.toString()).not.toContain('requestAnimationFrame');
    });

    it('applies the deferred leadZero normalisation while the host is alive', async () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        fixture.detectChanges();

        const applyMask = vi.spyOn(NgxMaskService.prototype, 'applyMask');

        component.form.setValue('10.2');
        const callsAtWrite = applyMask.mock.calls.length;
        await fixture.whenStable();

        expect(applyMask.mock.calls.length).toBeGreaterThan(callsAtWrite);
        expect(input.value).toBe('10.20');
    });

    it('does not run the deferred leadZero normalisation after the host is destroyed', async () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        fixture.detectChanges();
        const applyMask = vi.spyOn(NgxMaskService.prototype, 'applyMask');

        component.form.setValue('10.2');
        const callsAtWrite = applyMask.mock.calls.length;
        fixture.destroy();
        await Promise.resolve();
        await new Promise<void>((resolve) => setTimeout(resolve, 0));

        expect(applyMask.mock.calls.length).toBe(callsAtWrite);
    });

    it('does not run the deferred showMaskTyped click after the host is destroyed', async () => {
        component.mask.set('0000');
        fixture.detectChanges();
        input.dispatchEvent(new Event('focus'));
        const click = vi.spyOn(input, 'click');
        const directive = fixture.debugElement
            .query(By.directive(NgxMaskDirective))
            .injector.get(NgxMaskDirective);

        // Outside change detection no render hook runs yet, so the callback is still pending.
        directive.ngOnChanges({ showMaskTyped: new SimpleChange(false, true, false) });
        fixture.destroy();
        await new Promise<void>((resolve) => setTimeout(resolve, 0));

        expect(click).not.toHaveBeenCalled();
    });

    it('runs the deferred showMaskTyped click while the host is alive', async () => {
        component.mask.set('0000');
        fixture.detectChanges();
        input.dispatchEvent(new Event('focus'));
        const click = vi.spyOn(input, 'click');

        component.showMaskTyped.set(true);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(click).toHaveBeenCalledTimes(1);
    });

    it('re-enters the NgZone for the deferred leadZero normalisation', async () => {
        component.mask.set('separator.2');
        component.leadZero.set(true);
        fixture.detectChanges();
        const zone = TestBed.inject(NgZone);
        let insideRun = false;
        const insideRunAtApplyMask: boolean[] = [];
        vi.spyOn(zone, 'run').mockImplementation(((callback: () => unknown) => {
            insideRun = true;
            try {
                return callback();
            } finally {
                insideRun = false;
            }
        }) as NgZone['run']);
        const originalApplyMask = NgxMaskService.prototype.applyMask;
        vi.spyOn(NgxMaskService.prototype, 'applyMask').mockImplementation(function (
            this: NgxMaskService,
            ...args: Parameters<NgxMaskService['applyMask']>
        ) {
            insideRunAtApplyMask.push(insideRun);
            return originalApplyMask.apply(this, args);
        });

        component.form.setValue('10.2');
        await fixture.whenStable();

        expect(insideRunAtApplyMask.at(-1)).toBe(true);
    });

    it('re-enters the NgZone for the deferred showMaskTyped click', async () => {
        component.mask.set('0000');
        fixture.detectChanges();
        input.dispatchEvent(new Event('focus'));
        const run = vi.spyOn(TestBed.inject(NgZone), 'run');
        const click = vi.spyOn(input, 'click');

        component.showMaskTyped.set(true);
        fixture.detectChanges();
        await fixture.whenStable();
        await Promise.resolve();

        expect(run).toHaveBeenCalled();
        expect(click).toHaveBeenCalledTimes(1);
    });
});
