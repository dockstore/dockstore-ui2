import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFootNoteComponent } from './home-foot-note.component';

describe('HomeFootNoteComponent', () => {
  let component: HomeFootNoteComponent;
  let fixture: ComponentFixture<HomeFootNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeFootNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFootNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
