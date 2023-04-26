import { ElementRef, Injectable, QueryList } from '@angular/core';
import { takeUntil } from 'rxjs';
import { UnSubscriber } from '@libraries/unsubscriber/unsubscriber.service';

@Injectable()
export class ChangeAccordionService extends UnSubscriber {
    public onChangeAccordion(cards: QueryList<ElementRef>): void {
        cards.changes.pipe(takeUntil(this.unsubscribe$$)).subscribe((elementRef) => {
            const firstNativeElement: HTMLElement | null = document.getElementById(
                elementRef.first.nativeElement.id
            );
            if (firstNativeElement) {
                firstNativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }
}
