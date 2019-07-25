import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logged-in-banner',
  templateUrl: './logged-in-banner.component.html',
  styleUrls: ['./logged-in-banner.component.scss']
})
export class LoggedInBannerComponent {
  constructor(private router: Router) {}

  goToSearch(searchValue: string) {
    this.router.navigate(['/search'], { queryParams: { search: searchValue } });
  }
}
