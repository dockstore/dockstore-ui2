import { Directive, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive({
  selector: '[appSnackbar]',
  standalone: true,
})
export class SnackbarDirective {
  constructor(private matSnackBar: MatSnackBar) {}

  @HostListener('click')
  onClick() {
    this.matSnackBar.open('Copied to clipboard', '', {
      duration: 1000,
      panelClass: 'custom_copy_snack_bar',
    });
  }
}
