import { Component, Input } from '@angular/core';
import { TosBannerService } from './state/tos-banner.service';
import { User } from '../shared/openapi';

@Component({
  selector: 'app-tos-banner',
  templateUrl: './tos-banner.component.html',
  styleUrls: ['./tos-banner.component.css'],
})
export class TosBannerComponent {
  @Input()
  public bannerText: string;
  @Input()
  public loggedIn: boolean;
  @Input()
  public user: User;

  constructor(private tosBannerService: TosBannerService) {}

  dismissTOS(): void {
    this.tosBannerService.dismissTOS();
  }

  acceptTOS(): void {
    this.tosBannerService.acceptTOS(this.user);
  }
}
