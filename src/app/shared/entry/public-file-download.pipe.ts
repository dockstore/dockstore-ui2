import { Pipe, PipeTransform } from '@angular/core';
import { FileService } from '../file.service';
import { SourceFile } from '../../shared/swagger/model/sourceFile';

@Pipe({
  name: 'publicFileDownload'
})
export class PublicFileDownloadPipe implements PipeTransform {

  constructor(protected fileService: FileService) {}

  transform(sourcefile: SourceFile, entrypath: string, selectedVersion: any, descriptorType: string, entryType: string): any {
    return this.fileService.getDescriptorPath(entrypath, selectedVersion, sourcefile, descriptorType, entryType);
  }

}
