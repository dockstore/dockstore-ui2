import { Component, OnInit } from '@angular/core';
import { Dockstore } from '../../shared/dockstore.model';

@Component({
  selector: 'app-private-icon',
  templateUrl: './private-icon.component.html',
  styleUrls: ['./private-icon.component.css']
})
export class PrivateIconComponent {
  // Change this link if necessary
  readonly privateDocsLink = Dockstore.DOCUMENTATION_URL + '/docs/publisher-tutorials/public-and-private-tools/';
  constructor() {}
}
