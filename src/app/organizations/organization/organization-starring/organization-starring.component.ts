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

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Organization, User} from '../../../shared/swagger';
import { TrackLoginService } from '../../../shared/track-login.service';
import { UserQuery } from '../../../shared/user/user.query';
import { ContainerService } from '../../../shared/container.service';
import { StarringService } from '../../../starring/starring.service';
import { StarentryService } from '../../../shared/starentry.service';
import { StarOrganizationService } from '../../../shared/star-organization.service';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { first, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { OrganizationStarringService } from './organization-starring.service';
import { calculateRate } from '../../../shared/starring';

@Component({
  selector: 'app-organization-starring',
  templateUrl: '../../../starring/starring.component.html',
  styleUrls: ['../../../starring/starring.component.css']
})
export class OrganizationStarringComponent implements OnInit, OnDestroy, OnChanges {

  @Input() organization: Organization;
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();
  private user: User;
  public isLoggedIn: boolean;
  public rate = false;
  public total_stars = 0;
  public disable = false;
  private ngUnsubscribe: Subject<{}> = new Subject();
  private starredUsers: User[];
  constructor(private trackLoginService: TrackLoginService,
              private userQuery: UserQuery,
              private containerService: ContainerService,
              private starringService: StarringService,
              private starentryService: StarentryService,
              private starOrganizationService: StarOrganizationService,
              private organizationStarringService: OrganizationStarringService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.trackLoginService.isLoggedIn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      this.user = user;
      this.rate = calculateRate(this.starredUsers, this.user);
    });
  }

  ngOnChanges() {
    if (this.organization) {
      this.setUpOrganization(this.organization);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setUpOrganization(organization: Organization) {
    this.organization = organization;
    this.getStarredUsers();
  }

  // Determine if user has starred organization.
  // calculateRate(starredUsers: User[], currentUser: User): boolean {
  //   if (!currentUser || !starredUsers) {
  //     return false;
  //   } else {
  //     return starredUsers.some(user => user.id === this.user.id);
  //   }
  // }

  /**
   * Handles the star button being clicked
   *
   * @memberof StarringComponent
   */
  setStarring() {
    this.disable = true;
    if (this.isLoggedIn) {

      const message = (this.rate ? 'Unstarring ' : 'Starring ') + this.organization.name;
      this.alertService.start(message);

      this.setStar().subscribe(
        data => {
          // update total_stars
          this.alertService.simpleSuccess();
          this.getStarredUsers();

        },
        (error) => {
          this.alertService.detailedError(error);
          this.disable = false;
        });
    }
  }

  setStar(): Observable<any> {
    if (this.rate) {
      return this.organizationStarringService.setUnstar(this.organization.id);
    } else {
      return this.organizationStarringService.setStar(this.organization.id);
    }
  }

  getStarredUsers(): void {
    if (this.organization) {
      this.organizationStarringService.getStarring(this.organization.id).pipe(first()).subscribe(
        (starring: User[]) => {
          this.total_stars = starring.length;
          this.starredUsers = starring;
          this.rate = calculateRate(starring, this.user);
          this.disable = false;
        }, error => this.disable = false);
    } else {
      this.disable = false;
    }
  }

  getStargazers() {
    const selectedOrganization = {
      theOrganization: this.organization,
    };
    this.starOrganizationService.setOrganization(selectedOrganization);
    this.change.emit();
  }
}
