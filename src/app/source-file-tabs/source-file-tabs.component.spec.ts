import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceFileTabsComponent } from './source-file-tabs.component';

describe('SourceFileTabsComponent', () => {
  let component: SourceFileTabsComponent;
  let fixture: ComponentFixture<SourceFileTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SourceFileTabsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceFileTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
