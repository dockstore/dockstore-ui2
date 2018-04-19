import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  showBanner: boolean;
  constructor() { }

  ngOnInit() {
    this.showBanner = environment.staging;
  }

}
