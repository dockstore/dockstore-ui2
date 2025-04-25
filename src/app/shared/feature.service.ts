import { Injectable } from '@angular/core';
import { Dockstore } from './dockstore.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  updateFeatureFlags(queryParams: string) {
    const urlSearchParams = new URLSearchParams(queryParams);
    const gitHubAppCallBackToSnakemake = urlSearchParams.has('state') && urlSearchParams.get('state').includes('snakemake');
    const snakemake = urlSearchParams.has('snakemake') || gitHubAppCallBackToSnakemake;
    Dockstore.FEATURES.enableSnakemake = snakemake;
  }
}
