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

import { sampleTool1 } from '../test/mocked-objects';
import {
  CheckerWorkflowStubService,
  DateStubService,
  DockstoreStubService,
  ImageProviderStubService,
  ProviderStubService,
} from '../test/service-stubs';
import { sampleTool2, sampleTool3 } from './../test/mocked-objects';
import { ContainerService } from './container.service';
import { DateService } from './date.service';
import { DockstoreService } from './dockstore.service';
import { ImageProviderService } from './image-provider.service';
import { ProviderService } from './provider.service';
import { CheckerWorkflowService } from './state/checker-workflow.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';

describe('ContainerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContainerService,
        { provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService },
        { provide: ProviderService, useClass: ProviderStubService },
        { provide: ImageProviderService, useClass: ImageProviderStubService },
        { provide: DateService, useClass: DateStubService },
        { provide: DockstoreService, useClass: DockstoreStubService },
      ],
    });
  });

  it('should be created', inject([ContainerService], (service: ContainerService) => {
    expect(service).toBeTruthy();
  }));
  it('should set observables', inject([ContainerService], (service: ContainerService) => {
    const tool: DockstoreTool = sampleTool1;

    service.setTool(tool);
    service.setCopyBtn('1');
    service.copyBtn$.subscribe((value) => expect(value).toEqual('1'));
  }));

  it('should replace tool', inject([ContainerService], (service: ContainerService) => {
    const tools: DockstoreTool[] = [sampleTool1, sampleTool2, sampleTool3];
    service.setTools(tools);
    const newSampleTool1: DockstoreTool = {
      id: 1,
      default_cwl_path: 'sampleDefaultCWLPath',
      default_dockerfile_path: 'sampleDefaultDockerfilePath',
      default_wdl_path: 'sampleDefaultWDLPath',
      gitUrl: 'sampleGitUrl',
      mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
      name: 'sampleName',
      namespace: 'sampleNamespace',
      private_access: false,
      registry_string: 'quay.io',
      registry: DockstoreTool.RegistryEnum.QUAYIO,
      toolname: 'sampleToolname',
      defaultCWLTestParameterFile: 'sampleDefaultCWLTestParameterFile',
      defaultWDLTestParameterFile: 'sampleDefaultWDLTestParameterFile',
    };
    service.replaceTool(newSampleTool1);
    expect(service.tools$.getValue()).toEqual([newSampleTool1, sampleTool2, sampleTool3]);
  }));

  it('should add to tools', inject([ContainerService], (service: ContainerService) => {
    const tools: DockstoreTool[] = [sampleTool1, sampleTool2];
    service.setTools(tools);
    service.addToTools(tools, sampleTool3);
    expect(service.tools$.getValue()).toEqual([sampleTool1, sampleTool2, sampleTool3]);
  }));
});
