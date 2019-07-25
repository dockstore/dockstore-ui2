import { Component } from '@angular/core';
import { HomePageService } from 'app/home-page/home-page.service';

@Component({
  selector: 'app-logged-in-banner',
  templateUrl: './logged-in-banner.component.html',
  styleUrls: ['./logged-in-banner.component.scss']
})
export class LoggedInBannerComponent {
  constructor(private homePageService: HomePageService) {}

  goToSearch(searchValue: string) {
    this.homePageService.goToSearch(searchValue);
  }
}
