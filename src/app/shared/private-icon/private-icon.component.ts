import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private-icon',
  templateUrl: './private-icon.component.html',
  styleUrls: ['./private-icon.component.css']
})
export class PrivateIconComponent {

  // Change this link if necessary
  readonly privateDocsLink = 'https://docs.dockstore.org/docs/publisher-tutorials/public-and-private-tools/';
  constructor() { }
}
