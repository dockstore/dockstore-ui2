import { Input, OnInit, OnChanges} from '@angular/core';

export abstract class VersionSelector implements OnInit, OnChanges {

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
  }

  ngOnChanges(changeRecord) {
    this.onVersionChange(this.default);
  }

}
