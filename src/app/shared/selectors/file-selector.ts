import { Observable } from 'rxjs/Observable';

import { DescriptorSelector } from './descriptor-selector';

export abstract class FileSelector extends DescriptorSelector {

  protected currentFile;
  protected files: Array<any>;

  abstract getFiles(descriptor): Observable<any>;
  abstract reactToFile(): void;

  reactToDescriptor() {
    this.getFiles(this.currentDescriptor)
      .subscribe(files => {
        this.files = files;
        if (this.files.length) {
          this.onFileChange(this.files[0]);
        }}
      );
  }

  onFileChange(file) {
    this.currentFile = file;
    this.reactToFile();
  }

}
