/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePageService } from './home-page.service';

describe('Service: HomePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomePageService],
      imports: [RouterTestingModule],
    });
  });

  it('should ...', inject([HomePageService], (service: HomePageService) => {
    expect(service).toBeTruthy();
  }));
});
