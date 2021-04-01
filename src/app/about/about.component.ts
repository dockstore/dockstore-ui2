import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Funder, FundingComponent } from '../funding/funding.component';
import { CollectionsQuery } from '../organizations/state/collections.query';
import { CollectionsService } from '../organizations/state/collections.service';
import { Dockstore } from '../shared/dockstore.model';
import { Sponsor } from '../sponsors/sponsor.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [FundingComponent],
})
export class AboutComponent implements OnInit {
  Dockstore = Dockstore;
  private readonly BROAD_ORGANIZATION_ID = 16;
  private readonly BROAD_COLLECTION_ID = 23;
  public youtubeSafeURL: SafeResourceUrl;
  public workflowsLength$: Observable<number>;
  public funders: Funder[];
  public partners: Sponsor[] = [
    new Sponsor('dnastack.png', new URL('https://dnastack.com')),
    new Sponsor('sevenbridges.png', new URL('https://www.sevenbridges.com')),
    new Sponsor('terra.png', new URL('https://terra.bio')),
    new Sponsor('dnanexus.png', new URL('https://www.dnanexus.com/')),
    new Sponsor('anvil.png', new URL('https://anvilproject.org/')),
  ];
  public contributors: Sponsor[] = [
    new Sponsor('collaboratory.svg', new URL('https://www.cancercollaboratory.org/')),
    new Sponsor('oicr.svg', new URL('https://oicr.on.ca/')),
    new Sponsor('ucsc.png', new URL('https://ucscgenomics.soe.ucsc.edu/')),
    new Sponsor('broad.svg', new URL('https://www.broadinstitute.org/')),
    new Sponsor('ga4gh.svg', new URL('https://genomicsandhealth.org/')),
    new Sponsor('pcawg.png', new URL('https://dcc.icgc.org/pcawg')),
    new Sponsor('precision.png', new URL('https://precision.fda.gov/')),
    new Sponsor('nf-core.png', new URL('https://nf-co.re/')),
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private fundingComponent: FundingComponent,
    private collectionsQuery: CollectionsQuery,
    private collectionsService: CollectionsService
  ) {
    this.youtubeSafeURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/shMr_Bd01Ko');
  }

  ngOnInit() {
    this.funders = this.fundingComponent.getFunders();

    this.collectionsService.updateCollections(this.BROAD_ORGANIZATION_ID);
    this.workflowsLength$ = this.collectionsQuery.collections$.pipe(
      map((collections) => {
        for (const index in collections) {
          if (collections[index].id === this.BROAD_COLLECTION_ID) {
            return collections[index].workflowsLength;
          }
        }
      })
    );
    // this.collectionsService.updateCollectionFromId(this.BROAD_ORGANIZATION_ID, this.BROAD_COLLECTION_ID);
    // this.workflowsLength$ = this.collectionsQuery.collections$.pipe(
    //   map((collections) => {
    //     return collections[this.BROAD_COLLECTION_ID].workflowsLength;
    //   })
    // );
  }
}
