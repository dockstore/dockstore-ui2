import { TestBed } from '@angular/core/testing';

import { SourceFile, ToolDescriptor } from '../swagger';
import { CodeEditorListService } from './code-editor-list.service';

describe('CodeEditorListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodeEditorListService = TestBed.get(CodeEditorListService);
    expect(service).toBeTruthy();
  });
  it('should be able to know if path is a primary descriptor', () => {
    expect(CodeEditorListService.isPrimaryDescriptor('/Dockstore.cwl')).toBe(true);
    expect(CodeEditorListService.isPrimaryDescriptor('/Dockstore.wdl')).toBe(true);
    expect(CodeEditorListService.isPrimaryDescriptor('/nextflow.config')).toBe(true);
    expect(CodeEditorListService.isPrimaryDescriptor('/main.nf')).toBe(true);
    // This seems wrong
    expect(CodeEditorListService.isPrimaryDescriptor('/Dockstore.yml')).toBe(false);
    expect(CodeEditorListService.isPrimaryDescriptor(null)).toBe(false);
    expect(CodeEditorListService.isPrimaryDescriptor('/Dockstore.potato')).toBe(false);
  });

  it('should be able to know if path is a primary descriptor', () => {
    // Brand new hosted workflow with no descriptors
    const primaryCWLFile: SourceFile = {
      content: '',
      absolutePath: '/Dockstore.cwl',
      path: '/Dockstore.cwl',
      type: SourceFile.TypeEnum.DOCKSTORECWL
    };
    const secondaryCWLFile = { content: '', absolutePath: '/.cwl', path: '/.cwl', type: SourceFile.TypeEnum.DOCKSTORECWL };
    const primaryWDLFile = { content: '', absolutePath: '/Dockstore.wdl', path: '/Dockstore.wdl', type: SourceFile.TypeEnum.DOCKSTOREWDL };
    const secondaryWDLFile = { content: '', absolutePath: '/.wdl', path: '/.wdl', type: SourceFile.TypeEnum.DOCKSTOREWDL };
    const firstPrimaryNFLFile = { content: '', absolutePath: '/main.nf', path: '/main.nf', type: SourceFile.TypeEnum.NEXTFLOW };
    const secondPrimaryNFLFile = {
      content: '',
      absolutePath: '/nextflow.config',
      path: '/nextflow.config',
      type: SourceFile.TypeEnum.NEXTFLOWCONFIG
    };
    const secondaryNFLFile = { content: '', absolutePath: '/.nf', path: '/.nf', type: SourceFile.TypeEnum.NEXTFLOW };
    const primaryNFLFiles = [firstPrimaryNFLFile, secondPrimaryNFLFile];
    const primaryGalaxyFile = {
      content: '',
      absolutePath: '/Dockstore.yml',
      path: '/Dockstore.yml',
      type: SourceFile.TypeEnum.DOCKSTOREGXFORMAT2
    };
    const secondaryGalaxyFile = {
      content: '',
      absolutePath: '/.yml',
      path: '/.yml',
      type: SourceFile.TypeEnum.DOCKSTOREGXFORMAT2
    };
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'descriptor', [])).toEqual([primaryCWLFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'descriptor', [])).toEqual([primaryWDLFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.NFL, 'descriptor', [])).toEqual(primaryNFLFiles);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.GXFORMAT2, 'descriptor', [])).toEqual([primaryGalaxyFile]);

    const testCWLFile = { content: '', absolutePath: '/test.cwl.json', path: '/test.cwl.json', type: SourceFile.TypeEnum.CWLTESTJSON };
    const testWDLFile = { content: '', absolutePath: '/test.wdl.json', path: '/test.wdl.json', type: SourceFile.TypeEnum.WDLTESTJSON };
    // Weird because NFL doesn't have test parameter files
    const testNFLFile = {
      content: '',
      absolutePath: '/test.nfl.json',
      path: '/test.nfl.json',
      type: SourceFile.TypeEnum.NEXTFLOWTESTPARAMS
    };
    const testGalaxyFile = {
      content: '',
      absolutePath: '/test.galaxy.json',
      path: '/test.galaxy.json',
      type: SourceFile.TypeEnum.GXFORMAT2TESTFILE
    };
    const testDockerFile = {
      content: '',
      absolutePath: '/Dockerfile',
      path: '/Dockerfile',
      type: SourceFile.TypeEnum.DOCKERFILE
    };
    // Brand new hosted workflow with no test parameter file
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'testParam', [])).toEqual([testCWLFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'testParam', [])).toEqual([testWDLFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.NFL, 'testParam', [])).toEqual([testNFLFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.GXFORMAT2, 'testParam', [])).toEqual([testGalaxyFile]);

    // When there's already the primary descriptor
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'descriptor', [primaryCWLFile])).toEqual([
      secondaryCWLFile
    ]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'descriptor', [primaryWDLFile])).toEqual([
      secondaryWDLFile
    ]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.NFL, 'descriptor', primaryNFLFiles)).toEqual([
      secondaryNFLFile
    ]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.GXFORMAT2, 'descriptor', [primaryGalaxyFile])).toEqual([
      secondaryGalaxyFile
    ]);

    // When there's already a test parameter file
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'testParam', [testCWLFile])).toEqual([testCWLFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'testParam', [testWDLFile])).toEqual([testWDLFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.NFL, 'testParam', [testNFLFile])).toEqual([testNFLFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.GXFORMAT2, 'testParam', [testGalaxyFile])).toEqual([
      testGalaxyFile
    ]);

    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'dockerfile', [])).toEqual([testDockerFile]);
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.WDL, 'dockerfile', [])).toEqual([testDockerFile]);

    expect(CodeEditorListService.determineFilesToAdd(null, null, null)).toEqual([]);

    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.CWL, 'dockerfile', [])).toEqual([testDockerFile]);

    // Unhandled hosted workflow descriptor type
    const weirdServiceFile = {
      content: '',
      absolutePath: '/Dockstore.service',
      path: '/Dockstore.service',
      type: SourceFile.TypeEnum.DOCKSTORECWL
    };
    expect(CodeEditorListService.determineFilesToAdd(ToolDescriptor.TypeEnum.SERVICE, 'descriptor', [])).toEqual([weirdServiceFile]);
  });
  it('should be able to determine whether to show the sourcefile in the current tab or not', () => {
    // Descriptor tab
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTORECWL, 'descriptor', ToolDescriptor.TypeEnum.CWL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.CWLTESTJSON, 'descriptor', ToolDescriptor.TypeEnum.CWL)).toBe(false);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTOREWDL, 'descriptor', ToolDescriptor.TypeEnum.WDL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.WDLTESTJSON, 'descriptor', ToolDescriptor.TypeEnum.WDL)).toBe(false);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOW, 'descriptor', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOWCONFIG, 'descriptor', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, 'descriptor', ToolDescriptor.TypeEnum.NFL)).toBe(
      false
    );
    expect(
      CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTOREGXFORMAT2, 'descriptor', ToolDescriptor.TypeEnum.GXFORMAT2)
    ).toBe(true);
    expect(
      CodeEditorListService.showSourcefile(SourceFile.TypeEnum.GXFORMAT2TESTFILE, 'descriptor', ToolDescriptor.TypeEnum.GXFORMAT2)
    ).toBe(false);

    // Test file tab
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTORECWL, 'testParam', ToolDescriptor.TypeEnum.CWL)).toBe(false);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.CWLTESTJSON, 'testParam', ToolDescriptor.TypeEnum.CWL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTOREWDL, 'testParam', ToolDescriptor.TypeEnum.WDL)).toBe(false);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.WDLTESTJSON, 'testParam', ToolDescriptor.TypeEnum.WDL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOW, 'testParam', ToolDescriptor.TypeEnum.NFL)).toBe(false);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOWCONFIG, 'testParam', ToolDescriptor.TypeEnum.NFL)).toBe(false);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, 'testParam', ToolDescriptor.TypeEnum.NFL)).toBe(
      true
    );
    expect(
      CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTOREGXFORMAT2, 'testParam', ToolDescriptor.TypeEnum.GXFORMAT2)
    ).toBe(false);
    expect(
      CodeEditorListService.showSourcefile(SourceFile.TypeEnum.GXFORMAT2TESTFILE, 'testParam', ToolDescriptor.TypeEnum.GXFORMAT2)
    ).toBe(true);

    // Dockerfile tab, everything is true because something else handles it...?
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTORECWL, 'dockerfile', ToolDescriptor.TypeEnum.CWL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.CWLTESTJSON, 'dockerfile', ToolDescriptor.TypeEnum.CWL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTOREWDL, 'dockerfile', ToolDescriptor.TypeEnum.WDL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.WDLTESTJSON, 'dockerfile', ToolDescriptor.TypeEnum.WDL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOW, 'dockerfile', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOWCONFIG, 'dockerfile', ToolDescriptor.TypeEnum.NFL)).toBe(true);
    expect(CodeEditorListService.showSourcefile(SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, 'dockerfile', ToolDescriptor.TypeEnum.NFL)).toBe(
      true
    );
    expect(
      CodeEditorListService.showSourcefile(SourceFile.TypeEnum.DOCKSTOREGXFORMAT2, 'dockerfile', ToolDescriptor.TypeEnum.GXFORMAT2)
    ).toBe(true);
    expect(
      CodeEditorListService.showSourcefile(SourceFile.TypeEnum.GXFORMAT2TESTFILE, 'dockerfile', ToolDescriptor.TypeEnum.GXFORMAT2)
    ).toBe(true);
    expect(CodeEditorListService.showSourcefile(null, null, null)).toBe(true);
  });
});
