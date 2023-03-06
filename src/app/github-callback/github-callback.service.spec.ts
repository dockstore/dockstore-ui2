/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EntryType } from 'app/shared/enum/entry-type';
import { GithubCallbackService } from './github-callback.service';

describe('Service: GithubCallback', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [GithubCallbackService],
    });
  });

  it('should compile', inject([GithubCallbackService], (service: GithubCallbackService) => {
    expect(service).toBeTruthy();
  }));
});
