/*
 *    Copyright 2018 OICR
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
import { inject, TestBed } from '@angular/core/testing';
import {
  cwlSourceFileWithCommentedMixinImport,
  cwlSourceFileWithHttpRun,
  cwlSourceFileWithHttpsImport,
  cwlSourceFileWithIncludeImport,
  cwlSourceFileWithMixinImport,
  cwlSourceFileWithNoImport,
  cwlSourceFileWithSomeHttpLinks,
  emptyWdlSourceFile,
  sampleSourceFile,
  sampleTag,
  wdlSourceFile,
  wdlSourceFileWithCommentedHttpImport,
  wdlSourceFileWithHttpImport
} from '../test/mocked-objects';
import { ga4ghPath } from './constants';
import { Dockstore } from './dockstore.model';
import { FileService } from './file.service';
import { ToolDescriptor } from './swagger';

describe('FileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileService]
    });
  });

  it('should get descriptor path', inject([FileService], (fileService: FileService) => {
    const tag = sampleTag;
    const sourceFile = sampleSourceFile;
    const descriptorType = ToolDescriptor.TypeEnum.CWL;
    const entryType = 'tool';
    const url = fileService.getDescriptorPath('quay.io/org/repo', tag, sourceFile, descriptorType, entryType);
    expect(url).toEqual(Dockstore.API_URI + ga4ghPath + '/tools/quay.io%2Forg%2Frepo/versions/sampleName/PLAIN-CWL/descriptor/%2Fcwl.json');
  }));

  it('should get downloadFilePath', inject([FileService], (fileService: FileService) => {
    const id = '#workflow/github.com/HumanCellAtlas/skylab/HCA_SmartSeq2';
    const versionId = 'dockstore';
    const type = 'PLAIN-WDL';
    const relativePath = 'HISAT2.wdl';
    const downloadFilePath = fileService.getDownloadFilePath(id, versionId, type, relativePath);
    expect(downloadFilePath).toEqual(
      Dockstore.API_URI +
        // tslint:disable-next-line: max-line-length
        '/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2FHumanCellAtlas%2Fskylab%2FHCA_SmartSeq2/versions/dockstore/PLAIN-WDL/descriptor/HISAT2.wdl'
    );
  }));

  it('should detect http import in WDL', inject([FileService], (fileService: FileService) => {
    expect(fileService.hasHttpImport(wdlSourceFileWithHttpImport)).toBeTruthy();
    expect(fileService.hasHttpImport(wdlSourceFileWithCommentedHttpImport)).toBeFalsy();
    expect(fileService.hasHttpImport(emptyWdlSourceFile)).toBeFalsy();
    expect(fileService.hasHttpImport(wdlSourceFile)).toBeFalsy();
  }));

  it('should detect http import in CWL', inject([FileService], (fileService: FileService) => {
    expect(fileService.hasHttpImport(cwlSourceFileWithNoImport)).toBeFalsy();
    expect(fileService.hasHttpImport(cwlSourceFileWithHttpsImport)).toBeTruthy();
    expect(fileService.hasHttpImport(cwlSourceFileWithMixinImport)).toBeTruthy();
    expect(fileService.hasHttpImport(cwlSourceFileWithCommentedMixinImport)).toBeFalsy();
    expect(fileService.hasHttpImport(cwlSourceFileWithIncludeImport)).toBeTruthy();
    expect(fileService.hasHttpImport(cwlSourceFileWithSomeHttpLinks)).toBeFalsy();
    expect(fileService.hasHttpImport(cwlSourceFileWithHttpRun)).toBeTruthy();
  }));
});
