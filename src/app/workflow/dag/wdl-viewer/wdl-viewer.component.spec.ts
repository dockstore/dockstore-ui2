import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WdlViewerComponent } from './wdl-viewer.component';

describe('WdlViewerComponent', () => {
  let component: WdlViewerComponent;
  let fixture: ComponentFixture<WdlViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WdlViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WdlViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
