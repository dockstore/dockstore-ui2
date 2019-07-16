import { Injectable } from '@angular/core';
import { DateService } from './date.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Workflow } from '../shared/swagger/model/workflow';
import { WorkflowVersion } from './swagger/model/workflowVersion';
import { Tag } from './swagger';

export interface Person {
  '@type': string;
  name: string;
  email?: string;
}

export interface BioschemaTool {
  '@type': string;
  description?: string;
  name?: string;
  softwareVersion?: string;
  url: string;
  audience: string;
  dateModified?: string;
  identifier?: number;
  publisher?: Person;
}

@Injectable()
export class BioschemaService {
  constructor(private dateService: DateService) {}
  private getBaseSchema(entry: DockstoreTool | Workflow, selectedVersion: Tag | WorkflowVersion): BioschemaTool {
    const results: BioschemaTool = {
      '@type': 'SoftwareApplication',
      description: entry.description,
      url: window.location.href,
      // 'softwareVersion': selectedVersion.name,
      audience: 'Bioinformaticians',
      identifier: entry.id
    };
    if (selectedVersion) {
      results.softwareVersion = selectedVersion.name;
    }
    return results;
  }
  getToolSchema(tool: DockstoreTool, selectedVersion: Tag): BioschemaTool {
    const results = this.getBaseSchema(tool, selectedVersion);
    if (tool.name) {
      results.name = tool.name;
    }
    if (tool.lastUpdated) {
      results.dateModified = this.dateService.getISO8601FormatFromDate(tool.lastUpdated);
    }
    if (tool.author) {
      results.publisher = {
        '@type': 'Person',
        name: tool.author
      };
      if (tool.email) {
        results.publisher.email = tool.email;
      }
    }
    return results;
  }
  getWorkflowSchema(workflow: Workflow, selectedVersion: WorkflowVersion): BioschemaTool {
    const results = this.getBaseSchema(workflow, selectedVersion);
    if (workflow.workflowName) {
      results.name = workflow.workflowName;
    }
    if (workflow.last_modified) {
      results.dateModified = this.dateService.getISO8601FormatFromNumber(workflow.last_modified);
    }
    if (workflow.author) {
      results.publisher = {
        '@type': 'Person',
        name: workflow.author
      };
      if (workflow.email) {
        results.publisher.email = workflow.email;
      }
    } else if (workflow.organization) {
      results.publisher = {
        '@type': 'Organization',
        name: workflow.organization
      };
      if (workflow.email) {
        results.publisher.email = workflow.email;
      }
    }
    return results;
  }
}
