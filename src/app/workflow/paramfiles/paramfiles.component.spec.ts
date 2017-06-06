import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamfilesWorkflowComponent } from './paramfiles.component';

describe('ParamfilesWorkflowComponent', () => {
  let component: ParamfilesWorkflowComponent;
  let fixture: ComponentFixture<ParamfilesWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamfilesWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamfilesWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
