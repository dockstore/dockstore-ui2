import { VersionSelector } from './version-selector';

export abstract class DescriptorSelector extends VersionSelector {

  protected currentDescriptor;
  protected descriptors: Array<any>;
  protected nullDescriptors: boolean;

  abstract getDescriptors(version): Array<any>;
  abstract reactToDescriptor(): void;

  reactToVersion(): void {
    this.descriptors = this.getDescriptors(this.currentVersion);
    if (this.descriptors) {
      this.nullDescriptors = false;
      if (this.descriptors.length) {
        this.onDescriptorChange(this.descriptors[0]);
      }
    } else {
      this.nullDescriptors = true;
    }
  }

  onDescriptorChange(descriptor) {
    this.currentDescriptor = descriptor;
    this.reactToDescriptor();
  }
}
