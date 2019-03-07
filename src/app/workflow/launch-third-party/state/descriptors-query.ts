import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DescriptorsState, DescriptorsStore } from './descriptors-store.';
import { map } from 'rxjs/operators';

const importHttpRegEx: RegExp = new RegExp(/^\s*import\s+"https?/, 'm');

@Injectable()
export class DescriptorsQuery extends Query<DescriptorsState> {

  primaryDescriptor$ = this.select(state => state.primaryDescriptor);
  secondaryDescriptor$ = this.select(state => state.secondaryDescriptors);
  hasContent$ = this.primaryDescriptor$.pipe(map(primaryDescriptor => primaryDescriptor && primaryDescriptor.content && primaryDescriptor.content.length));
  hasFileImports$ = this.secondaryDescriptor$.pipe(map(secondaryDescriptors => !!(secondaryDescriptors && secondaryDescriptors.length)));
  // TODO: Need to check secondary descriptors too
  hasHttpImports$ = this.primaryDescriptor$.pipe(map(primaryDescriptor => primaryDescriptor && importHttpRegEx.test(primaryDescriptor.content)));


  constructor(protected store: DescriptorsStore) {
    super(store);
  }

  clear() {
    this.store.update(state => {
      return {
        ...state,
        primaryDescriptor: null,
        secondaryDescriptors: Array()
      }
    })

  }
  destroy() {
    this.store.destroy();
  }

}
