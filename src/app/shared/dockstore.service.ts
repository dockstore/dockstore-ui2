import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class DockstoreService {
  private static readonly months = [ 'Jan.', 'Feb.', 'Mar.', 'Apr.',
                                     'May', 'Jun.', 'Jul.', 'Aug.',
                                     'Sept.', 'Oct.', 'Nov.', 'Dec.' ];

  constructor(private http: Http) {
  }

  getValidVersions(versions) {
    const validVersions = [];

    for (const version of versions) {
      if (version.valid) {
        validVersions.push(version);
      }
    }

    return validVersions;
  }

  getVersionVerified(versions) {
    for (const version of versions) {
      if (version.verified) {
        return true;
      }
    }
    return false;
  }

  getVerifiedSources(toolRef) {
    const sources = [];
    if (toolRef !== null) {
      for (let i = 0; i < toolRef.tags.length; i++) {
        if (toolRef.tags[ i ].verified) {
          sources.push(toolRef.tags[ i ].verifiedSource);
        }
      }
    }
    return sources.filter(function (elem, pos) {
      return sources.indexOf(elem) === pos;
    });
  }

  getLabelStrings(labels: any[]): string[] {
    const sortedLabels = labels.sort(function (a, b) {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
    });
    const labelStrings = [];
    for (let i = 0; i < sortedLabels.length; i++) {
      labelStrings.push(sortedLabels[i].value);
    }
    return labelStrings;
  }

  private isEncoded(uri: string): boolean {
    if (uri) {
      return uri !== decodeURIComponent(uri);
    }

    return null;
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
