import { DockstoreTool } from '../shared/swagger';
import { Tool } from './../shared/swagger/model/tool';
import { TestBed, inject } from '@angular/core/testing';

import { MytoolsService } from './mytools.service';

describe('MytoolsService', () => {
  const tool1: DockstoreTool = {
    'default_cwl_path': '',
    'default_dockerfile_path': '',
    'default_wdl_path': '',
    'gitUrl': '',
    'mode': DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    'name': 'aa',
    'namespace': 'cc',
    'private_access': false,
    'registry': DockstoreTool.RegistryEnum.QUAYIO,
    'toolname': '',
    'tool_path': 'quay.io/cc/aa'
  };
  const tool2: DockstoreTool = {
    'default_cwl_path': '',
    'default_dockerfile_path': '',
    'default_wdl_path': '',
    'gitUrl': '',
    'mode': DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    'name': 'bb',
    'namespace': 'cc',
    'private_access': false,
    'registry': DockstoreTool.RegistryEnum.QUAYIO,
    'toolname': '',
    'tool_path': 'quay.io/cc/bb'
  };
  const tool3: DockstoreTool = {
    'default_cwl_path': '',
    'default_dockerfile_path': '',
    'default_wdl_path': '',
    'gitUrl': '',
    'mode': DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    'name': 'cc',
    'namespace': 'bb',
    'private_access': false,
    'registry': DockstoreTool.RegistryEnum.QUAYIO,
    'toolname': '',
    'tool_path': 'quay.io/bb/cc'
  };
  const tool4: DockstoreTool = {
    'default_cwl_path': '',
    'default_dockerfile_path': '',
    'default_wdl_path': '',
    'gitUrl': '',
    'mode': DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    'name': 'dd',
    'namespace': 'bb',
    'private_access': false,
    'registry': DockstoreTool.RegistryEnum.QUAYIO,
    'toolname': '',
    'tool_path': 'quay.io/bb/dd'
  };
  const tool5: DockstoreTool = {
    'default_cwl_path': '',
    'default_dockerfile_path': '',
    'default_wdl_path': '',
    'gitUrl': '',
    'mode': DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    'name': 'ee',
    'namespace': 'aa',
    'private_access': false,
    'registry': DockstoreTool.RegistryEnum.QUAYIO,
    'toolname': '',
    'tool_path': 'quay.io/aa/ee'
  };
  const tool6: DockstoreTool = {
    'default_cwl_path': '',
    'default_dockerfile_path': '',
    'default_wdl_path': '',
    'gitUrl': '',
    'mode': DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    'name': 'ee',
    'namespace': 'aa',
    'private_access': false,
    'registry': DockstoreTool.RegistryEnum.QUAYIO,
    'toolname': '1',
    'tool_path': 'quay.io/aa/ee'
  };
  const tools: DockstoreTool[] = [tool1, tool2, tool4, tool3, tool5, tool6];
  const expectedResult1 = {'containers': [(tool5), (tool6)], 'isFirstOpen': false, 'namespace': 'quay.io/aa'};
  const expectedResult2 = {'containers': [(tool3), (tool4)], 'isFirstOpen': false, 'namespace': 'quay.io/bb'};
  const expectedResult3 = {'containers': [(tool1), (tool2)], 'isFirstOpen': false, 'namespace': 'quay.io/cc'};
  const expectedResult: any = [expectedResult1, expectedResult2, expectedResult3];
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MytoolsService]
    });
  });
  it('should ...', inject([MytoolsService], (service: MytoolsService) => {
    expect(service).toBeTruthy();
  }));
  it('should ...', inject([MytoolsService], (service: MytoolsService) => {
    expect(service.sortNSContainers(tools, 'asdf').length).toBe(3);
    expect(service.sortNSContainers(tools, 'asdf')).toEqual(expectedResult);
    expect(service.sortNSContainers([], 'asdf')).toEqual([]);
  }));
});
