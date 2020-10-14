import { Pipe, PipeTransform } from '@angular/core';
/*
 * File paths are show relative to the primary descriptor, but the .dockstore.yml file can only ever be in one place
 * so only display it as /.dockstore.yml
 */
@Pipe({ name: 'filePathPipe' })
export class FilePathPipe implements PipeTransform {
  transform(filePath: String): String {
    if (filePath.endsWith('.dockstore.yml')) {
      if (filePath.endsWith('.github/.dockstore.yml')) {
        return '/.github/.dockstore.yml';
      } else {
        return '/.dockstore.yml';
      }
    }
    return filePath;
  }
}
