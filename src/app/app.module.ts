import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataTablesModule } from 'angular-datatables';
import { HeaderModule } from './shared/header.module';
import { ContainersModule } from './shared/containers.module';
import { routing } from './app.routing';
import { DockstoreService } from './shared/dockstore.service'
import { WorkflowsService } from './workflows/workflows.service';

import { AppComponent } from './app.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SearchWorkflowsComponent } from './search-workflows/search-workflows.component';
import { HomeFootNoteComponent } from './home-foot-note/home-foot-note.component';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { ToolDetailsComponent } from './tool-details/tool-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SponsorsComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    SearchWorkflowsComponent,
    HomeFootNoteComponent,
    TabComponent,
    TabsComponent,
    WorkflowsComponent,
    ToolDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTablesModule,
    HeaderModule,
    ContainersModule,
    routing
  ],
  providers: [
    DockstoreService,
    WorkflowsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
