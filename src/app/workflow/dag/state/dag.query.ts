import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DagStore, DagState } from './dag.store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DagQuery extends Query<DagState> {
  dagResults$ = this.select(state => state.dagResults);
  missingTool$: Observable<boolean> = this.dagResults$.pipe(map(dagResults => this.isMissingTool(dagResults)));
  constructor(protected store: DagStore) {
    super(store);
  }

  /**
   * Based on the dagResults, determines whether or not it is missing tools
   *
   * @param {*} dagResults
   * @returns
   * @memberof DagQuery
   */
  isMissingTool(dagResults: any) {
    if (!dagResults) {
      return true;
    } else {
      return (dagResults.edges.length < 1 && dagResults.nodes.length < 1);
    }
  }

}
