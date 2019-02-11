import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileService } from '../../../shared/file.service';


import { WdlViewerComponent } from './wdl-viewer.component';

describe('WdlViewerComponent', () => {
  let component: WdlViewerComponent;
  let fixture: ComponentFixture<WdlViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WdlViewerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [FileService],
      imports: [HttpClientTestingModule]
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
