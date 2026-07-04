import type { ElementRef } from '@angular/core';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';

@Injectable()
export class AccordionService {
    private readonly platformId = inject<string>(PLATFORM_ID);
    private readonly document = inject(DOCUMENT);

    public onChangeAccordion(cards: readonly ElementRef<HTMLElement>[]): void {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        const firstCard = cards[0];
        if (!firstCard) {
            return;
        }

        const firstNativeElement: HTMLElement | null = this.document.getElementById(
            firstCard.nativeElement.id
        );
        if (firstNativeElement) {
            firstNativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
}
