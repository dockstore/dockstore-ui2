import { inject, TestBed } from '@angular/core/testing';

import { sampleTool1 } from '../test/mocked-objects';
import { DockstoreService } from './../shared/dockstore.service';
import { ExtendedDockstoreTool } from './../shared/models/ExtendedDockstoreTool';
import { DockstoreTool } from './../shared/swagger/model/dockstoreTool';
import { EmailService } from './email.service';

describe('Service: Email', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailService, DockstoreService],
    });
  });

  const tool: ExtendedDockstoreTool = {
    ...sampleTool1,
    tool_maintainer_email: 'fake@maintainer.email.ca',
    email: 'fake@email.ca',
    registry_string: 'registry.hub.docker.com',
    registry: DockstoreTool.RegistryEnum.DOCKERHUB,
    imgProvider: 'Docker Hub',
    tool_path: 'registry.hub.docker.com/postgres/postgres',
  };

  it('should get the right request access email href', inject([EmailService], (service: EmailService) => {
    expect(service).toBeTruthy();
    expect(service.composeRequestAccessEmail(tool)).toEqual(
      'mailto:fake@maintainer.email.ca' +
        '?subject=Dockstore%20Request%20for%20Access%20to%20registry.hub.docker.com/postgres/postgres' +
        '&body=I%20would%20like%20to%20request%20access%20to%20your%20Docker%20image%20registry.hub.docker.com/postgres/postgres.%20' +
        'My%20user%20name%20on%20Docker%20Hub%20is%20%3Cusername%3E'
    );
  }));

  it('should get the right contact author email href', inject([EmailService], (service: EmailService) => {
    expect(service).toBeTruthy();
    expect(service.composeContactAuthorEmail(tool)).toEqual(
      'mailto:fake@email.ca' + '?subject=Dockstore%20registry.hub.docker.com/postgres/postgres%20inquiry' + '&body='
    );
  }));
});
