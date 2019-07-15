import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { finalize } from 'rxjs/operators';
import { ToolTesterService } from '../openapi/api/toolTester.service';
import { ToolTesterLog } from '../openapi/model/toolTesterLog';
import { AvailableLogsStore } from './available-logs.store';

@Injectable({ providedIn: 'root' })
export class AvailableLogsService {
  constructor(private availableLogsStore: AvailableLogsStore, private toolTesterService: ToolTesterService) {}

  /**
   * Gets the ToolTester logs from the webservice
   *
   * @param {string} toolId  The TRS Tool ID
   * @param {string} toolVersionName  The TRS ToolVersion name
   * @memberof AvailableLogsService
   */
  get(toolId: string, toolVersionName: string) {
    if (toolId && toolVersionName) {
      this.availableLogsStore.setLoading(true);
      this.removeAll();
      this.toolTesterService
        .search(toolId, toolVersionName)
        .pipe(finalize(() => this.availableLogsStore.setLoading(false)))
        .subscribe(
          (entities: ToolTesterLog[]) => {
            // Need to set a unique ID for each entity
            let id = 0;
            entities.forEach((entity: ToolTesterLog) => {
              this.availableLogsStore.createOrReplace(id, entity);
              id = id + 1;
            });
            this.availableLogsStore.setLoading(false);
          },
          (error: HttpErrorResponse) => {
            // Silently fail (simply no logs will be displayed, Dockstore logging will know it has failed)
            console.error(error);
          }
        );
    } else {
      this.availableLogsStore.setLoading(false);
      console.error('Tool ID or ToolVersion name is null');
    }
  }

  add(availableLog: ToolTesterLog) {
    this.availableLogsStore.add(availableLog);
  }

  update(id, availableLog: Partial<ToolTesterLog>) {
    this.availableLogsStore.update(id, availableLog);
  }

  remove(id: ID) {
    this.availableLogsStore.remove(id);
  }

  /**
   * Remove all entities from the store
   *
   * @memberof AvailableLogsService
   */
  removeAll() {
    this.availableLogsStore.remove();
  }
}
