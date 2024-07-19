import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { Dockstore } from 'app/shared/dockstore.model';
import { Doi } from 'app/shared/openapi';

@Component({
  selector: 'app-doi-badge',
  templateUrl: './doi-badge.component.html',
  styleUrls: [],
  standalone: true,
  imports: [MatLegacyTooltipModule, NgIf, MatIconModule],
})
export class DoiBadgeComponent {
  Dockstore = Dockstore;
  DoiInitiator = Doi.InitiatorEnum;
  DoiType = Doi.TypeEnum;
  zenodoUrl: string;
  @Input() doi: Doi;
  @Input() displayInitiator: boolean = true;
  @Input() displayDoi: boolean = true;

  constructor() {
    this.zenodoUrl = Dockstore.ZENODO_AUTH_URL ? Dockstore.ZENODO_AUTH_URL.replace('oauth/authorize', '') : '';
  }
}
