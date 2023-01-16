import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { GA4GHV20Service } from '../../../src/app/shared/openapi';
import { TRSService } from 'app/shared/openapi';

@Injectable()
export class MetadataService {
  metadata: Observable<TRSService>;

  constructor(private gA4GHService: GA4GHV20Service) {
    this.metadata = this.gA4GHService.getServiceInfo().pipe(
      map((metadata) => metadata),
      publishReplay(),
      refCount()
    );
  }

  getMetadata() {
    return this.metadata;
  }
}
