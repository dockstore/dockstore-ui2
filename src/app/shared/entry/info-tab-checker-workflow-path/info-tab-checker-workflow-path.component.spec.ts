import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CheckerWorkflowStubService } from './../../../test/service-stubs';
import { CheckerWorkflowService } from './../../checker-workflow.service';
import { InfoTabCheckerWorkflowPathComponent } from './info-tab-checker-workflow-path.component';

describe('InfoTabCheckerWorkflowPathComponent', () => {
  let component: InfoTabCheckerWorkflowPathComponent;
  let fixture: ComponentFixture<InfoTabCheckerWorkflowPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TooltipModule.forRoot()],
      providers: [{ provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService }],
      declarations: [InfoTabCheckerWorkflowPathComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTabCheckerWorkflowPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
