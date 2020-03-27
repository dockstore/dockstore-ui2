import { Component } from '@angular/core';

export interface FundingObject {
  title: string;
  website: string;
  imageSource: string;
  altImageText: string;
  content: string;
}

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss']
})
export class FundingComponent {
  CFIFunder: FundingObject = {
    title: 'CFI',
    website: 'https://www.innovation.ca/',
    imageSource: '../assets/images/sponsors/CFI_CMYK.png',
    altImageText: 'CFI Logo',
    content: `The CFI makes financial contributions to Canada’s universities, colleges, research hospitals and non-profit research
    organizations to increase their capability to carry out high quality research.`
  };
  funders: FundingObject[] = [this.CFIFunder];
  constructor() {

  }
}
