import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomMaterialModule } from './../../shared/modules/material.module';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { TokenService } from './../../loginComponents/token.service';
import { WorkflowsStubService, TokenStubService } from './../../test/service-stubs';
import { PermissionsComponent } from './permissions.component';

describe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionsComponent ],
      imports: [ CustomMaterialModule ],
      providers: [
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: TokenService, useClass: TokenStubService }
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
