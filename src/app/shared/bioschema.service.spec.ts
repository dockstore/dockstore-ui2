import {BioschemaService, BioschemaTool} from './bioschema.service';
import {inject, TestBed} from '@angular/core/testing';
import {DateService} from './date.service';
import {DockstoreTool} from './swagger/model/dockstoreTool';
import {Tag} from './swagger/model/tag';
import {Workflow} from './swagger/model/workflow';
import {WorkflowVersion} from './swagger/model/workflowVersion';

describe('BioschemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BioschemaService, DateService]
    });

  });

  it('should be created', inject([BioschemaService, DateService], (service: BioschemaService) => {
    expect(service).toBeTruthy();
  }));
  it('should have expected attributes', inject([DateService], (service: DateService) => {
    // create a DockstoreTool object
    const bs = new BioschemaService(new DateService());
    const tag: Tag = {name: 'tag', reference: ''};
    const tool: DockstoreTool = {
      // Attributes used in the method being tested
      author: 'me',
      description: 'text',
      email: 'me@ucsc.edu',
      id: 0,
      lastUpdated: new Date(1498675698000),
      name: 'tool',
      // Attributes not used in method being tested, but required for a DockstoreTool object
      default_cwl_path: '',
      default_dockerfile_path: '',
      default_wdl_path: '',
      defaultCWLTestParameterFile: '',
      defaultWDLTestParameterFile: '',
      gitUrl: '',
      mode: 'HOSTED',
      namespace: '',
      private_access: false,
      registry_string: ''
    };
    const result: BioschemaTool = bs.getToolSchema(tool, tag);
    expect(result['@type']).toEqual('SoftwareApplication');
    expect(result.description).toEqual('text');
    expect(result.softwareVersion).toEqual('tag');
    expect(result.audience).toEqual('Bioinformaticians');
    expect(result.identifier).toEqual(0);
    expect(result.name).toEqual('tool');
    expect(result.dateModified).toEqual('2017-06-28T18:48:18.000Z');
    expect(result.publisher).toEqual({'@type': 'Person', 'name': 'me', 'email': 'me@ucsc.edu'});
  }));
  it('should have expected attributes', inject([DateService], (service: DateService) => {
    // create a Workflow object
    const bs = new BioschemaService(new DateService());
    const version: WorkflowVersion = {name: 'version', reference: ''};
    const workflow: Workflow = {
      // Attributes used in the method being tested
      author: 'me',
      description: 'text',
      email: 'me@ucsc.edu',
      id: 0,
      last_modified: 1498675698000,
      workflowName: 'workflow',
      // Attributes not being tested, but required for a Workflow object
      gitUrl: '',
      mode: 'HOSTED',
      organization: '',
      repository: '',
      sourceControl: '',
      descriptorType: 'CWL',
      workflow_path: '',
      defaultTestParameterFilePath: ''
    };
    const result: BioschemaTool = bs.getWorkflowSchema(workflow, version);
    expect(result['@type']).toEqual('SoftwareApplication');
    expect(result.description).toEqual('text');
    expect(result.softwareVersion).toEqual('version');
    expect(result.audience).toEqual('Bioinformaticians');
    expect(result.identifier).toEqual(0);
    expect(result.name).toEqual('workflow');
    expect(result.dateModified).toEqual('2017-06-28T18:48:18.000Z');
    expect(result.publisher).toEqual({'@type': 'Person', 'name': 'me', 'email': 'me@ucsc.edu'});
  }));
});
