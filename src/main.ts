import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNgxMask } from 'ngx-mask';
import { provideRouter } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { provideHttpClient } from '@angular/common/http';
import { BaseHttpService } from '@libraries/base-http/base-http.service';
import { DOMAIN } from '@libraries/token/token';
import { GithubStarsService } from '@libraries/github/github-stars.service';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        GithubStarsService,
        provideHttpClient(),
        {
            provide: DOMAIN,
            useValue: [BaseHttpService],
        },
        BaseHttpService,
        provideAnimations(),
        provideRouter([]),
        provideNgxMask(),
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                fullLibraryLoader: () => import('highlight.js'),
            },
        },
    ],
}).catch((err) => console.error(err));
