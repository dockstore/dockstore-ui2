/*
 *    Copyright 2017 OICR
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
import { Injectable } from '@angular/core';
import { faSort, faSortAlphaDown, faSortAlphaUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from './models/ExtendedWorkflow';
import { Tag, WorkflowVersion } from './swagger';

interface SourceObject {
  version: string;
  verifiedSource: string;
}

@Injectable({
  providedIn: 'root',
})
export class DockstoreService {
  constructor() {}

  getValidVersions(versions: Array<WorkflowVersion | Tag>): Array<WorkflowVersion | Tag> {
    return versions.filter((version) => version.valid);
  }

  /**
   * Determines whether any of the versions of the entry are verified
   *
   * @param {(Array<WorkflowVersion|Tag>)} versions  an entry's versions
   * @returns {boolean} Whether or not one of the versions are verified
   * @memberof DockstoreService
   */
  getVersionVerified(versions: Array<WorkflowVersion | Tag>): boolean {
    if (!versions) {
      return false;
    }
    const verifiedVersion = versions.find((version) => version.verified);
    if (verifiedVersion) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Turn this into a pipe to prevent it from being called so often
   *
   * @param {string} name
   * @param {*} verifiedSource
   * @returns {string}
   * @memberof DockstoreService
   */
  getVerifiedSource(name: string, verifiedSource: any): string {
    if (!verifiedSource || !name) {
      console.error('verifiedSource or name is falsey');
      return '';
    }
    for (const source of verifiedSource) {
      if (source.version === name) {
        return source.verifiedSource;
      }
    }
    return '';
  }

  getVerifiedSources(toolRef: ExtendedDockstoreTool) {
    const sources: Array<SourceObject> = [];
    if (toolRef !== null) {
      for (const version of toolRef.workflowVersions) {
        if (version.verified) {
          sources.push({
            version: version.name,
            verifiedSource: version.verifiedSource,
          });
        }
      }
    }
    return sources.filter(function (elem, pos) {
      return sources.indexOf(elem) === pos;
    });
  }

  getVerifiedWorkflowSources(workflow: ExtendedWorkflow) {
    const sources: Array<SourceObject> = [];
    if (workflow !== null) {
      for (const version of workflow.workflowVersions) {
        if (version.verified) {
          sources.push({
            version: version.name,
            verifiedSource: version.verifiedSource,
          });
        }
      }
    }
    return sources.filter(function (elem, pos) {
      return sources.indexOf(elem) === pos;
    });
  }

  getLabelStrings(labels: any[]): string[] {
    const labelValues = labels.map((label) => label.value);
    return labelValues.sort();
  }

  /* Strip mailto from email field */
  stripMailTo(email: string) {
    if (email) {
      return email.replace(/^mailto:/, '');
    }

    return null;
  }

  getIconClass(columnName: string, sortColumn: string, sortReverse: boolean): IconDefinition {
    if (sortColumn === columnName) {
      return !sortReverse ? faSortAlphaDown : faSortAlphaUp;
    } else {
      return faSort;
    }
  }

  getRequestAccessEmail(tool_maintainer_email: string, email: string) {
    if (tool_maintainer_email) {
      return this.stripMailTo(tool_maintainer_email);
    } else {
      return this.stripMailTo(email);
    }
  }
}
