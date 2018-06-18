import { MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule, MatInputModule, MatFormFieldModule,
  MatSnackBarModule, MatRadioModule, MatStepperModule, MatDialogModule, MatSelectModule, MatChipsModule } from '@angular/material';
import { NgModule } from '@angular/core';

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
    MatSelectModule,
    MatChipsModule
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
    MatSelectModule,
    MatChipsModule
  ]
})
export class CustomMaterialModule { }
