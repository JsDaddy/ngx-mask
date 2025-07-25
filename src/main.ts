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
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
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
    // eslint-disable-next-line no-console
}).catch((err) => console.error(err));
