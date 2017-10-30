import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { visitValue } from '@angular/compiler/src/util';
import { sampleTool1 } from './../test/mocked-objects';
import { ImageProviderService } from './image-provider.service';
import { ProviderService } from './provider.service';
import { ContainerService } from './container.service';
import {
    ContainerStubService,
    DateStubService,
    DockstoreStubService,
    ImageProviderStubService,
    ProviderStubService,
} from './../test/service-stubs';
import { DockstoreService } from './dockstore.service';
import { DateService } from './date.service';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExtendedToolService } from './extended-tool.service';

describe('Service: ExtendedTool', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtendedToolService,
      { provide: DateService, useClass: DateStubService},
      { provide: DockstoreService, useClass: DockstoreStubService},
      { provide: ContainerService, useClass: ContainerStubService},
      { provide: ProviderService, useClass: ProviderStubService },
      { provide: ImageProviderService, useClass: ImageProviderStubService}
    ]
    });
  });

  it('should ...', inject([ExtendedToolService], (service: ExtendedToolService) => {
    expect(service).toBeTruthy();
  }));

  it('should populate properties', inject([ExtendedToolService], (service: ExtendedToolService) => {
    const extendedTool: ExtendedDockstoreTool = service.extendTool(sampleTool1);
    expect(extendedTool.agoMessage).toEqual('an ago message');
    expect(extendedTool.email).toEqual('stripped email');
    expect(extendedTool.lastBuildDate).toEqual('a date time message');
    expect(extendedTool.lastUpdatedDate).toEqual('a date time message');
    expect(extendedTool.versionVerified).toEqual(true);
    expect(extendedTool.verifiedSources).toEqual([{version: 'c', verifiedSource: 'tester'}]);
    expect(extendedTool.imgProviderUrl).toEqual('an image provider url');
    expect(extendedTool.provider).toEqual('a provider');
    expect(extendedTool.providerUrl).toEqual('a provider url');
    expect(extendedTool.buildMode).toEqual('Fully-Automated');
    expect(extendedTool.buildModeTooltip).toEqual('Fully-Automated: All versions are automated builds');
  }));
});

