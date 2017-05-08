import { Input, OnInit } from '@angular/core';

export abstract class VersionSelector implements OnInit {

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

}
