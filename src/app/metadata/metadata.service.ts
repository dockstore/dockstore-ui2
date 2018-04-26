import { Injectable } from '@angular/core';
import { GA4GHService } from '../../../src/app/shared/swagger/api/gA4GH.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Metadata } from './../shared/swagger/model/metadata';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/publishReplay';

@Injectable()
export class MetadataService {
  metadata: any;

  constructor(private gA4GHService: GA4GHService) {
    this.metadata = this.gA4GHService.metadataGet()
        .map(metadata => metadata).publishReplay().refCount();
  }

  getMetadata() {
    return this.metadata;
  }
}
