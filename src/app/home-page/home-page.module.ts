import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { HomeLoggedInComponent } from 'app/home-page/home-logged-in/home-logged-in.component';
import { HomeComponent } from 'app/home-page/home-logged-out/home.component';
import { ListContainersModule } from 'app/shared/modules/list-containers.module';
import { ListWorkflowsModule } from 'app/shared/modules/list-workflows.module';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { TabsModule } from 'ngx-bootstrap';
import { HomePageComponent } from './home-page.component';
import { RequestsComponent } from './widget/requests/requests.component';
import { EntriesComponent } from './widget/entries/entries.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FlexLayoutModule,
    NgxJsonLdModule,
    RouterModule,
    ListWorkflowsModule,
    ListContainersModule,
    TabsModule,
    FormsModule
  ],
  declarations: [HomePageComponent, HomeComponent, HomeLoggedInComponent, RequestsComponent, EntriesComponent],
  entryComponents: [],
  exports: [NgxJsonLdModule]
})
export class HomePageModule {}
