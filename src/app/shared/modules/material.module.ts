import { MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule, MatInputModule, MatFormFieldModule,
  MatSnackBarModule, MatRadioModule, MatStepperModule, MatDialogModule, MatSelectModule, MatChipsModule,
  MatCardModule, MatListModule, MatDividerModule } from '@angular/material';
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
    MatCardModule,
    MatListModule,
    MatDividerModule
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
    MatCardModule,
    MatListModule,
    MatDividerModule
  ]
})
export class CustomMaterialModule { }
