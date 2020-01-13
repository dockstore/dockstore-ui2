import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsUpdatesComponent } from './news-updates.component';

describe('NewsUpdatesComponent', () => {
  let component: NewsUpdatesComponent;
  let fixture: ComponentFixture<NewsUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewsUpdatesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
