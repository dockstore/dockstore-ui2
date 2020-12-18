import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RefreshService } from '../../shared/refresh.service';
import { TokenService } from '../../shared/state/token.service';
import { CustomMaterialModule } from './../../shared/modules/material.module';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { RefreshStubService, TokenStubService, WorkflowsStubService } from './../../test/service-stubs';
import { PermissionsComponent } from './permissions.component';

describe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PermissionsComponent],
        imports: [CustomMaterialModule],
        providers: [
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          { provide: TokenService, useClass: TokenStubService },
          { provide: RefreshService, useClass: RefreshStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
