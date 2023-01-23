import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { GA4GHV20Service } from '../shared/openapi';
import { TRSService } from 'app/shared/openapi';

@Injectable()
export class ServiceInfoService {
  serviceInfo: Observable<TRSService>;

  constructor(private gA4GHService: GA4GHV20Service) {
    this.serviceInfo = this.gA4GHService.getServiceInfo().pipe(
      map((serviceInfo) => serviceInfo),
      publishReplay(),
      refCount()
    );
  }

  getServiceInfo() {
    return this.serviceInfo;
  }
}
