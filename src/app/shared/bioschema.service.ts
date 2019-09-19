import { Injectable } from '@angular/core';
import { DateService } from './date.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Workflow } from '../shared/swagger/model/workflow';
import { WorkflowVersion } from './swagger/model/workflowVersion';
import { Tag } from './swagger';
import { ExtendedWorkflowsService } from './extended-workflows.service';
import { ExtendedToolsService } from './extended-tools.service';

export interface Person {
  '@type': string;
  name: string;
  email?: string;
}

export interface BioschemaTool {
  '@context': string;
  '@type': string;
  name?: string;
  operatingSystem: string[]; // fulfills a requirement for the SoftwareApplication type
  applicationCategory: string; // fulfills a requirement for the SoftwareApplication type
  applicationSubCategory?: string;
  audience: string;
  dateCreated?: string;
  dateModified?: string;
  description?: string;
  downloadUrl?: string;
  publisher?: Person;
  softwareVersion?: string;
  softwareRequirements: string;
  url: string;
}

@Injectable()
export class BioschemaService {
  constructor(
    private dateService: DateService,
    private workflowsService: ExtendedWorkflowsService,
    private containersService: ExtendedToolsService
  ) {}
  private getBaseSchema(entry: DockstoreTool | Workflow, selectedVersion: Tag | WorkflowVersion): BioschemaTool {
    const results: BioschemaTool = {
      '@context': 'http://schema.org',
      '@type': 'SoftwareApplication',
      operatingSystem: ['macOS', 'Linux', 'Windows'],
      softwareRequirements: 'Docker',
      applicationCategory: 'Bioinformatics',
      description: entry.description,
      url: window.location.href,
      audience: 'Bioinformaticians'
    };
    if (selectedVersion) {
      results.softwareVersion = selectedVersion.name;
    }
    if (entry.dbCreateDate) {
      results.dateCreated = this.dateService.getISO8601Format(entry.dbCreateDate);
    }
    if (entry.author) {
      results.publisher = {
        '@type': 'Person',
        name: entry.author
      };
      if (entry.email) {
        results.publisher.email = entry.email;
      }
    }
    if (entry.descriptorType) {
      results.softwareRequirements = results.softwareRequirements + ', ' + entry.descriptorType;
    }
    return results;
  }
  getToolSchema(tool: DockstoreTool, selectedVersion: Tag): BioschemaTool {
    const results = this.getBaseSchema(tool, selectedVersion);
    results.applicationSubCategory = 'Tool';
    if (tool.name) {
      results.name = tool.name;
    }
    if (tool.namespace && !results.publisher) {
      results.publisher = {
        '@type': 'Organization',
        name: tool.namespace
      };
      if (tool.email) {
        results.publisher.email = tool.email;
      }
    }
    if (tool.lastUpdated) {
      results.dateModified = this.dateService.getISO8601Format(tool.lastUpdated);
    }
    if (tool.id && selectedVersion) {
      // set downloadUrl to the link that is opened upon clicking the 'Export as ZIP' button
      results.downloadUrl = `${this.containersService.configuration.basePath}/containers/${tool.id}/zip/${selectedVersion.id}`;
    }
    return results;
  }
  getWorkflowSchema(workflow: Workflow, selectedVersion: WorkflowVersion): BioschemaTool {
    const results = this.getBaseSchema(workflow, selectedVersion);
    results.applicationSubCategory = 'Workflow';
    if (workflow.workflowName) {
      results.name = workflow.workflowName;
    }
    if (workflow.organization && !results.publisher) {
      results.publisher = {
        '@type': 'Organization',
        name: workflow.organization
      };
      if (workflow.email) {
        results.publisher.email = workflow.email;
      }
    }
    if (workflow.last_modified) {
      results.dateModified = this.dateService.getISO8601Format(workflow.last_modified);
    }
    if (workflow.id && selectedVersion) {
      // set downloadUrl to the link that is opened upon clicking the 'Export as ZIP' button
      results.downloadUrl = `${this.workflowsService.configuration.basePath}/workflows/${workflow.id}/zip/${selectedVersion.id}`;
    }
    return results;
  }
}
