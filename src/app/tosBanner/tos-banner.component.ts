import { Component } from '@angular/core';
import { TosBannerService } from './state/tos-banner.service';

@Component({
  selector: 'app-tos-banner',
  templateUrl: './tos-banner.component.html',
  styleUrls: ['./tos-banner.component.css'],
})
export class TosBannerComponent {
  constructor(private tosBannerService: TosBannerService) {}

  dismissTOS(): void {
    this.tosBannerService.dismissTOS();
  }
}
