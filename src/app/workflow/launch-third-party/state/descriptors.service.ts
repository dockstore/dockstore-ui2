import { Injectable } from '@angular/core';
import { ga4ghPath, ga4ghWorkflowIdPrefix } from '../../../shared/constants';
import { Dockstore } from '../../../shared/dockstore.model';
import { SourceFile } from '../../../shared/swagger';
import { DescriptorsStore } from './descriptors-store.';

@Injectable()
export class DescriptorsService {
  constructor(private descriptorsStore: DescriptorsStore) {}

  updatePrimaryDescriptor(primaryDescriptor: SourceFile) {
    this.descriptorsStore.update(state => {
      return {
        ...state,
        primaryDescriptor: primaryDescriptor
      };
    });
  }

  updateSecondaryDescriptors(secondaryDescriptors: Array<SourceFile>) {
    this.descriptorsStore.update(state => {
      return {
        ...state,
        secondaryDescriptors: secondaryDescriptors
      };
    });
  }

  trsUrl(workflowPath: string, version: string) {
    return (
      `${Dockstore.API_URI}${ga4ghPath}/tools/` +
      encodeURIComponent(`${ga4ghWorkflowIdPrefix + workflowPath}`) +
      '/versions/' +
      encodeURIComponent(`${version}`)
    );
  }
}
