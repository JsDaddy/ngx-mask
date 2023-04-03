import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { provideRouter } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

if (environment.production) {
    enableProdMode();
}

const maskConfig: Partial<IConfig> = {
    validation: false,
};

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideRouter([]),
        provideNgxMask(maskConfig),
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                fullLibraryLoader: () => import('highlight.js'),
            },
        },
    ],
}).catch((err) => console.error(err));
