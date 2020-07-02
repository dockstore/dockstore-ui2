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
import { takeUntil } from 'rxjs/operators';

import { Base } from '../../../shared/base';
import { StarOrganizationService } from '../../../shared/star-organization.service';
import { User } from '../../../shared/swagger';
import { UserService } from '../../../shared/user/user.service';
import { OrganizationStarringService } from '../organization-starring/organization-starring.service';

@Component({
  selector: 'app-organization-stargazers',
  templateUrl: '../../../stargazers/stargazers.component.html',
  styleUrls: ['../../../stargazers/stargazers.component.css']
})
export class OrganizationStargazersComponent extends Base implements OnInit {
  starGazers: Array<User>;

  constructor(
    private organizationStarringService: OrganizationStarringService,
    private userService: UserService,
    private starOrganizationService: StarOrganizationService
  ) {
    super();
  }

  ngOnInit() {
    this.starOrganizationService.starOrganization$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(organization => {
      if (organization && organization.theOrganization) {
        this.organizationStarringService.getStarring(organization.theOrganization.id).subscribe((starring: Array<User>) => {
          this.starGazers = starring;
          this.starGazers.forEach((user: User) => {
            user.avatarUrl = this.userService.gravatarUrl(null, user.avatarUrl);
          });
        });
      }
    });
  }
}
