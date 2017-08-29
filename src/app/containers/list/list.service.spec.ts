import { ListContainersService } from './list.service';
import { TestBed, inject } from '@angular/core/testing';

describe('listService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListContainersService]
    });
  });
  it('should ...', inject([ListContainersService], (service: ListContainersService) => {
    expect(service).toBeTruthy();
  }));
  it('should ...', inject([ListContainersService], (service: ListContainersService) => {
    expect(service.getDockerPullCmd('registry.hub.docker.com/a/b')).toBe('docker pull a/b');
    expect(service.getDockerPullCmd('quay.io/a/b')).toBe('docker pull quay.io/a/b');
    expect(service.getDockerPullCmd('quay.io/a/b', 'version')).toBe('docker pull quay.io/a/b:version');
    expect(service.getDockerPullCmd('quay.io/a_/b', 'version')).toBe('docker pull quay.io/ab:version');
  }));
});
