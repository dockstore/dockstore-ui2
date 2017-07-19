import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarredEntriesComponent } from './starredentries.component';

describe('StarredEntriesComponent', () => {
  let component: StarredEntriesComponent;
  let fixture: ComponentFixture<StarredEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
