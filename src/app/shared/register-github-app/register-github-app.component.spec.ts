import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { RegisterGithubAppComponent } from './register-github-app.component';
import { MatDialogRef } from '@angular/material/dialog';
import { EntryType } from '../openapi';
import { EntryTypeMetadataService } from 'app/entry/type-metadata/entry-type-metadata.service';
import { EntryTypeMetadataStubService } from 'app/test/service-stubs';

describe('RegisterGithubAppComponent', () => {
  let component: RegisterGithubAppComponent;
  let fixture: ComponentFixture<RegisterGithubAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule, RegisterGithubAppComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        { provide: EntryTypeMetadataService, useClass: EntryTypeMetadataStubService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterGithubAppComponent);
    component = fixture.componentInstance;
    component.entryType = EntryType.WORKFLOW;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
