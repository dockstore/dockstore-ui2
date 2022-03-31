/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';
import { DescriptorLanguageBean, ToolDescriptor, Workflow } from '../swagger';
import { DescriptorLanguageService } from './descriptor-language.service';
import { SourceFile } from '../openapi';

describe('Service: DescriptorLanguage', () => {
  let metadataServiceSpy;
  let workflowQuerySpy;
  beforeAll(() => {
    metadataServiceSpy = jasmine.createSpyObj('MetadataService', ['getDescriptorLanguages']);
    workflowQuerySpy = jasmine.createSpyObj('WorkflowQuery', ['getDescriptorLanguages']);
  });
  it('should return the descriptor languages in an string array', () => {
    const stubValue: Array<DescriptorLanguageBean> = [{ value: 'cwl' }, { value: 'wdl' }, { value: 'nextflow' }];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(stubValue));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    descriptorLanguageService.filteredDescriptorLanguages$.pipe(first()).subscribe((languages: Array<string>) => {
      expect(languages).toEqual(['cwl', 'wdl', 'nextflow'], 'service returned stub value');
    });
  });
  it('should be able to filter service out', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    descriptorLanguageBeans.push({ friendlyName: 'potato', value: 'potato' });
    descriptorLanguageBeans.push({ friendlyName: 'beef', value: 'beef' });
    descriptorLanguageBeans.push({ friendlyName: 'stew', value: 'stew' });
    descriptorLanguageBeans.push({ friendlyName: 'generic placeholder for services', value: 'service' });
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    const filteredDescriptorLanguageBeans = descriptorLanguageService.filterService(descriptorLanguageBeans);
    expect(filteredDescriptorLanguageBeans.length).toEqual(3);
    filteredDescriptorLanguageBeans.forEach((descriptorLanguageBean) => {
      expect(descriptorLanguageBean.value).not.toEqual(descriptorLanguageService.knownServiceValue);
    });
  });
  it('should be able to get home page inner HTML', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    descriptorLanguageBeans.push({ friendlyName: 'potato', value: 'CWL' });

    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let innerHTML = descriptorLanguageService.getDescriptorLanguagesInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(`<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>`);
    descriptorLanguageBeans.push({ friendlyName: 'beef', value: 'WDL' });
    innerHTML = descriptorLanguageService.getDescriptorLanguagesInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(
      `<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a> or <a href="https://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>`
    );
    descriptorLanguageBeans.push({ friendlyName: 'stew', value: 'NFL' });
    innerHTML = descriptorLanguageService.getDescriptorLanguagesInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(
      `<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>, <a href="https://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>, or <a href="https://www.nextflow.io/" target="_blank" rel="noopener noreferrer">Nextflow</a>`
    );
    descriptorLanguageBeans.push({ friendlyName: 'cow', value: 'SMK' });
    innerHTML = descriptorLanguageService.getDescriptorLanguagesInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(
      `<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>, <a href="https://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>, <a href="https://www.nextflow.io/" target="_blank" rel="noopener noreferrer">Nextflow</a>, or <a href="https://snakemake.github.io/" target="_blank" rel="noopener noreferrer">Snakemake</a>`
    );
    descriptorLanguageBeans.push({ friendlyName: 'goat', value: 'gxformat2' });
    innerHTML = descriptorLanguageService.getDescriptorLanguagesInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(
      `<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>, <a href="https://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>, <a href="https://www.nextflow.io/" target="_blank" rel="noopener noreferrer">Nextflow</a>, <a href="https://snakemake.github.io/" target="_blank" rel="noopener noreferrer">Snakemake</a>, or <a href="https://galaxyproject.org/" target="_blank" rel="noopener noreferrer">Galaxy</a>`
    );
    descriptorLanguageBeans.push({ friendlyName: 'hmm', value: 'service' });
    innerHTML = descriptorLanguageService.getDescriptorLanguagesInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(
      `<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>, <a href="https://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>, <a href="https://www.nextflow.io/" target="_blank" rel="noopener noreferrer">Nextflow</a>, <a href="https://snakemake.github.io/" target="_blank" rel="noopener noreferrer">Snakemake</a>, <a href="https://galaxyproject.org/" target="_blank" rel="noopener noreferrer">Galaxy</a>, or <a href="https://docs.dockstore.org/en/stable/getting-started/getting-started-with-services.html" target="_blank" rel="noopener noreferrer">Service</a>`
    );
  });
  it('should be able to get descriptor path placeholder', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.SMK);
    expect(placeholder).toEqual('e.g. /Snakefile');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.CWL);
    expect(placeholder).toEqual('e.g. /Dockstore.cwl');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.WDL);
    expect(placeholder).toEqual('e.g. /Dockstore.wdl');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.NFL);
    expect(placeholder).toEqual('e.g. /nextflow.config');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.SERVICE);
    expect(placeholder).toEqual('e.g. /.dockstore.yml');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.GXFORMAT2);
    expect(placeholder).toEqual('e.g. /Dockstore.yml');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(<ToolDescriptor.TypeEnum>'UnrecognizedType');
    expect(placeholder).toEqual('');
  });
  it('should be able to get descriptor path pattern', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.getDescriptorPattern(ToolDescriptor.TypeEnum.SMK);
    expect(placeholder).toEqual('^/([^/?:*|<>]++/)*(Snakefile|[^./?:*|<>]++.smk))$');
    placeholder = descriptorLanguageService.getDescriptorPattern(ToolDescriptor.TypeEnum.CWL);
    expect(placeholder).toEqual('^/([^/?:*|<>]+/)*[^/?:*|<>]+.(cwl|yaml|yml)');
    placeholder = descriptorLanguageService.getDescriptorPattern(ToolDescriptor.TypeEnum.WDL);
    expect(placeholder).toEqual('^/([^/?:*|<>]+/)*[^/?:*|<>]+.wdl$');
    placeholder = descriptorLanguageService.getDescriptorPattern(ToolDescriptor.TypeEnum.NFL);
    expect(placeholder).toEqual('^/([^/?:*|<>]+/)*[^/?:*|<>]+.(config)');
    placeholder = descriptorLanguageService.getDescriptorPattern(ToolDescriptor.TypeEnum.SERVICE);
    expect(placeholder).toEqual('.*');
    placeholder = descriptorLanguageService.getDescriptorPattern(<ToolDescriptor.TypeEnum>'UnrecognizedType');
    expect(placeholder).toEqual('.*');
  });
  it('should be able to get shortFriendlyName from Worfklow.DescriptorTypeEnum for workflow registration', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.SMK);
    expect(placeholder).toEqual('Snakemake');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.CWL);
    expect(placeholder).toEqual('CWL');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.WDL);
    expect(placeholder).toEqual('WDL');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.NFL);
    expect(placeholder).toEqual('Nextflow');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.Service);
    expect(placeholder).toEqual('Service');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.Gxformat2);
    expect(placeholder).toEqual('Galaxy');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(null);
    expect(placeholder).toEqual(null);
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(<Workflow.DescriptorTypeEnum>'UnrecognizedType');
    expect(placeholder).toEqual(null);
  });

  it('should be able to get defaultDescriptorPath from ToolDescriptor.TypeEnum for workflow stub language changing', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(ToolDescriptor.TypeEnum.SMK);
    expect(placeholder).toEqual('/Snakefile');
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(ToolDescriptor.TypeEnum.CWL);
    expect(placeholder).toEqual('/Dockstore.cwl');
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(ToolDescriptor.TypeEnum.WDL);
    expect(placeholder).toEqual('/Dockstore.wdl');
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(ToolDescriptor.TypeEnum.NFL);
    expect(placeholder).toEqual('/nextflow.config');
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(ToolDescriptor.TypeEnum.SERVICE);
    expect(placeholder).toEqual('/.dockstore.yml');
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(ToolDescriptor.TypeEnum.GXFORMAT2);
    expect(placeholder).toEqual('/Dockstore.yml');
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(null);
    expect(placeholder).toEqual(null);
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(<ToolDescriptor.TypeEnum>'UnrecognizedType');
    expect(placeholder).toEqual(null);
  });

  it('should be able to get Tool descriptor enum from SourceFile type enum', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.testParameterTypeEnumToToolDescriptorEnum(SourceFile.TypeEnum.SMKTESTPARAMS);
    expect(placeholder).toEqual(ToolDescriptor.TypeEnum.SMK);
    placeholder = descriptorLanguageService.testParameterTypeEnumToToolDescriptorEnum(SourceFile.TypeEnum.CWLTESTJSON);
    expect(placeholder).toEqual(ToolDescriptor.TypeEnum.CWL);
    placeholder = descriptorLanguageService.testParameterTypeEnumToToolDescriptorEnum(SourceFile.TypeEnum.WDLTESTJSON);
    expect(placeholder).toEqual(ToolDescriptor.TypeEnum.WDL);
    placeholder = descriptorLanguageService.testParameterTypeEnumToToolDescriptorEnum(SourceFile.TypeEnum.NEXTFLOWTESTPARAMS);
    expect(placeholder).toEqual(ToolDescriptor.TypeEnum.NFL);
    placeholder = descriptorLanguageService.testParameterTypeEnumToToolDescriptorEnum(SourceFile.TypeEnum.GXFORMAT2TESTFILE);
    expect(placeholder).toEqual(ToolDescriptor.TypeEnum.GXFORMAT2);
    placeholder = descriptorLanguageService.testParameterTypeEnumToToolDescriptorEnum(<SourceFile.TypeEnum>'UnrecognizedType');
    expect(placeholder).toEqual(null);
  });

  it('should be able to get descriptor path list', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.getDescriptorLanguagesDefaultDescriptorPaths();
    expect(placeholder).toContain('/Dockstore.cwl');
    expect(placeholder).toContain('/Dockstore.yml'); // Galaxy
    expect(placeholder).toContain('/nextflow.config');
    expect(placeholder).toContain('/Snakefile');
    expect(placeholder).toContain('/Dockstore.wdl');
    // Service not included at this time
    expect(placeholder).not.toContain('/.dockstore.yml');
  });

  it('should be able to get tool descriptor types list', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.getDescriptorLanguagesToolTypes();
    expect(placeholder).toContain(ToolDescriptor.TypeEnum.CWL);
    expect(placeholder).toContain(ToolDescriptor.TypeEnum.GXFORMAT2);
    expect(placeholder).toContain(ToolDescriptor.TypeEnum.NFL);
    expect(placeholder).toContain(ToolDescriptor.TypeEnum.SMK);
    expect(placeholder).toContain(ToolDescriptor.TypeEnum.WDL);
    // Service not included at this time
    expect(placeholder).not.toContain(ToolDescriptor.TypeEnum.SERVICE);
  });
});
