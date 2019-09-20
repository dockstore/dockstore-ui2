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

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Base } from '../shared/base';
import { Sponsor } from './sponsor.model';
import { SponsorsService } from './sponsors.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css'],
  providers: [SponsorsService]
})
export class SponsorsComponent extends Base implements OnInit {
  public sponsors: Sponsor[];
  public partners: Sponsor[];
  public languages: Sponsor[];
  public showAdditionalRows = false;

  constructor(private sponsorsService: SponsorsService, private location: Location, private router: Router) {
    super();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.hideSecondRow();
      });
  }

  ngOnInit() {
    // Initialize sponsors and partners
    this.sponsors = this.sponsorsService.getSponsors();
    this.partners = this.sponsorsService.getPartners();
    this.languages = this.sponsorsService.getLanguages();
  }

  hideSecondRow() {
    // Hide the second row if not on the home page
    const currentPath = this.location.prepareExternalUrl(this.location.path());
    if (currentPath === '/') {
      this.showAdditionalRows = true;
    } else {
      this.showAdditionalRows = false;
    }
  }
}
