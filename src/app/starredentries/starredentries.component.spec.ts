import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarredentriesComponent } from './starredentries.component';

describe('StarredentriesComponent', () => {
  let component: StarredentriesComponent;
  let fixture: ComponentFixture<StarredentriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredentriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredentriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
