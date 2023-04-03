import { Injectable } from '@angular/core';
import { Dockstore } from './dockstore.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor() {}

  updateFeatureFlags(queryParams: string) {
    const urlSearchParams = new URLSearchParams(queryParams);
    const gitHubAppCallBackToNewDashBoard = urlSearchParams.has('state') && urlSearchParams.get('state').includes('newDashboard');
    const newDashboard = urlSearchParams.has('newDashboard') || gitHubAppCallBackToNewDashBoard;
    Dockstore.FEATURES.enableNewDashboard = newDashboard;
    const gitHubAppCallBackToNotebooks = urlSearchParams.has('state') && urlSearchParams.get('state').includes('notebooks');
    const notebooks = urlSearchParams.has('notebooks') || gitHubAppCallBackToNotebooks;
    Dockstore.FEATURES.enableNotebooks = notebooks;
  }
}
