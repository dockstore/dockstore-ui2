import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCLIClientComponent } from './downloadcliclient.component';

describe('DownloadCLIClientComponent', () => {
  let component: DownloadCLIClientComponent;
  let fixture: ComponentFixture<DownloadCLIClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadCLIClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCLIClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
