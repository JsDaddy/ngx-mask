import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
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
        provideAnimations(),
        provideRouter([]),
        provideNgxMask({
            maskAliases: {
                PHONE_BR: '(00) 00000-0000',
            },
        }),
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                fullLibraryLoader: () => import('highlight.js'),
            },
        },
    ],
    // eslint-disable-next-line no-console
}).catch((err) => console.error(err));
