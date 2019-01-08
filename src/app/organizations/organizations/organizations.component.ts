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
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AlertQuery } from '../../shared/alert/state/alert.query';
import { Base } from '../../shared/base';
import { formInputDebounceTime } from '../../shared/constants';
import { Organisation } from '../../shared/swagger';
import { OrganizationsQuery } from '../state/organizations.query';
import { OrganizationsService } from '../state/organizations.service';

@Component({
  selector: 'organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent extends Base implements OnInit {
  public filteredOrganizations$: Observable<Array<Organisation>>;
  public organizationSearchForm: FormGroup;
  public loading$: Observable<boolean>;

  constructor(private organizationsService: OrganizationsService, private organizationsQuery: OrganizationsQuery,
    private formBuilder: FormBuilder, private alertQuery: AlertQuery) {
    super();
  }

  ngOnInit() {
    this.organizationSearchForm = this.formBuilder.group({ name: '' });
    this.loading$ = this.alertQuery.showInfo$;
    // The real loading$ is currently not being used because the alertQuery global loading is used instead
    // this.loading$ = this.organizationsQuery.loading$;
    this.organizationsService.updateOrganizations();
    this.filteredOrganizations$ = this.organizationsQuery.filteredOrganizations$;
    this.organizationSearchForm.get('name').valueChanges.pipe(
      debounceTime(formInputDebounceTime),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    ).subscribe((searchName: string) => {
      this.organizationsService.updateSearchNameState(searchName);
    });
  }

  /**
   * When the create organization button is clicked.
   * Opens the dialog to create organization
   *
   * @memberof OrganizationsComponent
   */
  createOrganization(): void {
    console.log('Placeholder until createOrganizationDialog is hooked up');
  }
}
