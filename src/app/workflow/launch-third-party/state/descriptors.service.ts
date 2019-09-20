import { DescriptorsStore } from './descriptors-store.';
import { SourceFile } from '../../../shared/swagger';
import { Injectable } from '@angular/core';
import { Dockstore } from '../../../shared/dockstore.model';
import { ga4ghPath, ga4ghWorkflowIdPrefix } from '../../../shared/constants';

@Injectable()
export class DescriptorsService {
  constructor(private descriptorsStore: DescriptorsStore) {}

  updatePrimaryDescriptor(primaryDescriptor: SourceFile) {
    this.descriptorsStore.setState(state => {
      return {
        ...state,
        primaryDescriptor: primaryDescriptor
      };
    });
  }

  updateSecondaryDescriptors(secondaryDescriptors: Array<SourceFile>) {
    this.descriptorsStore.setState(state => {
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
