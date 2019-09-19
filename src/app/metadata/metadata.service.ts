import { refCount, publishReplay, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { GA4GHService } from '../../../src/app/shared/swagger/api/gA4GH.service';
import { Observable } from 'rxjs';
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
