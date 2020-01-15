import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsUpdatesComponent } from './news-updates.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NewsUpdatesComponent', () => {
  let component: NewsUpdatesComponent;
  let fixture: ComponentFixture<NewsUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewsUpdatesComponent],
      imports: [MarkdownModule, HttpClientTestingModule]
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
