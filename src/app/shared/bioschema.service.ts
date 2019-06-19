import {Injectable} from '@angular/core';
import { DateService } from './date.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import {WorkflowComponent} from '../workflow/workflow.component';
import { Workflow } from '../shared/swagger/model/workflow';
import { WorkflowVersion } from './swagger/model/workflowVersion';
import { ExtendedWorkflowQuery } from './state/extended-workflow.query';
import { WorkflowQuery } from './state/workflow.query';
import { WorkflowService } from './state/workflow.service';
import {Tag} from './swagger';

export interface Person {
  '@type': string;
  name: string;
  email?: string;
}

export interface BioschemaTool {
  '@type': string;
  description: string;
  name: string;
  softwareVersion: string;
  url?: Location;
  audience: string;
  dateModified?: string;
  identifier?: number;
  publisher?: Person;
}

  @Injectable()
export class BioschemaService {
  constructor(private dateService: DateService) {}
  getToolSchema(tool: DockstoreTool, selectedVersion: Tag): BioschemaTool {
    const results: BioschemaTool = {
      '@type': 'SoftwareApplication',
      'description': tool.description,
      'name': tool.name,
      'softwareVersion': selectedVersion.name,
      'url': window.location,
      'audience': 'Bioinformaticians',
      'dateModified': this.dateService.getISO8601FormatFromDate(tool.lastUpdated),
      'identifier': tool.id,
    };
    if (tool.author) {
      results.publisher = {
        '@type' : 'Person',
        'name' : tool.author
      };
      if (tool.email) {
        results.publisher.email = tool.email;
      }
    }
    return results;

  }
  getWorkflowSchema(workflow: Workflow, selectedVersion: WorkflowVersion): BioschemaTool {
    const results: BioschemaTool = {
      '@type': 'SoftwareApplication',
      'description': workflow.description,
      'name': workflow.workflowName,
      'softwareVersion': selectedVersion.name,
      'url': window.location,
      'audience': 'Bioinformaticians',
      'dateModified': this.dateService.getISO8601FormatFromNumber(workflow.last_modified),
      'identifier': workflow.id
    };
    if (workflow.author) {
      results.publisher = {
        '@type' : 'Person',
        'name' : workflow.author
      };
      if (workflow.email) {
        results.publisher.email = workflow.email;
      }
    } else if (workflow.organization) {
      results.publisher = {
        '@type': 'Organization',
        'name': workflow.organization
      };
      if (workflow.email) {
        results.publisher.email = workflow.email;
      }
    }
    return results;
  }
}
