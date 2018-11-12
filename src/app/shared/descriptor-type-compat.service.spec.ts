/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DescriptorTypeCompatService } from './descriptor-type-compat.service';

describe('Service: DescriptorTypeCompat', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescriptorTypeCompatService]
    });
  });

  it('should ...', inject([DescriptorTypeCompatService], (service: DescriptorTypeCompatService) => {
    expect(service).toBeTruthy();
  }));
});
