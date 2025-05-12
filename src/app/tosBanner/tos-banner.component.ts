import { Component, Input } from '@angular/core';
import { TosBannerService } from './state/tos-banner.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-tos-banner',
  templateUrl: './tos-banner.component.html',
  styleUrls: ['./tos-banner.component.css'],
  standalone: true,
  imports: [FlexModule, NgIf, MatButtonModule, MatIconModule],
})
export class TosBannerComponent {
  @Input()
  public bannerText: string;
  @Input()
  public loggedIn: boolean;

  constructor(private tosBannerService: TosBannerService) {}

  dismissTOS(): void {
    this.tosBannerService.dismissTOS();
  }

  acceptTOS(): void {
    this.tosBannerService.acceptTOS();
  }
}
