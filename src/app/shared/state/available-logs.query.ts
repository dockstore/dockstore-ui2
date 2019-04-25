import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AvailableLogsStore, AvailableLogsState } from './available-logs.store';
import { ToolTesterLog } from '../swagger/model/toolTesterLog';
@Injectable({
  providedIn: 'root'
})
export class AvailableLogsQuery extends QueryEntity<AvailableLogsState, ToolTesterLog> {

  constructor(protected store: AvailableLogsStore) {
    super(store);
  }

}
