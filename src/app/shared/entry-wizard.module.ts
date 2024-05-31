import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntryWizardComponent } from './entry-wizard/entry-wizard.component';
import { CustomMaterialModule } from './modules/material.module';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FormsModule, EntryWizardComponent],
  exports: [EntryWizardComponent],
})
export class EntryWizardModule {}
