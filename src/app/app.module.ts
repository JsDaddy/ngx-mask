import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { TestMaskComponent } from '../../projects/ngx-mask-lib/src/test/utils/test-component.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { BugsComponent } from './bugs/bugs.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { ErrorComponent } from './error/error.component';
import { CypressTestMaskComponent } from '../../projects/ngx-mask-lib/src/test/utils/cypress-test-component.component';

@NgModule({
  declarations: [
    AppComponent,
    BugsComponent,
    ErrorComponent,
    ShowcaseComponent,
    TestMaskComponent,
    CypressTestMaskComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatGridListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskModule.forRoot({
      validation: true,
    }),
    MatIconModule,
    MatListModule,
    MatCardModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
