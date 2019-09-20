import { Pipe, PipeTransform } from '@angular/core';
import { FileService } from '../file.service';

@Pipe({
  name: 'privateFilePath'
})
export class PrivateFilePathPipe implements PipeTransform {
  constructor(protected fileService: FileService) {}

  transform(filePath: string): string {
    return this.fileService.getFileName(filePath);
  }
}
