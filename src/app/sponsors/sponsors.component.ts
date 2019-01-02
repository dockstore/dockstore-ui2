/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { Sponsor } from './sponsor.model';
import { SponsorsService } from './sponsors.service';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css'],
  providers: [SponsorsService]
})
export class SponsorsComponent implements OnInit {

  public sponsors: Sponsor[];
  public partners: Sponsor[];
  public showSecondRow = false;

  constructor(private sponsorsService: SponsorsService, private location: Location, private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideSecondRow();
      }
    });
  }

  ngOnInit() {
    // Initialize sponsors and partners
    this.sponsors = this.sponsorsService.getSponsors();
    this.partners = this.sponsorsService.getPartners();
  }

  hideSecondRow() {
    // Hide the second row if not on the home page
    const currentPath = this.location.prepareExternalUrl(this.location.path());
    if (currentPath === '/') {
      this.showSecondRow = true;
    } else {
      this.showSecondRow = false;
    }
  }

}
