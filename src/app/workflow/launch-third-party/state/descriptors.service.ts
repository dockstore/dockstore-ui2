import { DescriptorsStore } from './descriptors-store.';
import { SourceFile } from '../../../shared/swagger';
import { Injectable } from '@angular/core';

@Injectable()
export class DescriptorsService {
  constructor(private descriptorsStore: DescriptorsStore) {}

  updatePrimaryDescriptor(primaryDescriptor: SourceFile) {
    this.descriptorsStore.setState(state => {
      return {
        ...state,
        primaryDescriptor: primaryDescriptor
      }
    });
  }

  updateSecondaryDescriptors(secondaryDescriptors: Array<SourceFile>) {
    this.descriptorsStore.setState(state => {
      return {
        ...state,
        secondaryDescriptors: secondaryDescriptors
      }
    })
  }
}
