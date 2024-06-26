/*
 *    Copyright 2017 OICR
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
import { EntryType } from 'app/shared/enum/entry-type';
import { EmailService } from '../container/email.service';
import { InfoTabService } from '../container/info-tab/info-tab.service';
import { ToolLaunchService } from '../container/launch/tool-launch.service';
import { VersionModalService } from '../container/version-modal/version-modal.service';
import { MyToolComponent } from './my-tool/my-tool.component';
import { MyToolsComponent } from './mytools.component';

const MYTOOLS_ROUTES: Routes = [
  {
    path: '',
    component: MyToolsComponent,
    data: { title: 'Dockstore | My Tools' },
    children: [
      {
        path: '**',
        component: MyToolComponent,
        data: { title: 'Dockstore | My Tools', entryType: EntryType.Tool },
        providers: [EmailService, InfoTabService, ToolLaunchService, VersionModalService],
      },
    ],
  },
];
export const mytoolsRouting = MYTOOLS_ROUTES;
