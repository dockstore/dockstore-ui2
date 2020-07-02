import { HttpClient, HttpHandler } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { BioschemaService, BioschemaTool } from './bioschema.service';
import { DateService } from './date.service';
import { ExtendedToolsService } from './extended-tools.service';
import { ExtendedWorkflowsService } from './extended-workflows.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Tag } from './swagger/model/tag';
import { Workflow } from './swagger/model/workflow';
import { WorkflowVersion } from './swagger/model/workflowVersion';

describe('BioschemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BioschemaService, DateService, ExtendedWorkflowsService, ExtendedToolsService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([BioschemaService, DateService], (service: BioschemaService) => {
    expect(service).toBeTruthy();
  }));
  it('should have expected attributes', inject([BioschemaService, DateService], (service: BioschemaService) => {
    // create a DockstoreTool object
    const tag: Tag = { name: '1.0.0', reference: '', id: 2 };
    const date: number = new Date('2017-06-28T18:48:18.000Z').getTime();
    const tool: DockstoreTool = {
      // Attributes used in the method being tested
      author: 'me',
      description: 'text',
      email: 'me@ucsc.edu',
      id: 1,
      dbCreateDate: date,
      lastUpdated: date,
      name: 'tool',
      // Attributes not used in method being tested, but required for a DockstoreTool object
      default_cwl_path: '',
      default_dockerfile_path: '',
      default_wdl_path: '',
      defaultCWLTestParameterFile: '',
      defaultWDLTestParameterFile: '',
      gitUrl: '',
      mode: DockstoreTool.ModeEnum.HOSTED,
      namespace: '',
      private_access: false,
      registry_string: ''
    };
    const result: BioschemaTool = service.getToolSchema(tool, tag);
    expect(result['@context']).toEqual('http://schema.org');
    expect(result['@type']).toEqual('SoftwareApplication');
    expect(result.operatingSystem).toEqual(['macOS', 'Linux', 'Windows']);
    expect(result.softwareRequirements).toEqual('Docker');
    expect(result.applicationCategory).toEqual('Bioinformatics');
    expect(result.description).toEqual('text');
    expect(result.audience).toEqual('Bioinformaticians');
    expect(result.softwareVersion).toEqual('1.0.0');
    expect(result.dateCreated).toEqual('2017-06-28T18:48:18.000Z');
    expect(result.applicationSubCategory).toEqual('Tool');
    expect(result.name).toEqual('tool');
    expect(result.dateModified).toEqual('2017-06-28T18:48:18.000Z');
    expect(result.publisher).toEqual({ '@type': 'Person', name: 'me', email: 'me@ucsc.edu' });
    expect(result.downloadUrl).toContain('/containers/1/zip/2');
  }));
  it('should have expected attributes', inject([BioschemaService, DateService], (service: BioschemaService) => {
    // create a Workflow object
    const version: WorkflowVersion = { name: '1.0.0', reference: '', id: 2 };
    const date: Date = new Date('2017-06-28T18:48:18.000Z');
    const workflow: Workflow = {
      // Attributes used in the method being tested
      description: 'text',
      email: 'us@ucsc.edu',
      id: 1,
      last_modified: date.getTime(),
      workflowName: 'workflow',
      // Attributes not being tested, but required for a Workflow object
      gitUrl: '',
      mode: Workflow.ModeEnum.HOSTED,
      organization: 'us',
      repository: '',
      sourceControl: '',
      descriptorType: Workflow.DescriptorTypeEnum.CWL,
      workflow_path: '',
      defaultTestParameterFilePath: '',
      descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NOTAPPLICABLE
    };
    const result: BioschemaTool = service.getWorkflowSchema(workflow, version);
    expect(result['@context']).toEqual('http://schema.org');
    expect(result['@type']).toEqual('SoftwareApplication');
    expect(result.operatingSystem).toEqual(['macOS', 'Linux', 'Windows']);
    expect(result.softwareRequirements).toEqual('Docker, CWL');
    expect(result.applicationCategory).toEqual('Bioinformatics');
    expect(result.description).toEqual('text');
    expect(result.audience).toEqual('Bioinformaticians');
    expect(result.softwareVersion).toEqual('1.0.0');
    expect(result.applicationSubCategory).toEqual('Workflow');
    expect(result.name).toEqual('workflow');
    expect(result.dateModified).toEqual('2017-06-28T18:48:18.000Z');
    expect(result.publisher).toEqual({ '@type': 'Organization', name: 'us', email: 'us@ucsc.edu' });
    expect(result.downloadUrl).toContain('/workflows/1/zip/2');
  }));
});
