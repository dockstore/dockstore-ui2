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
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EntryTab } from '../../shared/entry/entry-tab';
import {
  CloudInstance,
  ExtendedGA4GHService,
  Metrics,
  ValidatorInfo,
  ValidatorVersionInfo,
  WorkflowVersion,
  BioWorkflow,
  Notebook,
  Service,
  MetricsByStatus,
  RunExecution,
} from '../../shared/openapi';
import { SessionQuery } from '../../shared/session/session.query';
import { takeUntil } from 'rxjs/operators';
import PartnerEnum = CloudInstance.PartnerEnum;
import ExecutionStatusEnum = RunExecution.ExecutionStatusEnum;
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AlertService } from '../../shared/alert/state/alert.service';
import { UserQuery } from 'app/shared/user/user.query';
import { combineLatest } from 'rxjs';
import { ExecutionStatusPipe } from '../../shared/entry/execution-status.pipe';
import { SecondsToHoursMinutesSecondsPipe } from 'app/workflow/executions/seconds-to-hours-minutes-seconds.pipe';
import { PlatformPartnerPipe } from '../../shared/entry/platform-partner.pipe';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, NgClass, NgTemplateOutlet, DecimalPipe, DatePipe } from '@angular/common';

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
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatIconModule,
    FlexModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatDividerModule,
    MatTableModule,
    MatTooltipModule,
    NgClass,
    ExtendedModule,
    NgTemplateOutlet,
    DecimalPipe,
    DatePipe,
    PlatformPartnerPipe,
    SecondsToHoursMinutesSecondsPipe,
    ExecutionStatusPipe,
  ],
})
export class ExecutionsTabComponent extends EntryTab implements OnInit, OnChanges {
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
  abortedExecutions: number;
  successfulExecutionRate: number | null;
  executionMetricsExist: boolean;
  currentExecutionStatus: string;
  executionStatusToMetrics: Map<string, MetricsByStatus>;
  executionStatuses: string[];
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
  isAdminCuratorOrPlatformPartner: boolean;

  @Input() entry: BioWorkflow | Service | Notebook;
  @Input() version: WorkflowVersion;

  constructor(
    private extendedGA4GHService: ExtendedGA4GHService,
    private alertService: AlertService,
    private userQuery: UserQuery,
    protected sessionQuery: SessionQuery
  ) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.userQuery.isAdminOrCurator$, this.userQuery.isPlatformPartner$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([isAdminOrCurator, isPlatformPartner]) => {
        this.isAdminCuratorOrPlatformPartner = isAdminOrCurator || isPlatformPartner;
      });
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
                // Remove the ALL platform if there's only one execution
                if (this.partners.length === 2 && this.partners.filter((partner) => partner === PartnerEnum.ALL).length === 1) {
                  this.partners = this.partners.filter((partner) => partner !== PartnerEnum.ALL);
                }
                const platform =
                  this.partners.filter((partner) => partner === PartnerEnum.ALL).length === 1
                    ? this.partners.filter((partner) => partner === PartnerEnum.ALL)[0]
                    : this.partners[0];
                this.selectPartner(platform);
              }
            }
            this.alertService.simpleSuccess();
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
    this.abortedExecutions = null;
    this.successfulExecutionRate = null;
    this.currentExecutionStatus = null;
    this.currentPartner = null;
    this.currentValidatorTool = null;
    this.validatorTools = [];
  }

  private loadExecutionMetricsData(partner: PartnerEnum) {
    const metrics = this.metrics.get(partner);
    this.executionMetricsExist = metrics?.executionStatusCount !== null;

    if (metrics?.executionStatusCount) {
      this.executionStatusToMetrics = new Map(Object.entries(metrics.executionStatusCount.count));

      // Set the default execution status
      this.executionStatuses = Array.from(this.executionStatusToMetrics.keys());
      if (this.executionStatuses) {
        // Remove the ALL status if there's only one execution
        if (
          this.executionStatuses.length === 2 &&
          this.executionStatuses.filter((status) => status === ExecutionStatusEnum.ALL).length === 1
        ) {
          this.executionStatuses = this.executionStatuses.filter((status) => status !== ExecutionStatusEnum.ALL);
        }
        // Pick the default execution status to display.
        let defaultExecutionStatus = this.executionStatuses[0];
        if (this.executionStatuses.includes(ExecutionStatusEnum.SUCCESSFUL)) {
          defaultExecutionStatus = this.executionStatuses.find((status) => status === ExecutionStatusEnum.SUCCESSFUL);
        } else if (this.executionStatuses.includes(ExecutionStatusEnum.ALL)) {
          defaultExecutionStatus = this.executionStatuses.find((status) => status === ExecutionStatusEnum.ALL);
        }

        this.onSelectedExecutionStatusChange(defaultExecutionStatus);
      }

      this.successfulExecutions = metrics.executionStatusCount.numberOfSuccessfulExecutions;
      this.failedExecutions = metrics.executionStatusCount.numberOfFailedExecutions;
      this.abortedExecutions = metrics.executionStatusCount.numberOfAbortedExecutions;
      this.totalExecutions = this.successfulExecutions + this.failedExecutions + this.abortedExecutions;
      const completedExecutions = (this.successfulExecutions || 0) + (this.failedExecutions || 0); // Per schema, values could be undefined, even though in practice they currently aren't
      this.successfulExecutionRate = completedExecutions > 0 ? (100 * this.successfulExecutions) / completedExecutions : null; // Don't divide by 0
    }
  }

  /**
   * Create an executions table using the CPU, Memory, and Execution Time metrics.
   * Returns an empty table if those metrics don't exist.
   * @param metrics
   * @returns
   */
  private createExecutionsTable(metrics: MetricsByStatus | null): ExecutionMetricsTableObject[] {
    let executionsTable: ExecutionMetricsTableObject[] = [];
    // Only add the rows if there are data for that type
    if (metrics) {
      if (metrics.cpu) {
        executionsTable.push({ metric: 'CPU', ...metrics.cpu });
      }
      if (metrics.memory) {
        executionsTable.push({ metric: 'Memory', ...metrics.memory });
      }
      if (metrics.executionTime) {
        executionsTable.push({ metric: 'Run Time', ...metrics.executionTime });
      }
      if (metrics.cost) {
        executionsTable.push({ metric: 'Cost', ...metrics.cost });
      }
    }
    return executionsTable;
  }

  /**
   * Called when the selected execution status is changed
   * @param {string} executionStatus - New execution status
   * @return {void}
   */
  onSelectedExecutionStatusChange(executionStatus: string): void {
    if (executionStatus) {
      this.currentExecutionStatus = executionStatus;
      this.executionMetricsTable = this.createExecutionsTable(this.executionStatusToMetrics.get(executionStatus));
    } else {
      this.currentExecutionStatus = null;
      this.executionMetricsTable = [];
    }
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
}
