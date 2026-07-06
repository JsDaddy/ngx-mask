// type-coverage:ignore-next-line
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';

@Injectable()
export class BodyStylesService {
    private readonly platformId = inject<string>(PLATFORM_ID);
    private readonly document = inject(DOCUMENT);
    public setOverflowYBodyHtml(hidden: boolean): void {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        const body = this.document.querySelector('body');
        const html = this.document.querySelector('html');
        if (!body || !html) {
            return;
        }
        body.style.overflowY = hidden ? 'hidden' : 'overlay';
        html.style.overflowY = hidden ? 'hidden' : '';
    }
}
