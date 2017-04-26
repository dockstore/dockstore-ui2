import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule} from '@angular/http'
import { DescriptorsComponent } from './descriptors.component';
import { DockstoreService } from './../shared/dockstore.service';
import { SelectComponent } from './../select/select.component';
import { HighlightJsService } from 'angular2-highlight-js';
import { ContainerService} from './../containers/container/container.service';

describe('DescriptorsComponent', () => {
  let component: DescriptorsComponent;
  let fixture: ComponentFixture<DescriptorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptorsComponent, SelectComponent ],
      providers: [
        {provide: ContainerService, useClass: ContainerService},
        {provide: DockstoreService, useClass: DockstoreService}, HighlightJsService],
      imports: [ HttpModule ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
