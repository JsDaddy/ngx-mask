import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideNgxMask } from 'ngx-mask';
import { provideRouter } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { GithubStarsService } from '@shared/github/github-stars.service';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        GithubStarsService,
        provideHttpClient(withXhr()),
        provideRouter([]),
        provideNgxMask({
            maskAliases: {
                PHONE_BR: '(00) 00000-0000',
            },
        }),
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    xml: () => import('highlight.js/lib/languages/xml'),
                },
            },
        },
    ],
    // eslint-disable-next-line no-console
}).catch((err) => console.error(err));
