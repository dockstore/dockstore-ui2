import { Pipe, PipeTransform } from '@angular/core';
import { FileService } from '../file.service';

@Pipe({
  name: 'privateFileDownload'
})
export class PrivateFileDownloadPipe implements PipeTransform {

  constructor(protected fileService: FileService) {}

  transform(content: string): any {
    return this.fileService.getFileData(content);
  }

}
