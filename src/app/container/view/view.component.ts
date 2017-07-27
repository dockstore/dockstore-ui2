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
  isPublic: boolean;
  constructor(dateService: DateService, private versionModalService: VersionModalService, private stateService: StateService) {
    super(dateService);
  }

  setMode(mode: TagEditorMode) {
    this.versionModalService.setVersion(this.version);
    this.versionModalService.setCurrentMode(mode);
    this.versionModalService.setIsModalShown(true);
  }

  ngOnInit() {
    this.stateService.publicPage.subscribe(isPublic => this.isPublic = isPublic);
  }
}
