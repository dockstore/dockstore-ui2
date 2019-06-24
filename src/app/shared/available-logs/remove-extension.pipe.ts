import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeExtension'
})
export class RemoveExtensionPipe implements PipeTransform {
  /**
   * This removes the extension of the log filename so that only the seconds from epoch remains
   *
   * @param {string} filename  (ex. 1556226034.log)
   * @returns {string}  (ex. 1556226034)
   * @memberof RemoveExtensionPipe
   */
  transform(filename: string): string {
    return filename.split('.')[0];
  }
}
