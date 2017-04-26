import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule} from '@angular/http'
import { DockerfileComponent } from './dockerfile.component';
import { SelectComponent } from '../../select/select.component';
import { DockstoreService } from '../../shared/dockstore.service';
import { HttpService } from '../../shared/http.service';
import { HighlightJsService } from 'angular2-highlight-js';
describe('DockerfileComponent', () => {
  let component: DockerfileComponent;
  let fixture: ComponentFixture<DockerfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerfileComponent, SelectComponent ],
      providers: [ {provide: DockstoreService, useClass: DockstoreService}, HighlightJsService],
      imports: [HttpModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
