import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RouterStub } from './../test/router-stubs';
import { UrlResolverService } from './url-resolver.service';

describe('Service: UrlResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [UrlResolverService, { provide: Router, useClass: RouterStub }]
    });
  });

  it('should ...', inject([UrlResolverService, Router], (service: UrlResolverService, router: Router) => {
    const containersPath = 'quay.io/garyluu/dockstore-tool-md5sum';
    const workflowsPath = 'github.com/garyluu/dockstore-tool-md5sum';
    const urlContainers = '/containers/quay.io/garyluu/dockstore-tool-md5sum';
    const urlContainersVersion = '/containers/quay.io/garyluu/dockstore-tool-md5sum:potato';
    const urlMyTools = '/my-tools/quay.io/garyluu/dockstore-tool-md5sum';
    const urlMyToolsVersion = '/my-tools/quay.io/garyluu/dockstore-tool-md5sum:potato';
    const urlWorkflows = '/workflows/github.com/garyluu/dockstore-tool-md5sum';
    const urlWorkflowsVersion = '/workflows/github.com/garyluu/dockstore-tool-md5sum:potato';
    const urlMyWorkflows = '/workflows/github.com/garyluu/dockstore-tool-md5sum';
    const urlMyWorkflowsVersion = '/workflows/github.com/garyluu/dockstore-tool-md5sum:potato';
    router.navigateByUrl(urlContainers);
    expect(service.getEntryPathFromUrl()).toBe(containersPath);
    router.navigateByUrl(urlContainersVersion);
    expect(service.getEntryPathFromUrl()).toBe(containersPath);
    router.navigateByUrl(urlMyTools);
    expect(service.getEntryPathFromUrl()).toBe(containersPath);
    router.navigateByUrl(urlMyToolsVersion);
    expect(service.getEntryPathFromUrl()).toBe(containersPath);
    router.navigateByUrl(urlWorkflows);
    expect(service.getEntryPathFromUrl()).toBe(workflowsPath);
    router.navigateByUrl(urlWorkflowsVersion);
    expect(service.getEntryPathFromUrl()).toBe(workflowsPath);
    router.navigateByUrl(urlMyWorkflows);
    expect(service.getEntryPathFromUrl()).toBe(workflowsPath);
    router.navigateByUrl(urlMyWorkflowsVersion);
    expect(service.getEntryPathFromUrl()).toBe(workflowsPath);
  }));
});
