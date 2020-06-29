import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { GA4GHService } from '../../../src/app/shared/swagger/api/gA4GH.service';
import { Metadata } from './../shared/swagger/model/metadata';

@Injectable()
export class MetadataService {
  metadata: Observable<Metadata>;

  constructor(private gA4GHService: GA4GHService) {
    this.metadata = this.gA4GHService.metadataGet().pipe(
      map(metadata => metadata),
      publishReplay(),
      refCount()
    );
  }

  getMetadata() {
    return this.metadata;
  }
}
