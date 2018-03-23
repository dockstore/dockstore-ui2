import { DockstoreService } from './../shared/dockstore.service';
import { sampleTool1 } from '../test/mocked-objects';
import { DockstoreTool } from './../shared/swagger/model/dockstoreTool';
import { ExtendedDockstoreTool } from './../shared/models/ExtendedDockstoreTool';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmailService } from './email.service';

describe('Service: Email', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailService, DockstoreService]
    });
  });

  const tool: ExtendedDockstoreTool = sampleTool1;
  tool.tool_maintainer_email = 'fake@maintainer.email.ca';
  tool.email = 'fake@email.ca';
  tool.registry_string = 'registry.hub.docker.com';
  tool.registry = DockstoreTool.RegistryEnum.DOCKERHUB;
  tool.imgProvider = 'Docker Hub';
  tool.tool_path = 'registry.hub.docker.com/postgres/postgres';

  it('should get the right request access email href', inject([EmailService], (service: EmailService) => {
    expect(service).toBeTruthy();
    expect(service.composeRequestAccessEmail(tool)).toEqual('mailto:fake@maintainer.email.ca' +
    '?subject=Dockstore%20Request%20for%20Access%20to%20registry.hub.docker.com/postgres/postgres' +
    '&body=I%20would%20like%20to%20request%20access%20to%20your%20Docker%20image%20registry.hub.docker.com/postgres/postgres.%20' +
    'My%20user%20name%20on%20Docker%20Hub%20is%20%3Cusername%3E');
  }));

  it('should get the right contact author email href', inject([EmailService], (service: EmailService) => {
    expect(service).toBeTruthy();
    expect(service.composeContactAuthorEmail(tool)).toEqual('mailto:fake@email.ca' +
    '?subject=Dockstore%20registry.hub.docker.com/postgres/postgres%20inquiry' +
    '&body=');
  }));

});
