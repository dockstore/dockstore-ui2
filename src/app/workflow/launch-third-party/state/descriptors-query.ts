import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { createInitialState, DescriptorsState, DescriptorsStore } from './descriptors-store.';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { SourceFile } from '../../../shared/swagger';
import { FileService } from '../../../shared/file.service';

@Injectable()
export class DescriptorsQuery extends Query<DescriptorsState> {
  primaryDescriptor$: Observable<SourceFile> = this.select(state => state.primaryDescriptor);
  secondaryDescriptor$: Observable<Array<SourceFile>> = this.select(state => state.secondaryDescriptors);
  hasContent$: Observable<boolean> = this.primaryDescriptor$.pipe(
    map(primaryDescriptor => !!(primaryDescriptor && primaryDescriptor.content && primaryDescriptor.content.length))
  );
  hasFileImports$: Observable<boolean> = this.secondaryDescriptor$.pipe(
    map(secondaryDescriptors => !!(secondaryDescriptors && secondaryDescriptors.length))
  );
  hasHttpImports$: Observable<boolean | any> = this.primaryDescriptor$.pipe(
    map(primaryDescriptor => this.fileService.hasHttpImport(primaryDescriptor)),
    mergeMap(hasHttpImport => {
      if (hasHttpImport) {
        return observableOf(true);
      } else {
        return this.secondaryDescriptor$.pipe(
          map(
            secondaryDescriptors =>
              secondaryDescriptors && secondaryDescriptors.some(descriptor => this.fileService.hasHttpImport(descriptor))
          )
        );
      }
    })
  );

  constructor(protected store: DescriptorsStore, private fileService: FileService) {
    super(store);
  }

  clear() {
    this.store.update(createInitialState());
  }

  destroy() {
    this.store.destroy();
  }
}
