import { Injectable } from '@angular/core';
import { Dockstore } from './dockstore.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  updateFeatureFlags(queryParams: string) {
    const urlSearchParams = new URLSearchParams(queryParams);
    const gitHubAppCallBackToMetrics = urlSearchParams.has('state') && urlSearchParams.get('state').includes('metrics');
    const metrics = urlSearchParams.has('metrics') || gitHubAppCallBackToMetrics;
    Dockstore.FEATURES.enableMetrics = true;
  }
}
