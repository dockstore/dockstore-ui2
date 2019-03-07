import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { SourceFile, ToolFile } from '../../../shared/swagger';
import FileTypeEnum = ToolFile.FileTypeEnum;

export interface DescriptorsState {
   primaryDescriptor: SourceFile;
   secondaryDescriptors: Array<SourceFile>;
   descriptorType: FileTypeEnum;
}

export function createInitialState(): DescriptorsState {
  return {
    primaryDescriptor: null,
    secondaryDescriptors: Array(),
    descriptorType: null
  };
}

@Injectable()
@StoreConfig({ name: 'LaunchThirdParty' })
export class DescriptorsStore extends Store<DescriptorsState> {

  constructor() {
    super(createInitialState());
  }

}

