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
import { Observable } from 'rxjs';

import { Organisation } from '../../shared/swagger';
import { OrganizationsQuery } from '../state/organizations.query';
import { OrganizationsService } from '../state/organizations.service';

@Component({
  selector: 'organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit  {
  public organizations$: Observable<Array<Organisation>>;
  // loading$ is currently not being used because the alertService loading is used instead
  // public loading$: Observable<boolean>;
  constructor(private organizationsService: OrganizationsService, private organizationsQuery: OrganizationsQuery) { }


  ngOnInit() {
    // this.loading$ = this.organizationsQuery.loading$;
    this.organizationsService.updateOrganizations();
    this.organizations$ = this.organizationsQuery.organizations$;
  }
}
