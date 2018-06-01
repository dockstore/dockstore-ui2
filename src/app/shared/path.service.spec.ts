/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PathService } from './path.service';

describe('Service: Path', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PathService]
    });
  });

  it('should be able to calculate relative paths', inject([PathService], (service: PathService) => {
    expect(service).toBeTruthy();
    expect(service.relative('/a/b/file1', '/a/b/d/file2')).toBe('d/file2');
    expect(service.relative('/a/b/file1', '/a/file2')).toBe('../file2');
    expect(service.relative('/a/b/file1', '/a/b/file2')).toBe('file2');
    expect(service.relative('/file2', '/a/b/file2')).toBe('a/b/file2');
  }));
});
