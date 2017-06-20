/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RegisterToolService } from './register-tool.service';

describe('Service: RegisterTool', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterToolService]
    });
  });

  it('should ...', inject([RegisterToolService], (service: RegisterToolService) => {
    expect(service).toBeTruthy();
  }));
});