import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from './../shared/provider.service';
import { StarentryService } from './../shared/starentry.service';
import { UsersService } from './../shared/swagger/api/users.service';
import { StarringService } from './../starring/starring.service';
import { ImageProviderStubService, StarEntryStubService, StarringStubService, UsersStubService } from './../test/service-stubs';
import { StarredEntriesComponent } from './starredentries.component';

describe('StarredEntriesComponent', () => {
  let component: StarredEntriesComponent;
  let fixture: ComponentFixture<StarredEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StarredEntriesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: StarringService, useClass: StarringStubService },
        { provide: ImageProviderService, useClass: ImageProviderStubService },
        ProviderService,
        { provide: StarentryService, useClass: StarEntryStubService },
        { provide: UsersService, useClass: UsersStubService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('should check isOwner', () => {
    component.user = {
      id: 5
    };
    expect(component.isOwner([{ id: 5 }, { id: 10 }])).toBeTruthy();
    expect(component.isOwner([{ id: 6 }, { id: 10 }])).toBeFalsy();
  });
  it('should toggle stargazers', () => {
    component.starGazersChange();
    fixture.detectChanges();
    expect(component.starGazersClicked).toBeTruthy();
  });
});
