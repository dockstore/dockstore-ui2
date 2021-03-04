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
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// import { OrganizationsPaginatorDirective } from './organizations-paginator.directive';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { Base } from '../../shared/base';
import { formInputDebounceTime } from '../../shared/constants';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { Organization } from '../../shared/swagger';
import { TrackLoginService } from '../../shared/track-login.service';
import { RegisterOrganizationComponent } from '../registerOrganization/register-organization.component';
import { OrganizationsQuery } from '../state/organizations.query';
import { OrganizationsStateService } from '../state/organizations.service';

@Component({
  selector: 'organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss'],
})
export class OrganizationsComponent extends Base implements OnInit, AfterViewInit {
  public filteredOrganizations$: Observable<Array<Organization>>;
  public organizationSearchForm: FormGroup;
  public loading$: Observable<boolean>;
  public isLoggedIn$: Observable<boolean>;
  public dataSource: MatTableDataSource<Organization>;
  @ViewChild(MatPaginator, { static: true }) protected paginator: MatPaginator;
  obs: Observable<Array<Organization>>;

  constructor(
    private organizationsStateService: OrganizationsStateService,
    private organizationsQuery: OrganizationsQuery,
    private formBuilder: FormBuilder,
    private alertQuery: AlertQuery,
    private matDialog: MatDialog,
    private trackLoginService: TrackLoginService,
    private changeDetectorRef: ChangeDetectorRef
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
    this.filteredOrganizations$ = this.organizationsQuery.filteredOrganizations$;
    this.organizationSearchForm
      .get('name')
      .valueChanges.pipe(debounceTime(formInputDebounceTime), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((searchName: string) => {
        this.organizationsStateService.updateSearchNameState(searchName);
      });

    this.organizationSearchForm
      .get('sort')
      .valueChanges.pipe(debounceTime(formInputDebounceTime), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((sortBy: string) => {
        this.organizationsStateService.updateSort(sortBy);
      });

    this.filteredOrganizations$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((orgs) => (this.dataSource = new MatTableDataSource<Organization>(orgs)));
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
    console.log(this.obs);
  }

  ngAfterViewInit() {}
  /**
   * When the create organization button is clicked.
   * Opens the dialog to create organization
   *
   * @memberof OrganizationsComponent
   */
  createOrganization(): void {
    this.matDialog.open(RegisterOrganizationComponent, { data: { organization: null, mode: TagEditorMode.Add }, width: '600px' });
  }

  // privateNgOnInit(): Observable<Array<Organization>>{
  //   return this.organizationsQuery.filteredOrganizations$;
  // }
}
