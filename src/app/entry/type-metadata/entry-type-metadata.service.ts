import { Injectable } from '@angular/core';
import { MetadataService, EntryType, EntryTypeMetadata } from '../../shared/openapi';

@Injectable({
  providedIn: 'root',
})
export class EntryTypeMetadataService {
  constructor(private metadataService: MetadataService) {}

  entryTypeMetadataList: EntryTypeMetadata[];

  public load(): Promise<void> {
    return this.metadataService
      .getEntryTypeMetadataList()
      .toPromise()
      .then(
        (entryTypeMetadataList: EntryTypeMetadata[]) => {
          this.entryTypeMetadataList = entryTypeMetadataList;
        },
        (e) => {
          this.entryTypeMetadataList = undefined;
          // The following code is a direct adaptation of the "load failure" code in ConfigurationService
          console.error('Error downloading entry type metadata list', e);
          // Less than ideal, but just let the normal error handling in footer.component.ts kick in later.
          Promise.resolve();
        }
      );
  }

  public get(type: EntryType): EntryTypeMetadata {
    // If no metadata has been retrieved, log and return.
    if (!this.entryTypeMetadataList) {
      console.error('No metadata was retrieved.');
      return undefined;
    }
    // Find the metadata for the specified entry type, log an error if it's not there, and return it.
    const metadata = this.entryTypeMetadataList.find((metadata) => type == metadata.type);
    if (metadata) {
      return metadata;
    } else {
      console.error('No metadata exists for the specified entry type');
      return undefined;
    }
  }

  public getAll(): EntryTypeMetadata[] {
    return this.entryTypeMetadataList;
  }
}
