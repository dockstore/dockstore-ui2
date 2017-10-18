import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private-icon',
  templateUrl: './private-icon.component.html',
  styleUrls: ['./private-icon.component.css']
})
export class PrivateIconComponent {

  // Change this link if necessary
  readonly privateDocsLink = '/docs/public_private_tools';
  constructor() { }
}
