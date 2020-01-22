import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { NgxMaskModule } from 'ngx-mask';

import { TestMaskComponent } from '../../projects/ngx-mask-lib/src/test/utils/test-component.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { BugsComponent } from './bugs/bugs.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [AppComponent, BugsComponent, ErrorComponent, ShowcaseComponent, TestMaskComponent],
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
