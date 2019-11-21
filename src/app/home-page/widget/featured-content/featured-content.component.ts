import { Component, Input, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { Dockstore } from '../../../shared/dockstore.model';

@Component({
  selector: 'featured-content',
  template: `
    <div [innerHTML]="myExternalHTML"></div>
  `
})
export class FeaturedContentComponent {
  myExternalHTML: any = '';

  // text locally
  //   constructor(http: HttpClient) {
  //     const html = `
  //     <div class="feat-content-container">
  //
  //     <div class="feat-content-card">
  //       <a href="/organizations/HCA" class="cardClick">
  //             <h3 class="feat-content-title"> Human Cell Atlas </h3>
  //                 <img src="https://www.gravatar.com/avatar/000?d=https://i.imgur.com/RtyoPa2.png"class="orgLogo" width="25%"/>
  //                 <p class="feat-card-description">Test: Did file overwrite? After PR Merge??</p>
  //                 </a>
  //     </div>
  //
  //     <div class="feat-content-card">
  //     <a class="cardClick" href="https://docs.dockstore.org/en/develop/advanced-topics/snapshot-and-doi.html" >
  //             <h3 class="feat-content-title">Creating Snapshots and Requesting DOIs</h3>
  //             <p class="feat-card-description">Learn how to create snapshots and
  //             Digital Object Identifiers (DOIs) for workflows using Zenodo.</p>
  //         </a>
  //     </div>
  //
  //     <div class="feat-content-card">
  //         <a href="http://localhost:4200/organizations/datastage/collections/GWAS" class="cardClick">
  //             <h3 class="feat-content-title">DataSTAGE / Genome Wide Association Study</h3>
  //             <p class="feat-card-description">A collection of workflows for testing associations using mixed models.</p>
  //         </a>
  //     </div>
  //
  // </div>`;
  //
  //     of(html).subscribe(data => this.myExternalHTML = data);

  constructor(http: HttpClient) {
    http
      .get(
        Dockstore.FEATURED_CONTENT_URL,
        // set authorization header to empty, prevents ng2-ui interceptor from adding dockstore bearer token
        { headers: { Authorization: '' }, responseType: 'text' }
      )
      .subscribe(data => (this.myExternalHTML = data));
  }
}
