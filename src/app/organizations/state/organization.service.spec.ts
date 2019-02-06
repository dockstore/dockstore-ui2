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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { OrganizationService } from './organization.service';
import { OrganizationStore } from './organization.store';

@Component({
  template: `<router-outlet></router-outlet>`
})
export class OrganizationsComponent {
}

export const MOCK_ORGANIZATIONS_ROUTES: Routes = [
  { path: '**', component: OrganizationsComponent }
];

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationStore: OrganizationStore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationsComponent ],
      providers: [OrganizationService, OrganizationStore],
      imports: [HttpClientTestingModule, MatSnackBarModule, RouterTestingModule.withRoutes(MOCK_ORGANIZATIONS_ROUTES)]
    });

    organizationService = TestBed.get(OrganizationService);
    organizationStore = TestBed.get(OrganizationStore);
  });

  it('should be created', () => {
    expect(organizationService).toBeDefined();
  });

  it('can get number organizationId', fakeAsync(() => {
    const router: Router = TestBed.get(Router);
    router.navigateByUrl('/organizations/1/collections/2').then(() => {
      expect(router.url).toBe('/organizations/1/collections/2');
      expect(organizationService.getNextSegmentPath('organizations')).toEqual('1');
    });
  }));

  it('can get string organizationId', fakeAsync(() => {
    const router: Router = TestBed.get(Router);
    router.navigateByUrl('/organizations/potato/collections/2').then(() => {
      expect(router.url).toBe('/organizations/potato/collections/2');
      expect(organizationService.getNextSegmentPath('organizations')).toEqual('potato');
    });
  }));

  it('can get collectionId', fakeAsync(() => {
    const router: Router = TestBed.get(Router);
    router.navigateByUrl('/organizations/1/collections/2').then(() => {
      expect(router.url).toBe('/organizations/1/collections/2');
      expect(organizationService.getNextSegmentPath('collections')).toEqual('2');
    });
  }));
});
