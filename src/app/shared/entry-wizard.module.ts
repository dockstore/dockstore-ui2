import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryWizardComponent } from './entry-wizard/entry-wizard.component';
import { CustomMaterialModule } from './modules/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FormsModule],
  declarations: [EntryWizardComponent],
  exports: [EntryWizardComponent]
})
export class EntryWizardModule {}
