import { TestBed, inject } from '@angular/core/testing';

import { FireCloudService } from './firecloud.service';

describe('FireCloudService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireCloudService]
    });
  });

  it('should not find import', inject([FireCloudService], (service: FireCloudService) => {
    expect(service.wdlHasImports('task foo')).toBeFalsy();
    expect(service.wdlHasImports('#import foo')).toBeFalsy();
    expect(service.wdlHasImports('importance')).toBeFalsy();
  }));

  it('should find import', inject([FireCloudService], (service: FireCloudService) => {
    expect(service.wdlHasImports('import foo')).toBeTruthy();
    const multiline = `
      #line 1
      import something
    `;
    expect(service.wdlHasImports(multiline)).toBeTruthy();
  }));
});
