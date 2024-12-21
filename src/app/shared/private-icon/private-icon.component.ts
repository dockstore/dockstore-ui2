import { Component } from '@angular/core';
import { Dockstore } from '../../shared/dockstore.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-private-icon',
  templateUrl: './private-icon.component.html',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
})
export class PrivateIconComponent {
  // Change this link if necessary
  readonly privateDocsLink = Dockstore.DOCUMENTATION_URL + '/advanced-topics/public-and-private-tools.html';
}
