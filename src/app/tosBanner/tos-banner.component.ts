import { Component } from '@angular/core';
import { TosBannerService } from './state/tos-banner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tos-banner',
  templateUrl: './tos-banner.component.html'
})
export class TosBannerComponent {
  public isLoggedIn$: Observable<boolean>;
  constructor(private tosBannerService: TosBannerService) {}

  dismissTOS(): void {
    this.tosBannerService.dismissTOS();
  }
}
