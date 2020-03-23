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
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { sampleTool1, sampleWorkflow1 } from '../test/mocked-objects';
import {
  ContainersStubService,
  ContainerStubService,
  DateStubService,
  DockstoreStubService,
  GA4GHStubService,
  ProviderStubService,
  UsersStubService,
  WorkflowsStubService
} from '../test/service-stubs';
import { AlertQuery } from './alert/state/alert.query';
import { ContainerService } from './container.service';
import { DateService } from './date.service';
import { DockstoreService } from './dockstore.service';
import { ProviderService } from './provider.service';
import { RefreshService } from './refresh.service';
import { WorkflowQuery } from './state/workflow.query';
import { WorkflowService } from './state/workflow.service';
import { GA4GHService } from './swagger';
import { ContainersService } from './swagger/api/containers.service';
import { UsersService } from './swagger/api/users.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Workflow } from './swagger/model/workflow';
import { ToolQuery } from './tool/tool.query';
import DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

describe('RefreshService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatSnackBarModule],
      providers: [
        RefreshService,
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        WorkflowQuery,
        ToolQuery,
        AlertQuery,
        { provide: ProviderService, useClass: ProviderStubService },
        { provide: DateService, useClass: DateStubService },
        { provide: DockstoreService, useClass: DockstoreStubService },
        { provide: GA4GHService, useClass: GA4GHStubService },
        { provide: WorkflowService, useClass: WorkflowService },
        { provide: UsersService, useClass: UsersStubService }
      ]
    });
  });

  it('should be created', inject([RefreshService], (service: RefreshService) => {
    expect(service).toBeTruthy();
  }));

  it('should refresh tool', inject(
    [RefreshService, AlertQuery, ContainerService],
    (service: RefreshService, alertQuery: AlertQuery, containerService: ContainerService) => {
      const refreshedTool: DockstoreTool = {
        default_cwl_path: 'refreshedDefaultCWLPath',
        default_dockerfile_path: 'refreshedDefaultDockerfilePath',
        default_wdl_path: 'refreshedDefaultWDLPath',
        gitUrl: 'refreshedGitUrl',
        mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
        name: 'refreshedName',
        namespace: 'refreshedNamespace',
        private_access: false,
        registry_string: 'quay.io',
        registry: DockstoreTool.RegistryEnum.QUAYIO,
        toolname: 'refreshedToolname',
        defaultCWLTestParameterFile: 'refreshedDefaultCWLTestParameterFile',
        defaultWDLTestParameterFile: 'refreshedDefaultWDLTestParameterFile'
      };
      service.tool = sampleTool1;
      service.refreshTool();
      alertQuery.showInfo$.subscribe(refreshing => {
        expect(refreshing).toBeFalsy();
      });
    }
  ));
  it('should refresh workflow', inject(
    [RefreshService, AlertQuery, WorkflowService, WorkflowQuery],
    (service: RefreshService, alertQuery: AlertQuery, workflowService: WorkflowService, workflowQuery: WorkflowQuery) => {
      const refreshedWorkflow: Workflow = {
        descriptorType: DescriptorTypeEnum.CWL,
        gitUrl: 'refreshedGitUrl',
        mode: Workflow.ModeEnum.FULL,
        organization: 'refreshedOrganization',
        repository: 'refreshedRepository',
        workflow_path: 'refreshedWorkflowPath',
        workflowVersions: [],
        defaultTestParameterFilePath: 'refreshedDefaultTestParameterFilePath',
        sourceControl: 'github.com',
        source_control_provider: 'GITHUB',
        descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NOTAPPLICABLE
      };
      workflowService.setWorkflows([]);
      workflowService.setWorkflow(sampleWorkflow1);
      service.refreshWorkflow();
      alertQuery.showInfo$.subscribe(refreshing => {
        expect(refreshing).toBeFalsy();
      });
      // workflowQuery.workflow$.subscribe(workflow => {
      //     expect(workflow).toEqual(refreshedWorkflow);
      // });
    }
  ));
});
