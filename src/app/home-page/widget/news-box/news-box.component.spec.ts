import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { NewsBoxComponent } from './news-box.component';

describe('NewsBoxComponent', () => {
  let component: NewsBoxComponent;
  let fixture: ComponentFixture<NewsBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatLegacyCardModule, MatDividerModule, NewsBoxComponent, HttpClientTestingModule, MatLegacySnackBarModule],
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
