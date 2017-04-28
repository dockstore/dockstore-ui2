import { VersionSelector } from './version-selector';

export abstract class DescriptorSelector extends VersionSelector {

  protected currentDescriptor;
  protected descriptors: Array<any>;

  abstract getDescriptors(version): Array<any>;
  abstract reactToDescriptor(): void;

  reactToVersion(): void {
    this.descriptors = this.getDescriptors(this.currentVersion);

    if (this.descriptors.length) {
      this.onDescriptorChange(this.descriptors[0]);
    }
  }

  onDescriptorChange(descriptor) {
    this.currentDescriptor = descriptor;

    this.reactToDescriptor();
  }

}
