import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DescriptorsState, DescriptorsStore } from './descriptors-store.service';
import { map } from 'rxjs/operators';

@Injectable()
export class DescriptorsQuery extends Query<DescriptorsState> {

  primaryDescriptor$ = this.select(state => state.primaryDescriptor);
  secondaryDescriptor$ = this.select(state => state.secondaryDescriptors);
  hasContent$ = this.primaryDescriptor$.pipe(map(primaryDescriptor => primaryDescriptor && primaryDescriptor.content && primaryDescriptor.content.length))
  constructor(protected store: DescriptorsStore) {
    super(store);
  }

}
