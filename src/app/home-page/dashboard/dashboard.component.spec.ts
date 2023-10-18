import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
