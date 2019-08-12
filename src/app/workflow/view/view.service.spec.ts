import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '../alert/state/alert.service';
import { ContainerService } from '../container.service';
import { EntryType } from '../enum/entry-type';
import { WorkflowService } from '../state/workflow.service';
import { ContainersService, DockstoreTool, Entry, PublishRequest, Workflow, WorkflowsService, WorkflowVersion } from '../swagger';

@Injectable()
export class ViewService {
  constructor(
    private alertService: AlertService,
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private containersService: ContainersService,
    private containerService: ContainerService
  ) {}
}
