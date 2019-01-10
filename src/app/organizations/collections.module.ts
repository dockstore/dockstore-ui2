import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections/collections.component';
import { MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [ CommonModule, MatExpansionModule ],
  declarations: [ CollectionsComponent ],
  exports: [ CollectionsComponent ]
})
export class CollectionsModule { }
