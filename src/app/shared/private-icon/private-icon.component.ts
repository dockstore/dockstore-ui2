import { Component } from '@angular/core';
import { Dockstore } from '../../shared/dockstore.model';

@Component({
  selector: 'app-private-icon',
  templateUrl: './private-icon.component.html',
})
export class PrivateIconComponent {
  // Change this link if necessary
  readonly privateDocsLink = Dockstore.DOCUMENTATION_URL + '/advanced-topics/public-and-private-tools.html';
  constructor() {}
}
