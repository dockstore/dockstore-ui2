/*
 *    Copyright 2019 OICR
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
import { Router } from '@angular/router';

import { OrganizationQuery } from '../state/organization.query';
import { OrganizationService } from '../state/organization.service';
import { Observable } from 'rxjs';
import { Organisation } from '../../shared/swagger';

@Component({
  selector: 'organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  organization$: Observable<Organisation>;
  loading$: Observable<boolean>;
  constructor(private organizationQuery: OrganizationQuery, private router: Router,
              private organizationService: OrganizationService
  ) { }

  ngOnInit() {
    this.loading$ = this.organizationQuery.loading$;
    this.organizationService.updateOrganizationFromNameORID();
    this.organization$ = this.organizationQuery.organization$;
 }
}
