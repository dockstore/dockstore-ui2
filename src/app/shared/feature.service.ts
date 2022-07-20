import { Injectable } from '@angular/core';
import { Dockstore } from './dockstore.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor() {}

  updateFeatureFlags(queryParams: string) {
    const urlSearchParams = new URLSearchParams(queryParams);
    const newDashboard = urlSearchParams.has('newDashboard');
    Dockstore.FEATURES.enableNewDashboard = newDashboard;
  }
}
