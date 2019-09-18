import { inject, TestBed } from '@angular/core/testing';
import { ContainersStubService, ContainerStubService, WorkflowsStubService, WorkflowStubService } from 'app/test/service-stubs';
import { ContainerService } from '../container.service';
import { EntryType } from '../enum/entry-type';
import { CustomMaterialModule } from '../modules/material.module';
import { WorkflowService } from '../state/workflow.service';
import {
  BaseClassForVersionsOfEntriesInTheDockstore,
  ContainersService,
  DockstoreTool,
  Entry,
  Tag,
  Workflow,
  WorkflowsService
} from '../swagger';
import { EntryActionsService } from './entry-actions.service';
import { exampleEntry } from '../../test/mocked-objects';

describe('Service: EntryActionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EntryActionsService,
        {
          provide: WorkflowsService,
          useClass: WorkflowsStubService
        },
        {
          provide: WorkflowService,
          useClass: WorkflowStubService
        },
        {
          provide: ContainersService,
          useClass: ContainersStubService
        },
        {
          provide: ContainerService,
          useClass: ContainerStubService
        }
      ],
      imports: [CustomMaterialModule]
    });
  });

  it('should ...', inject([EntryActionsService], (service: EntryActionsService) => {
    expect(service).toBeTruthy();
  }));
  it('should know if entry is hosted', inject([EntryActionsService], (service: EntryActionsService) => {
    expect(service.isEntryHosted(null)).toBeTruthy();
    const dockstoreTool = <DockstoreTool>{};
    dockstoreTool.mode = DockstoreTool.ModeEnum.HOSTED;
    expect(service.isEntryHosted(dockstoreTool)).toBeTruthy();
    dockstoreTool.mode = DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS;
    expect(service.isEntryHosted(dockstoreTool)).toBeFalsy();
    const workflow = <Workflow>{};
    workflow.mode = Workflow.ModeEnum.HOSTED;
    expect(service.isEntryHosted(workflow)).toBeTruthy();
    workflow.mode = Workflow.ModeEnum.FULL;
    expect(service.isEntryHosted(workflow)).toBeFalsy();
  }));
  it('should get publish message', inject([EntryActionsService], (service: EntryActionsService) => {
    const entry = <Entry>{};
    entry.workflowVersions = [exampleEntry];
    entry.workflowVersions[0].valid = true;
    expect(service.getPublishMessage(null, EntryType.Tool)).toBe('');
    entry.is_published = true;
    expect(service.getPublishMessage(entry, EntryType.Tool)).toBe('Unpublish the tool to remove it from the public');
    expect(service.getPublishMessage(entry, EntryType.BioWorkflow)).toBe('Unpublish the workflow to remove it from the public');
    expect(service.getPublishMessage(entry, EntryType.Service)).toBe('Unpublish the service to remove it from the public');
    expect(service.getPublishMessage(entry, null)).toBe('');
    entry.is_published = false;
    expect(service.getPublishMessage(entry, EntryType.Tool)).toBe('Publish the tool to make it visible to the public');
    expect(service.getPublishMessage(entry, EntryType.BioWorkflow)).toBe('Publish the workflow to make it visible to the public');
    expect(service.getPublishMessage(entry, EntryType.Service)).toBe('Publish the service to make it visible to the public');
    expect(service.getPublishMessage(entry, null)).toBe('');
  }));
  it('should know when to disable publish button', inject([EntryActionsService], (service: EntryActionsService) => {
    const tool = <DockstoreTool>{};
    expect(service.publishToolDisabled(null)).toBeTruthy();
    tool.is_published = true;
    expect(service.publishToolDisabled(tool)).toBeFalsy();
    tool.is_published = false;
    expect(service.publishToolDisabled(tool)).toBeTruthy();
    tool.workflowVersions = [];
    expect(service.publishToolDisabled(tool)).toBeTruthy();
    const tag = <Tag>{};
    tag.valid = false;
    tool.workflowVersions = [tag];
    expect(service.publishToolDisabled(tool)).toBeTruthy();
    tag.valid = true;
    tool.workflowVersions = [tag];
    expect(service.publishToolDisabled(tool)).toBeFalsy();
    expect(service.publishWorkflowDisabled(null, false)).toBeTruthy();
    expect(service.publishWorkflowDisabled(null, true)).toBeTruthy();
    const workflow = <Workflow>{};
    workflow.is_published = true;
    workflow.mode = Workflow.ModeEnum.FULL;
    expect(service.publishWorkflowDisabled(workflow, true)).toBeFalsy();
    expect(service.publishWorkflowDisabled(workflow, false)).toBeTruthy();
    workflow.mode = Workflow.ModeEnum.STUB;
    expect(service.publishWorkflowDisabled(workflow, true)).toBeTruthy();
    expect(service.publishWorkflowDisabled(workflow, false)).toBeTruthy();
  }));
  it('should get view public button toolip', inject([EntryActionsService], (service: EntryActionsService) => {
    expect(service.getViewPublicButtonTooltip(null)).toBe('');
    expect(service.getViewPublicButtonTooltip(EntryType.Tool)).toBe('Go to the public page for this tool');
    expect(service.getViewPublicButtonTooltip(EntryType.BioWorkflow)).toBe('Go to the public page for this workflow');
    expect(service.getViewPublicButtonTooltip(EntryType.Service)).toBe('Go to the public page for this service');
  }));
  it('should display message for disabled tooltip', inject([EntryActionsService], (service: EntryActionsService) => {
    const entry = <Entry>{};
    entry.workflowVersions = [];
    expect(service.getPublishMessage(entry, EntryType.Tool)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, EntryType.BioWorkflow)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, EntryType.Service)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, null)).toBe('');
    entry.workflowVersions = [exampleEntry];
    entry.workflowVersions[0].valid = false;
    expect(service.getPublishMessage(entry, EntryType.Tool)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, EntryType.BioWorkflow)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, EntryType.Service)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, null)).toBe('');
    entry.workflowVersions = null;
    expect(service.getPublishMessage(entry, EntryType.Tool)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, EntryType.BioWorkflow)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, EntryType.Service)).toBe('Unable to publish: No valid versions found');
    expect(service.getPublishMessage(entry, null)).toBe('');
  }));
});
