import { Directive, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive({
  selector: '[appSnackbar]',
})
export class SnackbarDirective {
  constructor(private matSnackBar: MatSnackBar) {}

  @HostListener('click')
  onClick() {
    this.matSnackBar.open('Copied!', '', {
      duration: 1000,
      panelClass: 'custom_copy_snack_bar',
    });
  }
}
