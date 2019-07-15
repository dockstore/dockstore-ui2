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
import { inject, TestBed } from '@angular/core/testing';

import { sampleTool1 } from '../../test/mocked-objects';
import {
  ContainerStubService,
  DateStubService,
  DockstoreStubService,
  ImageProviderStubService,
  ProviderStubService
} from '../../test/service-stubs';
import { ContainerService } from '../container.service';
import { DateService } from '../date.service';
import { DockstoreService } from '../dockstore.service';
import { ImageProviderService } from '../image-provider.service';
import { ExtendedDockstoreTool } from '../models/ExtendedDockstoreTool';
import { ProviderService } from '../provider.service';
import { ExtendedDockstoreToolService } from './extended-dockstoreTool.service';

describe('Service: ExtendedTool', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExtendedDockstoreToolService,
        { provide: DateService, useClass: DateStubService },
        { provide: DockstoreService, useClass: DockstoreStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: ProviderService, useClass: ProviderStubService },
        { provide: ImageProviderService, useClass: ImageProviderStubService }
      ]
    });
  });

  it('should ...', inject([ExtendedDockstoreToolService], (service: ExtendedDockstoreToolService) => {
    expect(service).toBeTruthy();
  }));

  it('should populate properties', inject([ExtendedDockstoreToolService], (service: ExtendedDockstoreToolService) => {
    const extendedTool: ExtendedDockstoreTool = service.extendTool(sampleTool1);
    expect(extendedTool.agoMessage).toEqual('an ago message');
    expect(extendedTool.email).toEqual('stripped email');
    expect(extendedTool.lastBuildDate).toEqual('a date time message');
    expect(extendedTool.lastUpdatedDate).toEqual('a date time message');
    expect(extendedTool.versionVerified).toEqual(true);
    expect(extendedTool.verifiedSources).toEqual([{ version: 'c', verifiedSource: 'tester' }]);
    expect(extendedTool.imgProviderUrl).toEqual('an image provider url');
    expect(extendedTool.provider).toEqual('a provider');
    expect(extendedTool.providerUrl).toEqual('a provider url');
    expect(extendedTool.buildMode).toEqual('Manual');
    expect(extendedTool.buildModeTooltip).toEqual('Manual: No versions are automated builds');
  }));
});
