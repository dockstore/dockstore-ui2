import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DagState, DagStore } from './dag.store';

@Injectable()
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
   * @returns {boolean}  Whether the dagResults are missing
   * @memberof DagQuery
   */
  isMissingTool(dagResults: any): boolean {
    if (!dagResults) {
      return true;
    } else {
      return dagResults.edges.length < 1 && dagResults.nodes.length < 1;
    }
  }
}
