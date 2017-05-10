import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdGridListModule, MdToolbarModule, MdIconModule, MdInputModule,
  MdSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import 'hammerjs';

import { AppComponent } from './app.component';
import { Ng2MaskModule } from './ng2-mask/ng2-mask.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MdGridListModule,
    MdToolbarModule,
    MdSelectModule,
    MdInputModule,
    BrowserModule,
    MdIconModule,
    FormsModule,
    HttpModule,
    Ng2MaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
