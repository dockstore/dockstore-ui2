import { WorkflowsService } from './swagger/api/workflows.service';
import { ContainersService } from './swagger/api/containers.service';
import {Inject, Injectable} from '@angular/core';
import { RequestMethod, URLSearchParams} from '@angular/http';
import { AuthService } from 'ng2-ui-auth';
import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from './http.service';


@Injectable()
export class DockstoreService {
  constructor(private httpService: HttpService,
              private authService: AuthService, private containersService: ContainersService, private workflowsService: WorkflowsService) {
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
      // for (let i = 0; i < toolRef.tags.length; i++) {
      //   if (toolRef.tags[ i ].verified) {
      //     sources.push(toolRef.tags[ i ].verifiedSource);
      //   }
      // }
      for (const version of toolRef.tags){
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
  setContainerLabels(containerId: number, labels: string) {
    return this.containersService.updateLabels(containerId, labels);
  }

  setWorkflowLabels(workflowId: number, labels: string) {
    return this.workflowsService.updateLabels(workflowId, labels);
  }
}
