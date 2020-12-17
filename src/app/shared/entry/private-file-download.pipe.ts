import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { FileService } from '../file.service';

@Pipe({
  name: 'privateFileDownload',
})
export class PrivateFileDownloadPipe implements PipeTransform {
  constructor(protected fileService: FileService) {}

  transform(content: string): SafeUrl {
    return this.fileService.getFileData(content);
  }
}
