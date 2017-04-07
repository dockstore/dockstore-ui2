import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamfilesComponent } from './paramfiles.component';

describe('ParamfilesComponent', () => {
  let component: ParamfilesComponent;
  let fixture: ComponentFixture<ParamfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
