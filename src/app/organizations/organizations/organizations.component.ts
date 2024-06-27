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
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LegacyPageEvent as PageEvent, MatLegacyPaginatorModule } from '@angular/material/legacy-paginator';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { Base } from '../../shared/base';
import { formInputDebounceTime } from '../../shared/constants';
import { Organization } from '../../shared/openapi';
import { TrackLoginService } from '../../shared/track-login.service';
import { OrganizationsQuery } from '../state/organizations.query';
import { OrganizationsStateService } from '../state/organizations.service';
import { RequireAccountsModalComponent } from '../registerOrganization/requireAccountsModal/require-accounts-modal.component';
import { OrgLogoService } from '../../shared/org-logo.service';
import { GravatarPipe } from '../../gravatar/gravatar.pipe';
import { ImgFallbackDirective } from '../../shared/img-fallback.directive';
import { RouterLink } from '@angular/router';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    FlexModule,
    NgIf,
    ExtendedModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatLegacyFormFieldModule,
    MatLegacySelectModule,
    MatLegacyOptionModule,
    MatLegacyInputModule,
    MatIconModule,
    NgFor,
    MatLegacyCardModule,
    RouterLink,
    ImgFallbackDirective,
    MatLegacyPaginatorModule,
    AsyncPipe,
    GravatarPipe,
  ],
})
export class OrganizationsComponent extends Base implements OnInit {
  public orgLength$: Observable<number>;
  public organizationSearchForm: UntypedFormGroup;
  public loading$: Observable<boolean>;
  public isLoggedIn$: Observable<boolean>;
  public pagedOrganizations: Array<Organization>;
  public readonly initialPageSize = 9;
  public filteredOrganizations: Array<Organization>;

  constructor(
    private organizationsStateService: OrganizationsStateService,
    private organizationsQuery: OrganizationsQuery,
    private formBuilder: UntypedFormBuilder,
    private alertQuery: AlertQuery,
    private matDialog: MatDialog,
    private trackLoginService: TrackLoginService,
    public orgLogoService: OrgLogoService
  ) {
    super();
  }

  ngOnInit() {
    this.isLoggedIn$ = this.trackLoginService.isLoggedIn$;
    this.organizationsStateService.updateSearchNameState('');
    this.organizationSearchForm = this.formBuilder.group({ name: '', sort: '' });
    this.loading$ = this.alertQuery.showInfo$;
    // The real loading$ is currently not being used because the alertQuery global loading is used instead
    // this.loading$ = this.organizationsQuery.loading$;
    this.organizationsStateService.updateOrganizations();
    this.organizationsQuery.filteredOrganizations$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((filteredOrganizations) => {
      this.filteredOrganizations = filteredOrganizations;
      if (filteredOrganizations) {
        this.pagedOrganizations = filteredOrganizations.slice(0, this.initialPageSize);
      }
    });
    this.orgLength$ = this.organizationsQuery.orgsLength$;
    this.organizationSearchForm
      .get('name')
      .valueChanges.pipe(debounceTime(formInputDebounceTime), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((searchName: string) => {
        this.organizationsStateService.updateSearchNameState(searchName);
      });

    this.organizationSearchForm
      .get('sort')
      .valueChanges.pipe(debounceTime(formInputDebounceTime), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((sortBy: 'starred' | 'name') => {
        this.organizationsStateService.updateSort(sortBy);
      });
  }
  /**
   * When the create organization button is clicked.
   * Opens the dialog to create organization
   *
   * @memberof OrganizationsComponent
   */
  requireAccounts(): void {
    this.matDialog.open(RequireAccountsModalComponent, { width: '600px' });
  }

  onPageChange(event: PageEvent) {
    const organizations = this.filteredOrganizations;
    const length = organizations.length;
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > length) {
      endIndex = length;
    }
    this.pagedOrganizations = organizations.slice(startIndex, endIndex);
  }

  clearSearch() {
    this.organizationSearchForm.get('name').setValue('');
  }
}
