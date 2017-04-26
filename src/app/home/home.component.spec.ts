import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing'
import { HttpModule} from '@angular/http'
import { HomeComponent } from './home.component';
import { ListContainersComponent } from './../containers/list/list.component'
import { ListWorkflowsComponent } from './../workflows/list/list.component'
import { ListWorkflowsService } from './../workflows/list/list.service';
import { TabComponent } from './../tab/tab.component'
import { TabsComponent } from './../tabs/tabs.component'
import { HomeFootNoteComponent } from './../home-foot-note/home-foot-note.component'
import { DataTablesModule } from 'angular-datatables';
import { ClipboardModule } from 'ngx-clipboard';
import { ListContainersService } from './../containers/list/list.service'
import { DockstoreService } from './../shared/dockstore.service';
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, HomeFootNoteComponent, TabsComponent, ListContainersComponent, ListWorkflowsComponent, TabComponent],
      imports: [DataTablesModule, RouterTestingModule, ClipboardModule, HttpModule],
      providers: [ListContainersService, DockstoreService, ListWorkflowsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
