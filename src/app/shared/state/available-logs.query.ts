import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ToolTesterLog } from '../openapi/model/toolTesterLog';
import { AvailableLogsState, AvailableLogsStore } from './available-logs.store';
@Injectable({
  providedIn: 'root'
})
export class AvailableLogsQuery extends QueryEntity<AvailableLogsState, ToolTesterLog> {
  constructor(protected store: AvailableLogsStore) {
    super(store);
  }
}
