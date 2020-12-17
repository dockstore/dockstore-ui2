import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Query } from '@datorama/akita';
import { FileService } from 'app/shared/file.service';
import { ToolFile } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntryFileTabState, EntryFileTabStore } from './entry-file-tab.store';

@Injectable()
export class EntryFileTabQuery extends Query<EntryFileTabState> {
  files$: Observable<ToolFile[]> = this.select((state) => state.files);
  selectedFileType$: Observable<ToolFile.FileTypeEnum> = this.select((state) => state.selectedFileType);
  selectedFile$: Observable<ToolFile> = this.select((state) => state.selectedFile);
  fileContents$: Observable<string> = this.select((state) => state.fileContents);
  validationMessage$: Observable<Object> = this.select((state) => state.validationMessage);
  fileTypes$: Observable<ToolFile.FileTypeEnum[]> = this.select((state) => state.fileTypes);
  downloadFilePath$: Observable<string> = this.select((state) => state.downloadFilePath);
  downloadButtonTooltip$: Observable<string> = this.selectedFile$.pipe(map((file: ToolFile) => (file ? file.path : null)));
  customDownloadHREF$: Observable<SafeUrl> = this.fileContents$.pipe(
    map((fileContents: string) => (fileContents ? this.fileService.getFileData(fileContents) : null))
  );
  customDownloadPath$: Observable<string> = this.selectedFile$.pipe(
    map((file: ToolFile) => (file ? this.fileService.getFileName(file.path) : null))
  );
  constructor(protected store: EntryFileTabStore, protected fileService: FileService) {
    super(store);
  }
}
