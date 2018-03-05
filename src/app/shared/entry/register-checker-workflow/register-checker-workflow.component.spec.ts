import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import {
  CheckerWorkflowStubService,
  DescriptorLanguageStubService,
  RegisterCheckerWorkflowStubService,
} from './../../../test/service-stubs';
import { CheckerWorkflowService } from './../../checker-workflow.service';
import { ErrorService } from './../../error.service';
import { DescriptorLanguageService } from './../descriptor-language.service';
import { RegisterCheckerWorkflowComponent } from './register-checker-workflow.component';
import { RegisterCheckerWorkflowService } from './register-checker-workflow.service';

describe('RegisterCheckerWorkflowComponent', () => {
  let component: RegisterCheckerWorkflowComponent;
  let fixture: ComponentFixture<RegisterCheckerWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterCheckerWorkflowComponent],
      imports: [ModalModule.forRoot(), FormsModule],
      providers: [{provide: RegisterCheckerWorkflowService, useClass: RegisterCheckerWorkflowStubService},
        {provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService }, ErrorService,
        {provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCheckerWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
