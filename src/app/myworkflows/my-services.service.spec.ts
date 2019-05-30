/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyServicesService } from './my-services.service';

describe('Service: MyServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyServicesService]
    });
  });

  it('should ...', inject([MyServicesService], (service: MyServicesService) => {
    expect(service).toBeTruthy();
  }));
});
