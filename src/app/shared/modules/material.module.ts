import { MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule, MatInputModule, MatFormFieldModule,
  MatSnackBarModule, MatRadioModule, MatStepperModule, MatDialogModule, MatSelectModule, MatChipsModule,
  MatProgressBarModule, MatSidenavModule, MatTooltipModule } from '@angular/material';
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
    MatSidenavModule,
    MatTooltipModule
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
    MatSidenavModule,
    MatTooltipModule
  ]
})
export class CustomMaterialModule { }
