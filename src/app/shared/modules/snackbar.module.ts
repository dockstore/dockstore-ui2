import { NgModule } from '@angular/core';
import { SnackbarDirective } from '../snackbar.directive';

@NgModule({
  declarations: [SnackbarDirective],
  exports: [SnackbarDirective],
})
export class SnackbarModule {}
