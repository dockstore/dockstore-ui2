/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EntryType } from 'app/shared/enum/entry-type';
import { GithubCallbackService } from './github-callback.service';

describe('Service: GithubCallback', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [GithubCallbackService]
    });
  });

  it('should get the redirect URL', inject([GithubCallbackService], (service: GithubCallbackService) => {
    expect(service).toBeTruthy();
    expect(service.stateToUrl(EntryType.Tool)).toBe('/my-tools');
    expect(service.stateToUrl(EntryType.BioWorkflow)).toBe('/my-workflows');
    expect(service.stateToUrl(EntryType.Service)).toBe('/my-services');
    expect(service.stateToUrl(null)).toBe('/');
    expect(service.stateToUrl('potato')).toBe('/');
  }));
});
