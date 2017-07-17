import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupCompleteComponent } from './setupcomplete.component';

describe('SetupCompleteComponent', () => {
  let component: SetupCompleteComponent;
  let fixture: ComponentFixture<SetupCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
