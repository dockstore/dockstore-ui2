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
