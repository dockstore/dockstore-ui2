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

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {User} from '../../../shared/swagger';
import {OrganizationsService} from '../../../shared/swagger';
import {UsersService} from '../../../shared/swagger';
import {StarRequest} from '../../../shared/swagger';

@Injectable()
export class OrganizationStarringService {
  constructor(private usersService: UsersService,  private organizationsService: OrganizationsService) { }

  setUnstar(organizationID: number): any {
    return this.organizationsService.unstarOrganization(organizationID);
  }

  setStar(organizationID: number): any {
    const body: StarRequest = {
      star: true
    };

    return this.organizationsService.starOrganization(organizationID, body);
  }

  getStarring(organizationID: number): Observable<Array<User>> {
    return this.organizationsService.getStarredUsersForApprovedOrganization(organizationID);
  }

  getStarredOrganizations(): any {
    return this.usersService.getStarredOrganizations();
  }
}
