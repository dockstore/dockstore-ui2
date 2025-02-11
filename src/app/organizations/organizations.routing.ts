/*
 *    Copyright 2018 OICR
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

import { Routes } from '@angular/router';
import { OrgSchemaService } from '../shared/org-schema.service';

import { CollectionComponent } from './collection/collection.component';
import { OrganizationComponent } from './organization/organization.component';
import { OrganizationsComponent } from './organizations/organizations.component';

const ORGANIZATIONS_ROUTES: Routes = [
  { path: '', component: OrganizationsComponent, data: { title: 'Dockstore | Organizations' } },
  {
    path: ':organizationName',
    component: OrganizationComponent,
    data: { title: 'Dockstore | Organization' },
    providers: [OrgSchemaService],
  },
  { path: ':organizationName/collections/:collectionName', component: CollectionComponent, data: { title: 'Dockstore | Collection' } },
];

export const OrganizationsRouting = ORGANIZATIONS_ROUTES;
