import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { FileWrapper } from '../../../shared/swagger';
import { FilesState, FilesStore } from './files.store';

@Injectable({
  providedIn: 'root',
})
export class FilesQuery extends QueryEntity<FilesState, FileWrapper> {
  constructor(protected store: FilesStore) {
    super(store);
  }
}
