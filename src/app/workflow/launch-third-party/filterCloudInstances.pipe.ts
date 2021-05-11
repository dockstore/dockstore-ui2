import { Pipe, PipeTransform } from '@angular/core';
import { CloudInstance } from '../../shared/openapi';

@Pipe({
  name: 'filterCloudInstances',
})
export class FilterCloudInstancesPipe implements PipeTransform {
  transform(cloudInstances: Array<CloudInstance>, filterFor: string): Array<CloudInstance> {
    if (cloudInstances && filterFor) {
      return cloudInstances.filter((ci: CloudInstance) => ci.partner === filterFor);
    }
    return null;
  }
}
