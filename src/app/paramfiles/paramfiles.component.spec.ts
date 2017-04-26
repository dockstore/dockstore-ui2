import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamfilesComponent } from './paramfiles.component';
import { DockstoreService } from './../shared/dockstore.service';
import { SelectComponent } from './../select/select.component';
import { HttpModule} from '@angular/http'
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { ContainerService } from './../containers/container/container.service'

describe('ParamfilesComponent', () => {
  let component: ParamfilesComponent;
  let fixture: ComponentFixture<ParamfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamfilesComponent,SelectComponent ],
      providers: [DockstoreService, HighlightJsService, ContainerService],
      imports: [HttpModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
