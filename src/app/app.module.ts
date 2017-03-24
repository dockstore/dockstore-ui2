import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { DockstoreService } from './shared/dockstore.service'

import { AppComponent } from './app.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    SponsorsComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [DockstoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
