import { Component } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-github-landing-page',
  templateUrl: './github-landing-page.component.html',
  styleUrls: ['./github-landing-page.component.scss'],
})
export class GithubLandingPageComponent {
  Dockstore = Dockstore;
}
