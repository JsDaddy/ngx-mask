import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HideService {
    public showAccordion = true;
    public showHeaderButtons = false;

    public showAccordionBlock(): void {
        this.showAccordion = !this.showAccordion;
    }

    public showHeaderBlock(): void {
        this.showHeaderButtons = !this.showHeaderButtons;
        if (this.showHeaderButtons) {
            this.showAccordion = false;
        }
    }
}
