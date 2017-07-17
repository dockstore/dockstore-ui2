import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadcliclientComponent } from './downloadcliclient.component';

describe('DownloadcliclientComponent', () => {
  let component: DownloadcliclientComponent;
  let fixture: ComponentFixture<DownloadcliclientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadcliclientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadcliclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
