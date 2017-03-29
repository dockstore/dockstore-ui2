import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataTablesModule } from 'angular-datatables';
import { ClipboardModule } from 'ngx-clipboard';
import { SharedModule } from './shared/shared.module';
import { routing } from './app.routing';
import { DockstoreService } from './shared/dockstore.service'
import { ContainersService } from './containers/containers.service';
import { WorkflowsService } from './workflows/workflows.service';

import { AppComponent } from './app.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SearchContainersComponent } from './search-containers/search-containers.component';
import { SearchWorkflowsComponent } from './search-workflows/search-workflows.component';
import { HomeFootNoteComponent } from './home-foot-note/home-foot-note.component';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { ContainersComponent } from './containers/containers.component';
import { WorkflowsComponent } from './workflows/workflows.component';

@NgModule({
  declarations: [
    AppComponent,
    SponsorsComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    SearchContainersComponent,
    SearchWorkflowsComponent,
    HomeFootNoteComponent,
    TabComponent,
    TabsComponent,
    ContainersComponent,
    WorkflowsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTablesModule,
    ClipboardModule,
    SharedModule,
    routing
  ],
  providers: [
    DockstoreService,
    ContainersService,
    WorkflowsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
