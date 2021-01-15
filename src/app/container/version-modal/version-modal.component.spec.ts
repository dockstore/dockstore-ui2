// import { ClipboardModule } from 'ngx-clipboard';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ListContainersService } from '../../containers/list/list.service';
import { ContainerService } from '../../shared/container.service';
import { DateService } from '../../shared/date.service';
import { ContainersService } from '../../shared/swagger';
import { ContainertagsService } from '../../shared/swagger/api/containertags.service';
import { sampleTag, sampleTool1 } from '../../test/mocked-objects';
import {
  ContainersStubService,
  ContainerStubService,
  ContainertagsStubService,
  DateStubService,
  ParamFilesStubService,
  VersionModalStubService,
} from '../../test/service-stubs';
import { ParamfilesService } from '../paramfiles/paramfiles.service';
import { VersionModalComponent } from './version-modal.component';
import { VersionModalService } from './version-modal.service';

describe('VersionModalComponent', () => {
  let component: VersionModalComponent;
  let fixture: ComponentFixture<VersionModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [VersionModalComponent],
        imports: [FormsModule, ClipboardModule, MatSnackBarModule, MatDialogModule],
        providers: [
          { provide: ParamfilesService, useClass: ParamFilesStubService },
          { provide: VersionModalService, useClass: VersionModalStubService },
          { provide: ListContainersService, useClass: ListContainersService },
          { provide: ContainerService, useClass: ContainerStubService },
          { provide: ContainersService, useClass: ContainersStubService },
          { provide: ContainertagsService, useClass: ContainertagsStubService },
          { provide: DateService, useClass: DateStubService },
        ],
      }).compileComponents();
    })
  );

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
    const fakeTool = { ...sampleTool1, path: 'quay.io/wtsicgp/dockstore-cgpmap' };
    component.tool = fakeTool;
    const fakeTag = { ...sampleTag, name: '3.0.0-rc8' };
    component.version = fakeTag;
    // Manually trigger the update
    component.updateDockerPullCommand();
    // Let it detect changes
    fixture.detectChanges();
    // Check to see if the dockerPullCommand which is used in the template has the right docker pull command
    expect(component.dockerPullCommand).toEqual('docker pull quay.io/wtsicgp/dockstore-cgpmap:3.0.0-rc8');
  });
});
