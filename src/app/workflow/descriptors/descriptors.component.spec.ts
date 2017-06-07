import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptorsWorkflowComponent } from './descriptors.component';

describe('DescriptorsWorkflowComponent', () => {
  let component: DescriptorsWorkflowComponent;
  let fixture: ComponentFixture<DescriptorsWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptorsWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
