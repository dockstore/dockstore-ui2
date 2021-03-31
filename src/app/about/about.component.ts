import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Funder, FundingComponent } from '../funding/funding.component';
import { Dockstore } from '../shared/dockstore.model';
import { Sponsor } from '../sponsors/sponsor.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [FundingComponent]
})
export class AboutComponent implements OnInit {
  Dockstore = Dockstore;
  public safeURL: SafeResourceUrl;
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
    private fundingComponent: FundingComponent
    ) {
    this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/shMr_Bd01Ko');
  }

  ngOnInit() {
    this.funders = this.fundingComponent.getFunders();
  }
}
