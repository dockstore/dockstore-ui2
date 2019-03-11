import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { createInitialState, DescriptorsState, DescriptorsStore } from './descriptors-store.';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { SourceFile } from '../../../shared/swagger';

const importHttpRegEx: RegExp = new RegExp(/^\s*import\s+"https?/, 'm');

@Injectable()
export class DescriptorsQuery extends Query<DescriptorsState> {

  primaryDescriptor$: Observable<SourceFile> = this.select(state => state.primaryDescriptor);
  secondaryDescriptor$: Observable<Array<SourceFile>> = this.select(state => state.secondaryDescriptors);
  hasContent$: Observable<boolean> = this.primaryDescriptor$.pipe(
    map(primaryDescriptor => !!(primaryDescriptor && primaryDescriptor.content && primaryDescriptor.content.length)));
  hasFileImports$: Observable<boolean> = this.secondaryDescriptor$.pipe(
    map(secondaryDescriptors => !!(secondaryDescriptors && secondaryDescriptors.length)));
  hasHttpImports$: Observable<boolean | any> = this.primaryDescriptor$.pipe(
    map(primaryDescriptor => !!(primaryDescriptor && importHttpRegEx.test(primaryDescriptor.content))),
    mergeMap(hasHttpImport => {
      if (hasHttpImport) {
        return observableOf(true);
      } else {
        return this.secondaryDescriptor$.pipe(map(secondaryDescriptors => {
          if (!secondaryDescriptors) {
            return false;
          }
          return secondaryDescriptors.some(descriptor => {
              return importHttpRegEx.test(descriptor.content);
            });
        }));
      }
    }));


  constructor(protected store: DescriptorsStore) {
    super(store);
  }

  clear() {
    this.store.update(createInitialState());
  }

  destroy() {
    this.store.destroy();
  }

}
