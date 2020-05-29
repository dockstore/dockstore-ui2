import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubAppsLogsComponent } from './github-apps-logs.component';

describe('GithubAppsLogsComponent', () => {
  let component: GithubAppsLogsComponent;
  let fixture: ComponentFixture<GithubAppsLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GithubAppsLogsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubAppsLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
