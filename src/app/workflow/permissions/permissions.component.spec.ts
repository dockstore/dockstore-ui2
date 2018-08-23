import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomMaterialModule } from './../../shared/modules/material.module';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { TokenService } from './../../loginComponents/token.service';
import { WorkflowsStubService, TokenStubService, RefreshStubService } from './../../test/service-stubs';
import { PermissionsComponent } from './permissions.component';
import { RefreshService } from '../../shared/refresh.service';

describe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionsComponent ],
      imports: [ CustomMaterialModule ],
      providers: [
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: TokenService, useClass: TokenStubService },
        { provide: RefreshService, useClass: RefreshStubService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
