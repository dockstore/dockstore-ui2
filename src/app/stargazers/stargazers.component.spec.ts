import { StarentryService } from './../shared/starentry.service';
import { UserService } from '../loginComponents/user.service';
import { StarEntryStubService, StarringStubService, UserStubService } from './../test/service-stubs';
import { StarringService } from '../starring/starring.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StargazersComponent } from './stargazers.component';

describe('StargazersComponent', () => {
  let component: StargazersComponent;
  let fixture: ComponentFixture<StargazersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StargazersComponent ],
      providers: [{provide: StarringService, useClass: StarringStubService},
      {provide: UserService, useClass: UserStubService},
    {provide: StarentryService, useClass: StarEntryStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StargazersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
