import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MarkdownModule } from 'ngx-markdown';
import { NewsNotificationsComponent } from './news-notifications.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NewsNotificationsComponent', () => {
  let component: NewsNotificationsComponent;
  let fixture: ComponentFixture<NewsNotificationsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MarkdownModule, NewsNotificationsComponent],
        providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
