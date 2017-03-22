import { Component, OnInit } from '@angular/core';
import { Sponsor } from './sponsor.model'
import { SponsorsService } from './sponsors.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css'],
  providers: [SponsorsService]
})
export class SponsorsComponent implements OnInit {

  sponsors: Sponsor[];

  constructor(private sponsorsService: SponsorsService) { }

  onMouseOver(sponsor: Sponsor): void {
    sponsor.setToColoured();
  }

  onMouseOut(sponsor: Sponsor): void {
    sponsor.setToBW();
  }

  ngOnInit() {
    this.sponsors = this.sponsorsService.getSponsors();
  }

}
