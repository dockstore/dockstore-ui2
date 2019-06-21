import { BioschemaService } from './bioschema.service';
import {inject, TestBed} from '@angular/core/testing';
import {DateService} from './date.service';

describe('BioschemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BioschemaService, DateService]
    });
  });

  it('should be created', inject([BioschemaService, DateService], (service: BioschemaService) => {
    expect(service).toBeTruthy();
  }));
  // it('should be a json', inject([DateService], (service: DateService) => {
  //   // create a DockstoreTool object
  //   // result = getToolSchema(DockstoreTool object)
  //   // verify the result is a json, maybe an empty one if I am creating a new empty tool
  // }));
});
