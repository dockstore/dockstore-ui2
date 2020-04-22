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
import {
  ExtendedDescriptorLanguageBean,
  extendedDescriptorLanguages,
  extendedUnknownDescriptor
} from 'app/entry/extendedDescriptorLanguage';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntryType } from '../enum/entry-type';
import { SessionQuery } from '../session/session.query';
import { ToolDescriptor } from '../swagger';
import { Workflow } from '../swagger/model/workflow';
import { validationDescriptorPatterns } from '../validationMessages.model';
import { MetadataService } from './../swagger/api/metadata.service';
import { DescriptorLanguageBean } from './../swagger/model/descriptorLanguageBean';

@Injectable()
export class DescriptorLanguageService {
  // Known value for the DescriptorLanguageBeans
  readonly knownCWLValue = 'CWL';
  readonly knownWDLValue = 'WDL';
  readonly knownNFLValue = 'NFL';
  readonly knownServiceValue = 'service';

  public descriptorLanguages$: Observable<Array<Workflow.DescriptorTypeEnum>>;
  public descriptorLanguagesInnerHTML$: Observable<string>;
  public noService$: Observable<DescriptorLanguageBean[]>;
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
    this.noService$ = this.descriptorLanguagesBean$.pipe(map(beans => this.filterService(beans)));
    this.descriptorLanguagesInnerHTML$ = this.noService$.pipe(
      map((descriptorLanguageBeans: DescriptorLanguageBean[]) => this.getDescriptorLanguagesInnerHTML(descriptorLanguageBeans))
    );
    const combined$ = combineLatest([this.descriptorLanguages$, this.sessionQuery.entryType$]);
    this.filteredDescriptorLanguages$ = combined$.pipe(map(combined => this.filterLanguages(combined[0], combined[1])));
  }
  static toolDescriptorTypeEnumToDefaultDescriptorPath(descriptorType: ToolDescriptor.TypeEnum | null): string | null {
    return DescriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType).defaultDescriptorPath;
  }

  static toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(
    descriptorType: ToolDescriptor.TypeEnum | null
  ): ExtendedDescriptorLanguageBean {
    const foundExtendedDescriptorLanguageFromValue = extendedDescriptorLanguages.find(
      extendedDescriptorLanguage => extendedDescriptorLanguage.toolDescriptorEnum === descriptorType
    );
    return foundExtendedDescriptorLanguageFromValue || extendedUnknownDescriptor;
  }

  static toolDescriptorTypeEnumTotestParameterFileType(descriptorType: ToolDescriptor.TypeEnum): string | null {
    return this.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType).testParameterFileType;
  }

  static workflowDescriptorTypeEnumToShortFriendlyName(workflowDescriptorTypeEnum: Workflow.DescriptorTypeEnum | null): string | null {
    return this.workflowDescriptorTypeEnumToExtendedDescriptorLanguageBean(workflowDescriptorTypeEnum).shortFriendlyName;
  }

  static workflowDescriptorTypeEnumToExtendedDescriptorLanguageBean(
    descriptorType: Workflow.DescriptorTypeEnum | null
  ): ExtendedDescriptorLanguageBean {
    const foundExtendedDescriptorLanguageFromValue = extendedDescriptorLanguages.find(
      extendedDescriptorLanguage => extendedDescriptorLanguage.workflowDescriptorEnum === descriptorType
    );
    return foundExtendedDescriptorLanguageFromValue || extendedUnknownDescriptor;
  }

  update() {
    this.metadataService.getDescriptorLanguages().subscribe((languageBeans: Array<DescriptorLanguageBean>) => {
      this.descriptorLanguagesBean$.next(languageBeans);
    });
  }

  /**
   * Registering checker workflow has another weird set of accepted string values for descriptor type.
   * It doesn't use ToolDescriptor.TypeEnum, Workflow.DescriptorTypeEnum, or a string.
   * It only accepts 'cwl' or 'wdl' (not even capitals)
   * This function converts ToolDesriptor.TypeEnum to it
   * @param {ToolDescriptor.TypeEnum} descriptorType Descriptor type from ToolDescriptor.TypeEnum
   * @returns {('cwl' | 'wdl' | null)} The weird values accepted by register checker workflow endpoint
   * @memberof DescriptorLanguageService
   */
  toolDescriptorTypeEnumToWeirdCheckerRegisterString(descriptorType: ToolDescriptor.TypeEnum): 'cwl' | 'wdl' | null {
    let descriptorTypeNoNFL: 'cwl' | 'wdl';
    switch (descriptorType) {
      case ToolDescriptor.TypeEnum.CWL: {
        descriptorTypeNoNFL = 'cwl';
        break;
      }
      case ToolDescriptor.TypeEnum.WDL: {
        descriptorTypeNoNFL = 'wdl';
        break;
      }
      default: {
        this.genericUnhandledTypeError(descriptorType);
        return null;
      }
    }
    return descriptorTypeNoNFL;
  }

  /**
   * Returns the validation pattern for the descriptor path associated with the descriptor type
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType  Descriptor type from ToolDescriptor.TypeEnum
   * @returns {string}  The validation pattern
   * @memberof DescriptorLanguageService
   */
  getDescriptorPattern(descriptorType: ToolDescriptor.TypeEnum): string {
    switch (descriptorType) {
      case ToolDescriptor.TypeEnum.CWL: {
        return validationDescriptorPatterns.cwlPath;
      }
      case ToolDescriptor.TypeEnum.WDL: {
        return validationDescriptorPatterns.wdlPath;
      }
      case ToolDescriptor.TypeEnum.NFL: {
        return validationDescriptorPatterns.nflPath;
      }
      case ToolDescriptor.TypeEnum.SERVICE: {
        return '.*';
      }
      default: {
        this.genericUnhandledTypeError(descriptorType);
        return '.*';
      }
    }
  }

  /**
   * Returns the placeholder descriptor path associated with the descriptor type
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType  Descriptor type from ToolDescriptor.TypeEnum
   * @returns {string}  Placeholder descriptor path
   * @memberof DescriptorLanguageService
   */
  workflowDescriptorTypeEnumToPlaceholderDescriptor(descriptorType: ToolDescriptor.TypeEnum | null): string {
    return DescriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType).descriptorPathPlaceholder;
  }

  genericUnhandledTypeError(type: any): void {
    console.error('Unhandled descriptor type: ' + type);
  }

  /**
   * This gets the human-readable innerHTML of the list of descriptor languages with anchors links
   *
   * @param {DescriptorLanguageBean[]} descriptorLanguageBeans
   * @returns {string}
   * @memberof DescriptorLanguageService
   */
  getDescriptorLanguagesInnerHTML(descriptorLanguageBeans: DescriptorLanguageBean[]): string {
    const innerHTMLArray = [];
    descriptorLanguageBeans.forEach(descriptorLanguageBean => {
      switch (descriptorLanguageBean.value) {
        case this.knownCWLValue: {
          innerHTMLArray.push('<a href="https://www.commonwl.org/" target="_blank" rel="noopener noreferrer">CWL</a>');
          break;
        }
        case this.knownWDLValue: {
          innerHTMLArray.push('<a href="https://openwdl.org/" target="_blank" rel="noopener noreferrer">WDL</a>');
          break;
        }
        case this.knownNFLValue: {
          innerHTMLArray.push('<a href="https://www.nextflow.io/" target="_blank" rel="noopener noreferrer">Nextflow</a>');
          break;
        }
        default: {
          this.genericUnhandledTypeError(descriptorLanguageBean.value);
        }
      }
    });
    const length = innerHTMLArray.length;
    if (length === 0) {
      console.error('Something has gone terribly wrong. Could not get corresponding link to descriptor language');
      return 'descriptor languages';
    }
    if (length === 1) {
      return innerHTMLArray[0];
    }
    if (length === 2) {
      return innerHTMLArray.join(' or ');
    }
    if (length >= 3) {
      innerHTMLArray[length - 1] = 'or ' + innerHTMLArray[length - 1];
      return innerHTMLArray.join(', ');
    }
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
    if (descriptorLanguageBean.value === this.knownServiceValue) {
      return ToolDescriptor.TypeEnum.SERVICE;
    } else {
      return <ToolDescriptor.TypeEnum>descriptorLanguageBean.value.toString();
    }
  }

  /**
   * Certain pages ignore the 'service' descriptor language completely, this filters it out of the known languages
   *
   * @param {DescriptorLanguageBean[]} beans  Descriptor language bean returned from the metadata endpoint
   * @returns {DescriptorLanguageBean[]}   Filtered list of languages that do not have 'service' in it
   * @memberof DescriptorLanguageService
   */
  filterService(beans: DescriptorLanguageBean[]): DescriptorLanguageBean[] {
    return beans.filter(bean => bean.value !== this.knownServiceValue);
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
