import { Pipe, PipeTransform } from '@angular/core';

import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { FileService } from '../file.service';
import { ToolDescriptor } from '../swagger';

@Pipe({
  name: 'publicFileDownload',
})
export class PublicFileDownloadPipe implements PipeTransform {
  constructor(protected fileService: FileService) {}

  transform(
    sourcefile: SourceFile,
    entrypath: string,
    selectedVersion: any,
    descriptorType: ToolDescriptor.TypeEnum,
    entryType: string
  ): string {
    return this.fileService.getDescriptorPath(entrypath, selectedVersion, sourcefile, descriptorType, entryType);
  }
}
