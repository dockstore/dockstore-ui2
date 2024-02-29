import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { ContainerService } from '../../shared/container.service';
import { ContainerStubService } from '../../test/service-stubs';
import { MastodonService } from '../../shared/mastodon/mastodon.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DashboardComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterTestingModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientTestingModule, MatSnackBarModule],
        providers: [MastodonService, RegisterToolService, { provide: ContainerService, useClass: ContainerStubService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
