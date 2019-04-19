import { Injectable } from '@angular/core';
import { Config, MetadataService } from './shared/swagger';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private metadataService: MetadataService) {
  }

  load(): Promise<any> {
    return this.metadataService.getConfig().toPromise().then((config: Config) => {
      console.log(config);
    });
  }
}
