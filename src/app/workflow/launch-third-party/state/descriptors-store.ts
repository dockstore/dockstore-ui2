import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { SourceFile } from '../../../shared/swagger';

export interface DescriptorsState {
  primaryDescriptor: SourceFile;
  secondaryDescriptors: Array<SourceFile>;
}

export function createInitialState(): DescriptorsState {
  return {
    primaryDescriptor: null,
    secondaryDescriptors: Array(),
  };
}

@Injectable()
@StoreConfig({ name: 'LaunchThirdParty' })
export class DescriptorsStore extends Store<DescriptorsState> {
  constructor() {
    super(createInitialState());
  }
}
