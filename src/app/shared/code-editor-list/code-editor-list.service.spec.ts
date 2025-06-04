import { TestBed } from '@angular/core/testing';

import { SourceFile, ToolDescriptor } from '../openapi';
import { CodeEditorListService } from './code-editor-list.service';
import { DescriptorLanguageService } from '../entry/descriptor-language.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CodeEditorListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CodeEditorListService,
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', () => {
    const service: CodeEditorListService = TestBed.inject(CodeEditorListService);
    expect(service).toBeTruthy();
  });

  it('should be able to know if path is a primary descriptor', () => {
    const service: CodeEditorListService = TestBed.inject(CodeEditorListService);
    expect(service.isPrimaryDescriptor('/Snakefile')).toBe(true);
    expect(service.isPrimaryDescriptor('/Dockstore.cwl')).toBe(true);
    expect(service.isPrimaryDescriptor('/Dockstore.wdl')).toBe(true);
    expect(service.isPrimaryDescriptor('/nextflow.config')).toBe(true);
    expect(service.isPrimaryDescriptor('/main.nf')).toBe(true);
    expect(service.isPrimaryDescriptor('/workflow-name.yml')).toBe(true);
    expect(service.isPrimaryDescriptor(null)).toBe(false);
    expect(service.isPrimaryDescriptor('/Dockstore.potato')).toBe(false);
  });

  it('should be able to determine files to add', () => {
    const service: CodeEditorListService = TestBed.inject(CodeEditorListService);
    // Brand new hosted workflow with no descriptors
    const primarySMKFile = {
      content: '',
      absolutePath: '/Snakefile',
      path: '/Snakefile',
      type: SourceFile.TypeEnum.DOCKSTORESMK,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const primaryCWLFile: SourceFile = {
      content: '',
      absolutePath: '/Dockstore.cwl',
      path: '/Dockstore.cwl',
      type: SourceFile.TypeEnum.DOCKSTORECWL,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const secondaryCWLFile = {
      content: '',
      absolutePath: '/.cwl',
      path: '/.cwl',
      type: SourceFile.TypeEnum.DOCKSTORECWL,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const primaryWDLFile = {
      content: '',
      absolutePath: '/Dockstore.wdl',
      path: '/Dockstore.wdl',
      type: SourceFile.TypeEnum.DOCKSTOREWDL,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const secondaryWDLFile = {
      content: '',
      absolutePath: '/.wdl',
      path: '/.wdl',
      type: SourceFile.TypeEnum.DOCKSTOREWDL,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const firstPrimaryNFLFile = {
      content: '',
      absolutePath: '/main.nf',
      path: '/main.nf',
      type: SourceFile.TypeEnum.NEXTFLOW,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const secondPrimaryNFLFile = {
      content: '',
      absolutePath: '/nextflow.config',
      path: '/nextflow.config',
      type: SourceFile.TypeEnum.NEXTFLOWCONFIG,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const secondaryNFLFile = {
      content: '',
      absolutePath: '/.nf',
      path: '/.nf',
      type: SourceFile.TypeEnum.NEXTFLOW,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const primaryNFLFiles = [firstPrimaryNFLFile, secondPrimaryNFLFile];
    const primaryGalaxyFile = {
      content: '',
      absolutePath: '/workflow-name.yml',
      path: '/workflow-name.yml',
      type: SourceFile.TypeEnum.DOCKSTOREGXFORMAT2,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const secondaryGalaxyFile = {
      content: '',
      absolutePath: '/.yml',
      path: '/.yml',
      type: SourceFile.TypeEnum.DOCKSTOREGXFORMAT2,
      state: SourceFile.StateEnum.COMPLETE,
    };
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.SMK, 'descriptor', [])).toEqual([primarySMKFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'descriptor', [])).toEqual([primaryCWLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'descriptor', [])).toEqual([primaryWDLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.NFL, 'descriptor', [])).toEqual(primaryNFLFiles);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.GALAXY, 'descriptor', [])).toEqual([primaryGalaxyFile]);

    const testSMKFile = {
      content: '',
      absolutePath: '/test.smk.json',
      path: '/test.smk.json',
      type: SourceFile.TypeEnum.SMKTESTPARAMS,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const testCWLFile = {
      content: '',
      absolutePath: '/test.cwl.json',
      path: '/test.cwl.json',
      type: SourceFile.TypeEnum.CWLTESTJSON,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const testWDLFile = {
      content: '',
      absolutePath: '/test.wdl.json',
      path: '/test.wdl.json',
      type: SourceFile.TypeEnum.WDLTESTJSON,
      state: SourceFile.StateEnum.COMPLETE,
    };
    // Weird because NFL doesn't have test parameter files
    const testNFLFile = {
      content: '',
      absolutePath: '/test.nfl.json',
      path: '/test.nfl.json',
      type: SourceFile.TypeEnum.NEXTFLOWTESTPARAMS,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const testGalaxyFile = {
      content: '',
      absolutePath: '/test.galaxy.json',
      path: '/test.galaxy.json',
      type: SourceFile.TypeEnum.GXFORMAT2TESTFILE,
      state: SourceFile.StateEnum.COMPLETE,
    };
    const testDockerFile = {
      content: '',
      absolutePath: '/Dockerfile',
      path: '/Dockerfile',
      type: SourceFile.TypeEnum.DOCKERFILE,
      state: SourceFile.StateEnum.COMPLETE,
    };
    // Brand new hosted workflow with no test parameter file
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.SMK, 'testParam', [])).toEqual([testSMKFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'testParam', [])).toEqual([testCWLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'testParam', [])).toEqual([testWDLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.NFL, 'testParam', [])).toEqual([testNFLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.GALAXY, 'testParam', [])).toEqual([testGalaxyFile]);

    // When there's already the primary descriptor
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'descriptor', [primaryCWLFile])).toEqual([secondaryCWLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'descriptor', [primaryWDLFile])).toEqual([secondaryWDLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.NFL, 'descriptor', primaryNFLFiles)).toEqual([secondaryNFLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.GALAXY, 'descriptor', [primaryGalaxyFile])).toEqual([secondaryGalaxyFile]);

    // When there's already a test parameter file
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.SMK, 'testParam', [testSMKFile])).toEqual([testSMKFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'testParam', [testCWLFile])).toEqual([testCWLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'testParam', [testWDLFile])).toEqual([testWDLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.NFL, 'testParam', [testNFLFile])).toEqual([testNFLFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.GALAXY, 'testParam', [testGalaxyFile])).toEqual([testGalaxyFile]);

    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'dockerfile', [])).toEqual([testDockerFile]);
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'dockerfile', [])).toEqual([testDockerFile]);

    expect(service.determineFilesToAdd(null, null, null)).toEqual([]);

    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'dockerfile', [])).toEqual([testDockerFile]);

    const weirdServiceFile = {
      content: '',
      absolutePath: '/.dockstore.yml',
      path: '/.dockstore.yml',
      type: SourceFile.TypeEnum.DOCKSTORECWL,
      state: SourceFile.StateEnum.COMPLETE,
    };
    expect(service.determineFilesToAdd(ToolDescriptor.TypeEnum.SERVICE, 'descriptor', [])).toEqual([weirdServiceFile]);
  });

  it('should be able to determine whether to show the sourcefile in the current tab or not', () => {
    const service: CodeEditorListService = TestBed.inject(CodeEditorListService);
    // Descriptor tab
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTORESMK, 'descriptor', ToolDescriptor.TypeEnum.SMK)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.SMKTESTPARAMS, 'descriptor', ToolDescriptor.TypeEnum.SMK)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTORECWL, 'descriptor', ToolDescriptor.TypeEnum.CWL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.CWLTESTJSON, 'descriptor', ToolDescriptor.TypeEnum.CWL)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTOREWDL, 'descriptor', ToolDescriptor.TypeEnum.WDL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.WDLTESTJSON, 'descriptor', ToolDescriptor.TypeEnum.WDL)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOW, 'descriptor', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOWCONFIG, 'descriptor', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, 'descriptor', ToolDescriptor.TypeEnum.NFL)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTOREGXFORMAT2, 'descriptor', ToolDescriptor.TypeEnum.GALAXY)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.GXFORMAT2TESTFILE, 'descriptor', ToolDescriptor.TypeEnum.GALAXY)).toBe(false);

    // Test file tab
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTORESMK, 'testParam', ToolDescriptor.TypeEnum.SMK)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.SMKTESTPARAMS, 'testParam', ToolDescriptor.TypeEnum.SMK)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTORECWL, 'testParam', ToolDescriptor.TypeEnum.CWL)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.CWLTESTJSON, 'testParam', ToolDescriptor.TypeEnum.CWL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTOREWDL, 'testParam', ToolDescriptor.TypeEnum.WDL)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.WDLTESTJSON, 'testParam', ToolDescriptor.TypeEnum.WDL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOW, 'testParam', ToolDescriptor.TypeEnum.NFL)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOWCONFIG, 'testParam', ToolDescriptor.TypeEnum.NFL)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, 'testParam', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTOREGXFORMAT2, 'testParam', ToolDescriptor.TypeEnum.GALAXY)).toBe(false);
    expect(service.showSourcefile(SourceFile.TypeEnum.GXFORMAT2TESTFILE, 'testParam', ToolDescriptor.TypeEnum.GALAXY)).toBe(true);

    // Dockerfile tab, everything is true because something else handles it...?
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTORECWL, 'dockerfile', ToolDescriptor.TypeEnum.CWL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.CWLTESTJSON, 'dockerfile', ToolDescriptor.TypeEnum.CWL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTOREWDL, 'dockerfile', ToolDescriptor.TypeEnum.WDL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.WDLTESTJSON, 'dockerfile', ToolDescriptor.TypeEnum.WDL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOW, 'dockerfile', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOWCONFIG, 'dockerfile', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, 'dockerfile', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.DOCKSTOREGXFORMAT2, 'dockerfile', ToolDescriptor.TypeEnum.GALAXY)).toBe(true);
    expect(service.showSourcefile(SourceFile.TypeEnum.GXFORMAT2TESTFILE, 'dockerfile', ToolDescriptor.TypeEnum.GALAXY)).toBe(true);
    expect(service.showSourcefile(null, null, null)).toBe(true);
  });
});
