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
import { MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { sampleWorkflow1 } from '../test/mocked-objects';
import { ErrorService } from './../shared/error.service';
import {
  ContainersStubService,
  ContainerStubService,
  ErrorStubService,
  UsersStubService,
  WorkflowsStubService,
} from './../test/service-stubs';
import { ContainerService } from './container.service';
import { RefreshService } from './refresh.service';
import { StateService } from './state.service';
import { ContainersService } from './swagger/api/containers.service';
import { UsersService } from './swagger/api/users.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Workflow } from './swagger/model/workflow';
import { WorkflowService } from './workflow.service';

describe('RefreshService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [BrowserAnimationsModule, MatSnackBarModule],
            providers: [RefreshService, StateService,
                { provide: ContainersService, useClass: ContainersStubService },
                { provide: ErrorService, useClass: ErrorStubService },
                { provide: WorkflowsService, useClass: WorkflowsStubService },
                { provide: ContainerService, useClass: ContainerStubService },
                { provide: WorkflowService, useClass: WorkflowService },
                { provide: UsersService, useClass: UsersStubService }
            ]
        });
    });

    it('should be created', inject([RefreshService], (service: RefreshService) => {
        expect(service).toBeTruthy();
    }));

    it('should refresh tool', inject([RefreshService, StateService, ContainerService],
        (service: RefreshService, stateService: StateService, containerService: ContainerService) => {
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
        service.refreshTool();
        stateService.refreshMessage$.subscribe(refreshing => {
            expect(refreshing).toBeFalsy();
        });
        containerService.tool$.subscribe(tool => {
            expect(tool).toEqual(refreshedTool);
        });
    }));
    it('should refresh workflow', inject([RefreshService, StateService, WorkflowService],
        (service: RefreshService, stateService: StateService, workflowService: WorkflowService) => {
            const refreshedWorkflow: Workflow = {
                'descriptorType': 'cwl',
                'gitUrl': 'refreshedGitUrl',
                'mode': Workflow.ModeEnum.FULL,
                'organization': 'refreshedOrganization',
                'repository': 'refreshedRepository',
                'workflow_path': 'refreshedWorkflowPath',
                'workflowVersions': [],
                'defaultTestParameterFilePath': 'refreshedDefaultTestParameterFilePath',
                'sourceControl': 'github.com',
                'source_control_provider': 'GITHUB'
            };
            workflowService.setWorkflows([]);
            workflowService.setWorkflow(sampleWorkflow1);
        service.refreshWorkflow();
        stateService.refreshMessage$.subscribe(refreshing => {
            expect(refreshing).toBeFalsy();
        });
        workflowService.workflow$.subscribe(workflow => {
            expect(workflow).toEqual(refreshedWorkflow);
        });
    }));
    it('should refresh all tools', inject([RefreshService, ContainerService],
        (service: RefreshService, containerService: ContainerService) => {
        service.refreshAllTools(0);
        containerService.tools$.subscribe(tools => {
            expect(tools).toEqual([]);
        });
    }));
    it('should refresh all workflows', inject([RefreshService, WorkflowService],
        (service: RefreshService, workflowService: WorkflowService) => {
        service.refreshAllWorkflows(0);
        workflowService.workflows$.subscribe(workflow => expect(workflow).toEqual([]));

    }));
});
