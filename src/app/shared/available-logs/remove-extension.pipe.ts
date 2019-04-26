import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remove-extension'
})
export class RemoveExtensionPipe implements PipeTransform {

  transform(filename: string): string {
    return filename.split('.')[0];
  }
}
