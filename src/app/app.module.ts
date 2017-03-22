import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { HomeComponent } from './home/home.component';

import { routing } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    SponsorsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
