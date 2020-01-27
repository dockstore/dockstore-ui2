import { Injectable } from '@angular/core';
import { FileWrapper } from '../../../shared/swagger';
import { FilesStore } from './files.store';

@Injectable({ providedIn: 'root' })
export class FilesService {
  constructor(private filesStore: FilesStore) {}

  update(id: string, file: FileWrapper) {
    this.filesStore.upsert(id, file);
  }

  remove(id: string) {
    this.filesStore.remove(id);
  }

  removeAll() {
    this.filesStore.remove();
  }
}
