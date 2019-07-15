/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntryType } from '../enum/entry-type';
import { SessionQuery } from '../session/session.query';
import { ToolDescriptor } from '../swagger';
import { Workflow } from '../swagger/model/workflow';
import { MetadataService } from './../swagger/api/metadata.service';
import { DescriptorLanguageBean } from './../swagger/model/descriptorLanguageBean';

@Injectable()
export class DescriptorLanguageService {
  public descriptorLanguages$: Observable<Array<Workflow.DescriptorTypeEnum>>;
  private descriptorLanguagesBean$ = new BehaviorSubject<DescriptorLanguageBean[]>([]);
  public filteredDescriptorLanguages$: Observable<Array<Workflow.DescriptorTypeEnum>>;
  constructor(private metadataService: MetadataService, private sessionQuery: SessionQuery) {
    this.update();
    this.descriptorLanguages$ = this.descriptorLanguagesBean$.pipe(
      map(descriptorLanguageMap => {
        if (descriptorLanguageMap) {
          return descriptorLanguageMap.map(descriptorLanguage => <Workflow.DescriptorTypeEnum>descriptorLanguage.value.toString());
        }
      })
    );
    const combined$ = combineLatest(this.descriptorLanguages$, this.sessionQuery.entryType$);
    this.filteredDescriptorLanguages$ = combined$.pipe(map(combined => this.filterLanguages(combined[0], combined[1])));
  }
  update() {
    this.metadataService.getDescriptorLanguages().subscribe((languageBeans: Array<DescriptorLanguageBean>) => {
      this.descriptorLanguagesBean$.next(languageBeans);
    });
  }

  /**
   * In almost all cases, the string value from the DescriptorLanguageBean matches the ToolDescriptor.TypeEnum exactly.
   * However, for services, it does not.
   *
   * @param {DescriptorLanguageBean} descriptorLanguageBean
   * @returns
   * @memberof DescriptorLanguageService
   */
  convertDescriptorLanguageBeanToToolDescriptorTypeEnum(descriptorLanguageBean: DescriptorLanguageBean): ToolDescriptor.TypeEnum {
    if (descriptorLanguageBean.value === 'service') {
      return ToolDescriptor.TypeEnum.SERVICE;
    } else {
      return <ToolDescriptor.TypeEnum>descriptorLanguageBean.value.toString();
    }
  }

  /**
   * Some entries are not meant to show all descriptor types
   *
   * @param {ToolDescriptor.TypeEnum[]} descriptorTypes
   * @param {EntryType} entryType
   * @returns {ToolDescriptor.TypeEnum[]}
   * @memberof DescriptorLanguageService
   */
  filterLanguages(descriptorTypes: Workflow.DescriptorTypeEnum[], entryType: EntryType): Workflow.DescriptorTypeEnum[] {
    if (entryType === EntryType.BioWorkflow || entryType === EntryType.Tool || !entryType) {
      return descriptorTypes.filter(descriptorType => descriptorType !== Workflow.DescriptorTypeEnum.Service);
    } else {
      return [Workflow.DescriptorTypeEnum.Service];
    }
  }
}
