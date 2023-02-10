import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from './../shared/provider.service';
import { StarentryService } from './../shared/starentry.service';
import { UsersService } from './../shared/swagger/api/users.service';
import { StarringService } from './../starring/starring.service';
import { OrgLogoService } from './../shared/org-logo.service';
import {
  ImageProviderStubService,
  StarEntryStubService,
  StarringStubService,
  UsersStubService,
  OrgLogoStubService,
} from './../test/service-stubs';
import { StarredEntriesComponent } from './starredentries.component';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StarredEntriesComponent', () => {
  let component: StarredEntriesComponent;
  let fixture: ComponentFixture<StarredEntriesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientTestingModule],
        declarations: [StarredEntriesComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: StarringService, useClass: StarringStubService },
          { provide: ImageProviderService, useClass: ImageProviderStubService },
          ProviderService,
          { provide: StarentryService, useClass: StarEntryStubService },
          { provide: UsersService, useClass: UsersStubService },
          { provide: OrgLogoService, useClass: OrgLogoStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.galaxyShortfriendlyName === 'Galaxy');
  });
  it('should check isOwner', () => {
    component.user = {
      id: 5,
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
