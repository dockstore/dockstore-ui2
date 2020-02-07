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
import { ToolDescriptor } from '../swagger';
import { DescriptorLanguageBean } from './../swagger/model/descriptorLanguageBean';
import { DescriptorLanguageService } from './descriptor-language.service';

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
    filteredDescriptorLanguageBeans.forEach(descriptorLanguageBean => {
      expect(descriptorLanguageBean.value).not.toEqual(descriptorLanguageService.knownServiceValue);
    });
  });
  it('should be able to get home page inner HTML', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    descriptorLanguageBeans.push({ friendlyName: 'potato', value: 'CWL' });

    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let innerHTML = descriptorLanguageService.getHomepageInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(`<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>`);
    descriptorLanguageBeans.push({ friendlyName: 'beef', value: 'WDL' });
    innerHTML = descriptorLanguageService.getHomepageInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(
      `<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a> or <a href="http://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>`
    );
    descriptorLanguageBeans.push({ friendlyName: 'stew', value: 'NFL' });
    innerHTML = descriptorLanguageService.getHomepageInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(
      `<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>, <a href="http://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>, or <a href="https://www.nextflow.io/" target="_blank" rel="noopener noreferrer">Nextflow</a>`
    );
    descriptorLanguageBeans.push({ friendlyName: 'hmm', value: 'service' });
    innerHTML = descriptorLanguageService.getHomepageInnerHTML(descriptorLanguageBeans);
    expect(innerHTML).toEqual(
      `<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>, <a href="http://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>, or <a href="https://www.nextflow.io/" target="_blank" rel="noopener noreferrer">Nextflow</a>`
    );
  });
  it('should be able to get descriptor path placeholder', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.CWL);
    expect(placeholder).toEqual('e.g. /Dockstore.cwl');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.WDL);
    expect(placeholder).toEqual('e.g. /Dockstore.wdl');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.NFL);
    expect(placeholder).toEqual('e.g. /nextflow.config');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(ToolDescriptor.TypeEnum.SERVICE);
    expect(placeholder).toEqual('');
    placeholder = descriptorLanguageService.workflowDescriptorTypeEnumToPlaceholderDescriptor(<ToolDescriptor.TypeEnum>'UnrecognizedType');
    expect(placeholder).toEqual('');
  });
  it('should be able to get descriptor path pattern', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.getDescriptorPattern(ToolDescriptor.TypeEnum.CWL);
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
  it('should be able to get weird descriptor type for checker workflow registration', () => {
    const descriptorLanguageBeans: DescriptorLanguageBean[] = [];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(descriptorLanguageBeans));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    let placeholder = descriptorLanguageService.toolDescriptorTypeEnumToWeirdCheckerRegisterString(ToolDescriptor.TypeEnum.CWL);
    expect(placeholder).toEqual('cwl');
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToWeirdCheckerRegisterString(ToolDescriptor.TypeEnum.WDL);
    expect(placeholder).toEqual('wdl');
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToWeirdCheckerRegisterString(ToolDescriptor.TypeEnum.NFL);
    expect(placeholder).toEqual(null);
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToWeirdCheckerRegisterString(ToolDescriptor.TypeEnum.SERVICE);
    expect(placeholder).toEqual(null);
    placeholder = descriptorLanguageService.toolDescriptorTypeEnumToWeirdCheckerRegisterString(<ToolDescriptor.TypeEnum>'UnrecognizedType');
    expect(placeholder).toEqual(null);
  });
});
