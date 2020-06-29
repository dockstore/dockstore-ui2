import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntryWizardComponent } from './entry-wizard/entry-wizard.component';
import { CustomMaterialModule } from './modules/material.module';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FormsModule],
  declarations: [EntryWizardComponent],
  exports: [EntryWizardComponent]
})
export class EntryWizardModule {}
