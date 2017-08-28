import { ContainertagsService } from './../../shared/swagger/api/containertags.service';
import { ContainerService } from './../../shared/container.service';
import { DockstoreTool } from './../../shared/swagger/model/dockstoreTool';
import { StateService } from './../../shared/state.service';
import { VersionModalService } from './../version-modal/version-modal.service';
import { DateService } from './../../shared/date.service';
import { Component, OnInit } from '@angular/core';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { View } from '../../shared/view';

@Component({
  selector: 'app-view-container',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
// This is actually the tag edtior
export class ViewContainerComponent extends View implements OnInit {
  public TagEditorMode = TagEditorMode;
  private tool: DockstoreTool;
  isPublic: boolean;
  constructor(dateService: DateService, private versionModalService: VersionModalService, private stateService: StateService,
    private containerService: ContainerService, private containertagsService: ContainertagsService) {
    super(dateService);
  }

  setMode(mode: TagEditorMode) {
    this.versionModalService.setVersion(this.version);
    this.versionModalService.setCurrentMode(mode);
    this.versionModalService.setIsModalShown(true);
  }

  deleteTag() {
    this.containertagsService.deleteTags(this.tool.id, this.version.id).subscribe(
      deleteResponse => {
        this.containertagsService.getTagsByPath(this.tool.id).subscribe(response => {
          this.tool.tags = response;
          this.containerService.setTool(this.tool);
        });
      });
  }

  ngOnInit() {
    this.stateService.publicPage$.subscribe(isPublic => this.isPublic = isPublic);
    this.containerService.tool$.subscribe(tool => this.tool = tool);
  }
}
