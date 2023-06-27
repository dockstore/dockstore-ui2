/*
 *    Copyright 2023 OICR, UCSC
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Component, Input, OnChanges } from '@angular/core';
import { EntryTab } from '../../shared/entry/entry-tab';
import { CloudInstance, ExtendedGA4GHService, Metrics, ValidatorInfo, ValidatorVersionInfo, WorkflowVersion } from '../../shared/openapi';
import { SessionQuery } from '../../shared/session/session.query';
import { takeUntil } from 'rxjs/operators';
import { BioWorkflow, Notebook, Service } from '../../shared/swagger';
import PartnerEnum = CloudInstance.PartnerEnum;
import { MatSelectChange } from '@angular/material/select';
import { AlertService } from '../../shared/alert/state/alert.service';

interface ExecutionMetricsTableObject {
  metric: string; // Name of the execution metric
  min?: number;
  avg?: number;
  max?: number;
  unit?: string;
}

@Component({
  selector: 'app-executions-tab',
  templateUrl: './executions-tab.component.html',
})
export class ExecutionsTabComponent extends EntryTab implements OnChanges {
  metrics: Map<PartnerEnum, Metrics>;
  trsID: string;
  currentPartner: PartnerEnum;
  partners: PartnerEnum[];
  metricsExist: boolean;
  // Fields for the execution metrics
  executionMetricsColumns: string[] = ['metric', 'minimum', 'average', 'maximum'];
  executionMetricsTable: ExecutionMetricsTableObject[];
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  executionMetricsExist: boolean;
  // Fields for validator tool metrics
  validationsColumns: string[] = [
    'validatorToolVersionName',
    'isValid',
    'errorMessage',
    'isMostRecentVersion',
    'dateExecuted',
    'numberOfRuns',
    'passingRate',
  ];
  validationsTable: ValidatorVersionInfo[];
  validatorToolToValidatorInfo: Map<string, ValidatorInfo>;
  currentValidatorTool: string;
  validatorTools: string[];
  validatorToolMetricsExist: boolean;

  @Input() entry: BioWorkflow | Service | Notebook;
  @Input() version: WorkflowVersion;

  constructor(
    private extendedGA4GHService: ExtendedGA4GHService,
    private alertService: AlertService,
    protected sessionQuery: SessionQuery
  ) {
    super();
  }

  ngOnChanges() {
    this.resetMetricsData();
    if (this.version) {
      this.alertService.start('Retrieving metrics data');
      this.trsID = this.entry.entryTypeMetadata.trsPrefix + this.entry.full_workflow_path;
      this.extendedGA4GHService
        .aggregatedMetricsGet(this.trsID, this.version.name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (metrics) => {
            if (metrics) {
              for (const [partner, metric] of Object.entries(metrics)) {
                this.setMetricsObject(this.metrics, partner, metric);
              }
              this.partners = Array.from(this.metrics.keys());
              this.metricsExist = this.partners.length > 0;
              if (this.metricsExist) {
                // Display metrics for ALL platforms
                const platform =
                  this.partners.filter((partner) => partner === PartnerEnum.ALL).length === 1
                    ? this.partners.filter((partner) => partner === PartnerEnum.ALL)[0]
                    : this.partners[0];
                this.selectPartner(platform);
              }
            }
            this.alertService.detailedSuccess();
          },
          (error) => {
            this.alertService.detailedError(error);
          }
        );
    }
  }

  private setMetricsObject(metricsMap: Map<PartnerEnum, Metrics>, partner: string, metric: Metrics) {
    for (const partnerEnum in PartnerEnum) {
      if (PartnerEnum[partnerEnum] === partner) {
        metricsMap.set(PartnerEnum[partnerEnum], metric);
      }
    }
  }

  private resetMetricsData() {
    this.metricsExist = false;
    this.metrics = new Map();
    this.executionMetricsTable = [];
    this.validationsTable = [];
    this.partners = [];
    this.totalExecutions = null;
    this.successfulExecutions = null;
    this.failedExecutions = null;
    this.currentPartner = null;
    this.currentValidatorTool = null;
    this.validatorTools = [];
  }

  private loadExecutionMetricsData(partner: PartnerEnum) {
    const metrics = this.metrics.get(partner);
    this.executionMetricsTable = this.createExecutionsTable(metrics);
    this.executionMetricsExist =
      metrics?.cpu !== null || metrics?.memory !== null || metrics?.executionTime !== null || metrics?.executionStatusCount !== null;

    if (metrics?.executionStatusCount) {
      this.totalExecutions =
        metrics.executionStatusCount.numberOfSuccessfulExecutions + metrics.executionStatusCount.numberOfFailedExecutions;
      this.successfulExecutions = metrics.executionStatusCount.numberOfSuccessfulExecutions;
      this.failedExecutions = metrics.executionStatusCount.numberOfFailedExecutions;
    }
  }

  /**
   * Create an executions table using the CPU, Memory, and Execution Time metrics.
   * Returns an empty table if those metrics don't exist.
   * @param metrics
   * @returns
   */
  private createExecutionsTable(metrics: Metrics | null): ExecutionMetricsTableObject[] {
    let executionsTable: ExecutionMetricsTableObject[] = [];
    // Only create the table if one of the execution metrics exist
    if (metrics && (metrics.cpu || metrics.memory || metrics.executionTime)) {
      executionsTable.push({ metric: 'CPU', ...metrics?.cpu });
      executionsTable.push({ metric: 'Memory', ...metrics?.memory });
      executionsTable.push({ metric: 'Run Time', ...metrics?.executionTime });
    }
    return executionsTable;
  }

  private loadValidationsData(partner: PartnerEnum) {
    this.validatorToolMetricsExist = this.metrics.get(partner).validationStatus != null;
    if (this.validatorToolMetricsExist) {
      this.validatorToolToValidatorInfo = new Map(Object.entries(this.metrics.get(partner).validationStatus.validatorTools));
      this.validatorTools = Array.from(this.validatorToolToValidatorInfo.keys());

      if (this.validatorTools.length > 0) {
        this.onSelectedValidatorToolChange(this.validatorTools[0]);
      }
    }
  }

  matSelectChange(event: MatSelectChange) {
    this.selectPartner(event.value);
  }

  selectPartner(partner: PartnerEnum) {
    if (partner) {
      this.currentPartner = partner;
      this.loadExecutionMetricsData(this.currentPartner);
      this.loadValidationsData(this.currentPartner);
    } else {
      this.currentPartner = null;
    }
  }

  /**
   * Called when the selected validator tool is changed
   * @param {string} validatorTool - New validator tool
   * @return {void}
   */
  onSelectedValidatorToolChange(validatorTool: string): void {
    if (validatorTool) {
      this.currentValidatorTool = validatorTool;
      this.validationsTable = this.validatorToolToValidatorInfo.get(validatorTool).validatorVersions;
    } else {
      this.currentValidatorTool = null;
      this.validationsTable = [];
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
