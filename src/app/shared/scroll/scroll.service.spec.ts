import { Component, effect, ElementRef, inject, viewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollService } from './scroll.service';

@Component({
    selector: 'ngxd-test-cards',
    template: `
        @for (section of sections; track $index) {
            <div [id]="'card-' + $index" [attr.data-section]="section" #cards>
                <div [id]="'anchor-' + $index"></div>
            </div>
        }
    `,
    providers: [ScrollService],
})
class TestCardsComponent {
    public readonly sections = [1, 7, 7];
    public readonly cards = viewChildren<string, ElementRef<HTMLElement>>('cards', {
        read: ElementRef,
    });
    private readonly scrollService = inject(ScrollService);

    public constructor() {
        // same wiring as OptionsComponent: cards reach the service before the first render ends
        effect(() => this.scrollService.onScroll(this.cards()));
    }
}

describe('ScrollService fragment scroll', () => {
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = Element.prototype.scrollIntoView;

    const render = (fragment: string): void => {
        history.replaceState(null, '', `/${fragment}`);
        TestBed.createComponent(TestCardsComponent).detectChanges();
        TestBed.tick();
    };

    beforeEach(() => {
        Element.prototype.scrollIntoView = function (this: Element, ...args: unknown[]): void {
            scrollIntoView(this.id, ...args);
        };
        TestBed.configureTestingModule({ providers: [provideRouter([])] });
    });

    afterEach(() => {
        Element.prototype.scrollIntoView = originalScrollIntoView;
        scrollIntoView.mockReset();
        history.replaceState(null, '', '/');
    });

    it('scrolls to the anchor of the first card matching the fragment section', () => {
        render('#7');

        expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith('anchor-1', { block: 'start' });
    });

    it('does not scroll when the fragment is empty or matches no section', () => {
        render('');
        render('#unknown');

        expect(scrollIntoView).not.toHaveBeenCalled();
    });
});
