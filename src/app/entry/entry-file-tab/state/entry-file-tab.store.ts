import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { ToolFile } from 'app/shared/swagger';

export interface EntryFileTabState {
  unfilteredFiles: ToolFile[];
  fileTypes: ToolFile.FileTypeEnum[];
  selectedFileType: ToolFile.FileTypeEnum;
  files: ToolFile[];
  selectedFile: ToolFile;
  fileContents: string;
  downloadFilePath: string;
  validationMessage: Object;
}

export function createInitialState(): EntryFileTabState {
  return {
    unfilteredFiles: null,
    fileTypes: null,
    selectedFileType: null,
    files: null,
    selectedFile: null,
    fileContents: null,
    downloadFilePath: null,
    validationMessage: null,
  };
}

@Injectable()
@StoreConfig({ name: 'entry-file-tab' })
export class EntryFileTabStore extends Store<EntryFileTabState> {
  constructor() {
    super(createInitialState());
  }
}
