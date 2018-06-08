import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatRadioModule,
    MatStepperModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
  ],
  exports: [
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatRadioModule,
    MatStepperModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule
  ]
})
export class CustomMaterialModule { }
