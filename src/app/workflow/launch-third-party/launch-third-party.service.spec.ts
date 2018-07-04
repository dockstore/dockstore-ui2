import { TestBed, inject } from '@angular/core/testing';

import { LaunchThirdPartyService } from './launch-third-party.service';

describe('FireCloudService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LaunchThirdPartyService]
    });
  });

  it('should not find http import', inject([LaunchThirdPartyService], (service: LaunchThirdPartyService) => {
    expect(service.wdlHasHttpImports('task foo')).toBeFalsy();
    expect(service.wdlHasHttpImports('#import foo')).toBeFalsy();
    expect(service.wdlHasHttpImports('importance')).toBeFalsy();
    expect(service.wdlHasHttpImports('import "foo"')).toBeFalsy();
  }));

  it('should find http(s) import', inject([LaunchThirdPartyService], (service: LaunchThirdPartyService) => {
    const multiline1 = `
      #line 1
      import "http://something"
    `;
    const multiline2 = `
      #line 1
      import "https://something"
    `;
    expect(service.wdlHasHttpImports(multiline1)).toBeTruthy();
  }));
});
