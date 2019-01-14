import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable, of as observableOf } from 'rxjs';

import { FileWrapper, ToolFile } from '../../../shared/swagger';
import { FilesState, FilesStore } from './files.store';

@Injectable({
  providedIn: 'root'
})
export class FilesQuery extends QueryEntity<FilesState, FileWrapper> {
  getFileEntities(toolFiles: Array<ToolFile>): Observable<Array<FileWrapper>> {
    if (toolFiles) {
      // Retrieve paths of given ToolFiles
      const paths: string[] = toolFiles.map((file) => file.path);

      let FileEntities$: Observable<Array<FileWrapper>>;
      FileEntities$ = this.selectMany(paths);
      return FileEntities$;

    } else {
      return observableOf([]);
    }
  }


  constructor(protected store: FilesStore) {
    super(store);
  }

}
