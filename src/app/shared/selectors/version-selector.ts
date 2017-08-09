import {Input, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {ContainerService} from '../container.service';

export abstract class VersionSelector implements OnInit, OnChanges, OnDestroy {

  @Input() versions;
  @Input() default;

  protected currentVersion;
  protected workflowCopyBtn: string;
  protected toolCopyBtn: string;

  abstract reactToVersion(): void;
  abstract copyBtnSubscript(): void;

  onVersionChange(version) {
    this.currentVersion = version;
    this.reactToVersion();
  }

  ngOnInit() {
    this.onVersionChange(this.default);
    this.copyBtnSubscript();
  }

  ngOnChanges(changeRecord) {
    this.onVersionChange(this.default);
  }
  ngOnDestroy() {
  }
}
