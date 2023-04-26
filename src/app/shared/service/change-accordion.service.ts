import { ElementRef, inject, Injectable, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UnSubscriber } from '@libraries/unsubscriber/unsubscriber.service';

@Injectable()
export class ChangeAccordionService extends UnSubscriber {
    private readonly router = inject(Router);

    public onChangeAccordion(cards: QueryList<ElementRef>): void {
        cards.changes.pipe(takeUntil(this.unsubscribe$$)).subscribe((elementRef) => {
            this.router.navigate(['/'], {
                fragment: '1',
            });
            const firstNativeElement: HTMLElement | null = document.getElementById(
                elementRef.first.nativeElement.id
            );
            if (firstNativeElement) {
                firstNativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }
}
