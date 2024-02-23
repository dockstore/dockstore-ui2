import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { HomePageModule } from '../../home-page.module';
import { NewsBoxComponent } from './news-box.component';

describe('NewsBoxComponent', () => {
  let component: NewsBoxComponent;
  let fixture: ComponentFixture<NewsBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatLegacyCardModule, MatDividerModule, HomePageModule],
      declarations: [NewsBoxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
