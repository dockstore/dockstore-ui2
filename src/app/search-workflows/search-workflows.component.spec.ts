import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { SearchWorkflowsComponent } from './search-workflows.component';
import { HeaderComponent } from './../header/header.component'
import { ListWorkflowsComponent } from './../workflows/list/list.component'
import { ListWorkflowsService } from './../workflows/list/list.service';
import { DockstoreService} from './../shared/dockstore.service';
import { HttpModule} from '@angular/http'
describe('SearchWorkflowsComponent', () => {
  let component: SearchWorkflowsComponent;
  let fixture: ComponentFixture<SearchWorkflowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWorkflowsComponent, HeaderComponent , ListWorkflowsComponent],
      imports: [ RouterTestingModule, HttpModule ],
      providers: [ListWorkflowsService, DockstoreService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
