import { NgModule } from '@angular/core';
import { SnackbarDirective } from '../snackbar.directive';

@NgModule({
  imports: [SnackbarDirective],
  exports: [SnackbarDirective],
})
export class SnackbarModule {}
