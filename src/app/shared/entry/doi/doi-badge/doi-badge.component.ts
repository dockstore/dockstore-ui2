import { Component, Input } from '@angular/core';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { Dockstore } from 'app/shared/dockstore.model';
import { Doi } from 'app/shared/openapi';

@Component({
  selector: 'app-doi-badge',
  templateUrl: './doi-badge.component.html',
  styleUrls: [],
  standalone: true,
  imports: [MatLegacyTooltipModule],
})
export class DoiBadgeComponent {
  Dockstore = Dockstore;
  DoiType = Doi.TypeEnum;
  zenodoUrl: string;
  @Input() doi: Doi;

  constructor() {
    this.zenodoUrl = Dockstore.ZENODO_AUTH_URL ? Dockstore.ZENODO_AUTH_URL.replace('oauth/authorize', '') : '';
  }
}
