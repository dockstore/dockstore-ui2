import { Component } from '@angular/core';
import { Dockstore } from '../../shared/dockstore.model';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-private-icon',
  templateUrl: './private-icon.component.html',
  standalone: true,
  imports: [MatIconModule, MatLegacyTooltipModule],
})
export class PrivateIconComponent {
  // Change this link if necessary
  readonly privateDocsLink = Dockstore.DOCUMENTATION_URL + '/advanced-topics/public-and-private-tools.html';
}
