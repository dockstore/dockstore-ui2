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

@Injectable()
export class DockstoreService {
  constructor() {
  }

  getValidVersions(versions) {
    return versions.filter(version => version.valid);
  }

  getVersionVerified(versions) {
    const verifiedVersion = versions.find(version => version.verified);
    if (verifiedVersion) {
      return true;
    } else {
      return false;
    }
  }

  getVerifiedSource(name: string, verifiedSource: any) {
    for (const source of verifiedSource) {
      if (source.version === name) {
        return source.verifiedSource;
      }
    }
    return '';
  }

  getVerifiedSources(toolRef) {
    const sources = [];
    if (toolRef !== null) {
      for (const version of toolRef.tags) {
        if (version.verified) {
          sources.push({
            version: version.name,
            verifiedSource: version.verifiedSource
          });
        }
      }
    }
    return sources.filter(function (elem, pos) {
      return sources.indexOf(elem) === pos;
    });
  }

  getVerifiedWorkflowSources(workflow) {
    const sources = [];
    if (workflow !== null) {
      for (const version of workflow.workflowVersions) {
        if (version.verified) {
          sources.push({
            version: version.name,
            verifiedSource: version.verifiedSource
          });
        }
      }
    }
    return sources.filter(function (elem, pos) {
      return sources.indexOf(elem) === pos;
    });
  }

  getLabelStrings(labels: any[]): string[] {
    const labelValues = labels.map(label => label.value);
    return labelValues.sort();
  }

  /* Highlight Code */
  highlightCode(code): string {
    return '<pre><code class="YAML highlight">' + code + '</pre></code>';
  }

  /* Strip mailto from email field */
  stripMailTo(email: string) {
    if (email) {
      return email.replace(/^mailto:/, '');
    }

    return null;
  }

  getIconClass(columnName: string, sortColumn: string, sortReverse: boolean) {
    if (sortColumn === columnName) {
      return !sortReverse ? 'glyphicon-sort-by-alphabet' :
        'glyphicon-sort-by-alphabet-alt';
    } else {
      return 'glyphicon-sort';
    }
  }
}
