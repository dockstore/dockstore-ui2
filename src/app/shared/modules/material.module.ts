import { MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule, MatInputModule, MatFormFieldModule,
  MatSnackBarModule, MatRadioModule, MatStepperModule, MatDialogModule, MatSelectModule, MatChipsModule,
  MatProgressBarModule, MatSidenavModule } from '@angular/material';
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
    MatChipsModule,
    MatProgressBarModule,
    MatSidenavModule
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
    MatChipsModule,
    MatProgressBarModule,
    MatSidenavModule
  ]
})
export class CustomMaterialModule { }
