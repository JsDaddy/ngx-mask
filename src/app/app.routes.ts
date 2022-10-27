import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowcaseComponent } from './showcase/showcase.component';
import { BugsComponent } from './bugs/bugs.component';
import { ErrorComponent } from './error/error.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'showcase', pathMatch: 'full' },
    {
        path: 'showcase',
        component: ShowcaseComponent,
    },
    {
        path: 'bugs',
        component: BugsComponent,
    },
    {
        path: 'error',
        component: ErrorComponent,
    },
    { path: '**', redirectTo: '/error' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            relativeLinkResolution: 'legacy',
        }),
    ],
    exports: [RouterModule],
})
/* istanbul ignore next */
export class AppRoutingModule {}
