import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionsWorkflowComponent } from './versions.component';

describe('VersionsWorkflowComponent', () => {
  let component: VersionsWorkflowComponent;
  let fixture: ComponentFixture<VersionsWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionsWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionsWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
