import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ClipboardModule } from 'ngx-clipboard';

import { ListContainersService } from '../../containers/list/list.service';
import { ContainerService } from '../../shared/container.service';
import { RefreshService } from '../../shared/refresh.service';
import { StateService } from '../../shared/state.service';
import { ContainersService } from '../../shared/swagger';
import { ParamfilesService } from '../paramfiles/paramfiles.service';
import { DateService } from './../../shared/date.service';
import { ContainertagsService } from './../../shared/swagger/api/containertags.service';
import { realTag, realTool } from './../../test/mocked-objects';
import {
    ContainersStubService,
    ContainerStubService,
    ContainertagsStubService,
    DateStubService,
    ParamFilesStubService,
    RefreshStubService,
    StateStubService,
} from './../../test/service-stubs';
import { VersionModalComponent } from './version-modal.component';
import { VersionModalService } from './version-modal.service';

describe('VersionModalComponent', () => {
  let component: VersionModalComponent;
  let fixture: ComponentFixture<VersionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionModalComponent ],
      imports: [ModalModule.forRoot(), FormsModule, ClipboardModule],
      providers: [
        {provide: ParamfilesService, useClass: ParamFilesStubService},
        VersionModalService,
        {provide: ListContainersService, useClass: ListContainersService},
        {provide: ContainerService, useClass: ContainerStubService},
        {provide: ContainersService, useClass: ContainersStubService},
        {provide: ContainertagsService, useClass: ContainertagsStubService},
        {provide: StateService, useClass: StateStubService},
        {provide: DateService, useClass: DateStubService},
        {provide: RefreshService, useClass: RefreshStubService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have the correct docker pull command', () => {
    // Inject the real tool and real tag
    component.tool = realTool;
    component.version = realTag;
    // Manually trigger the update
    component.updateDockerPullCommand();
    // Let it detect changes
    fixture.detectChanges();
    // Check to see if the dockerPullCommand which is used in the template has the right docker pull command
    expect(component.dockerPullCommand).toEqual('docker pull quay.io/wtsicgp/dockstore-cgpmap:3.0.0-rc8');
  });
});
