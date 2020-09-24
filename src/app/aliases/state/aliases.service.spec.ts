import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AliasesService } from './aliases.service';
import { AliasesStore } from './aliases.store';

describe('AliasesService', () => {
  let aliasesService: AliasesService;
  let aliasesStore: AliasesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AliasesService, AliasesStore],
      imports: [HttpClientTestingModule],
    });

    aliasesService = TestBed.inject(AliasesService);
    aliasesStore = TestBed.inject(AliasesStore);
  });

  it('should be created', () => {
    expect(aliasesService).toBeDefined();
  });
});
