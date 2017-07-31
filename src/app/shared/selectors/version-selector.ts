import {Input, OnInit, OnChanges, OnDestroy} from '@angular/core';

export abstract class VersionSelector implements OnInit, OnChanges, OnDestroy {

  @Input() versions;
  @Input() default;

  protected currentVersion;

  abstract reactToVersion(): void;

  onVersionChange(version) {
    this.currentVersion = version;
    this.reactToVersion();
  }

  ngOnInit() {
    this.onVersionChange(this.default);
    console.log(this.versions);
    console.log(this.default);
  }

  ngOnChanges(changeRecord) {
    this.onVersionChange(this.default);
  }
  ngOnDestroy() {
  }
}
