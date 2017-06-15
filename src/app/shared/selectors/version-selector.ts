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
    console.log('VersionSelector ngOnInit');
    this.onVersionChange(this.default);
  }

  ngOnChanges(changeRecord) {
    console.log('VersionSelector ONCHANGEEE');
    this.onVersionChange(this.default);
  }
  ngOnDestroy() {
    console.log('VersionSelector ONDESTROYYYYY');
  }
}
