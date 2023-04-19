/*
 *    Copyright 2017 OICR
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
  CpuMetric,
  ExecutionTimeMetric,
  ExtendedGA4GHService,
  MemoryMetric,
  Metrics,
  WorkflowVersion,
} from '../../shared/openapi';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { SessionQuery } from '../../shared/session/session.query';
import { takeUntil } from 'rxjs/operators';
import { BioWorkflow, Notebook, Service } from '../../shared/swagger';
import { CheckerWorkflowService } from '../../shared/state/checker-workflow.service';
import { CheckerWorkflowQuery } from '../../shared/state/checker-workflow.query';
import PartnerEnum = CloudInstance.PartnerEnum;
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-executions-tab',
  templateUrl: './executions-tab.component.html',
  styleUrls: ['./executions-tab.component.css'],
})
export class ExecutionsTabComponent extends EntryTab implements OnInit, OnChanges {
  metrics: Map<PartnerEnum, Metrics>;
  trsID: string;
  currentPartner: PartnerEnum;
  partners: PartnerEnum[];
  metricsTable: any[];
  validationsTable: any[];
  metricsColumns: string[];
  validationsColumns: string[];
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  ifMetricsExist: boolean;

  @Input() entry: BioWorkflow | Service | Notebook;
  @Input() version: WorkflowVersion;

  constructor(
    private extendedGA4GHService: ExtendedGA4GHService,
    private workflowQuery: WorkflowQuery,
    protected sessionQuery: SessionQuery,
    private checkerWorkflowService: CheckerWorkflowService,
    private checkerWorkflowQuery: CheckerWorkflowQuery
  ) {
    super();
  }

  ngOnChanges() {
    this.ifMetricsExist = false;
    this.trsID = this.checkerWorkflowQuery.getTRSId(this.entry);
    this.metrics = new Map();
    this.metricsTable = [];
    this.validationsTable = [];
    this.partners = [];
    this.extendedGA4GHService
      .aggregatedMetricsGet(this.trsID, this.version.name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((metrics) => {
        if (metrics) {
          for (const [partner, metric] of Object.entries(metrics)) {
            this.setMetricsObject(this.metrics, partner, metric);
          }
          this.partners = Array.from(this.metrics.keys());
          if (this.partners.length > 0) {
            this.ifMetricsExist = true;
            this.selectPartner(this.partners[0]);
          }
        }
      });
  }

  ngOnInit() {}

  private setMetricsObject(metricsMap: Map<PartnerEnum, Metrics>, partner: string, metric: Metrics) {
    for (const partnerEnum in PartnerEnum) {
      if (PartnerEnum[partnerEnum] === partner) {
        metricsMap.set(PartnerEnum[partnerEnum], metric);
      }
    }
  }
  private loadMetricsData(partner: PartnerEnum) {
    this.metricsTable = [];
    const metrics = this.metrics.get(partner);
    if (metrics) {
      this.metricsColumns = ['metric', 'min', 'avg', 'max'];
      this.insertToMetricsTable(this.metricsTable, metrics?.cpu, 'CPU');
      this.insertToMetricsTable(this.metricsTable, metrics?.memory, 'Memory');
      this.insertToMetricsTable(this.metricsTable, metrics?.executionTime, 'Run Time (s)');
      if (metrics.executionStatusCount) {
        this.totalExecutions =
          metrics.executionStatusCount.numberOfSuccessfulExecutions + metrics.executionStatusCount.numberOfFailedExecutions;
        this.successfulExecutions = metrics.executionStatusCount.numberOfSuccessfulExecutions;
        this.failedExecutions = metrics.executionStatusCount.numberOfFailedExecutions;
      }
    }
  }

  private insertToMetricsTable(table: any[], metricsData: CpuMetric | MemoryMetric | ExecutionTimeMetric, metricLabel: string) {
    table.push({ metric: metricLabel, min: metricsData?.minimum, avg: metricsData?.average, max: metricsData?.maximum });
  }

  private loadValidationsData(partner: PartnerEnum) {
    this.validationsTable = [];
    const validations = this.metrics.get(partner).validationStatus?.validatorToolToIsValid;
    if (validations) {
      for (const [validatorTool, isValid] of Object.entries(validations)) {
        if (isValid.mostRecentIsValid) {
          this.validationsColumns = [
            'validatorTool',
            'mostRecentVersion',
            'isValid',
            'successfulValidationVersions',
            'failedValidationVersions',
            'numberOfRuns',
            'passingRate',
          ];
          this.validationsTable.push({
            validatorTool: validatorTool,
            mostRecentVersion: isValid.mostRecentVersion,
            isValid: isValid.mostRecentIsValid,
            successfulValidationVersions: isValid.successfulValidationVersions,
            failedValidationVersions: isValid.failedValidationVersions,
            numberOfRuns: isValid.numberOfRuns,
            passingRate: isValid.passingRate,
          });
        } else {
          this.validationsColumns = [
            'validatorTool',
            'mostRecentVersion',
            'isValid',
            'mostRecentErrorMessage',
            'successfulValidationVersions',
            'failedValidationVersions',
            'numberOfRuns',
            'passingRate',
          ];
          this.validationsTable.push({
            validatorTool: validatorTool,
            mostRecentVersion: isValid.mostRecentVersion,
            isValid: isValid.mostRecentIsValid,
            mostRecentErrorMessage: isValid.mostRecentErrorMessage,
            successfulValidationVersions: isValid.successfulValidationVersions,
            failedValidationVersions: isValid.failedValidationVersions,
            numberOfRuns: isValid.numberOfRuns,
            passingRate: isValid.passingRate,
          });
        }
      }
    }
  }

  matSelectChange(event: MatSelectChange) {
    this.selectPartner(event.value);
  }

  selectPartner(partner: PartnerEnum) {
    if (partner) {
      this.currentPartner = partner;
      this.loadMetricsData(this.currentPartner);
      this.loadValidationsData(this.currentPartner);
    } else {
      this.currentPartner = null;
    }
  }
}
