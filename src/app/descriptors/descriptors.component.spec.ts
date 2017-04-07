import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptorsComponent } from './descriptors.component';

describe('DescriptorsComponent', () => {
  let component: DescriptorsComponent;
  let fixture: ComponentFixture<DescriptorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
