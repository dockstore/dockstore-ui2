import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AliasesService } from './aliases.service';
import { AliasesStore } from './aliases.store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AliasesService', () => {
  let aliasesService: AliasesService;
  let aliasesStore: AliasesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [AliasesService, AliasesStore, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    aliasesService = TestBed.inject(AliasesService);
    aliasesStore = TestBed.inject(AliasesStore);
  });

  it('should be created', () => {
    expect(aliasesService).toBeDefined();
    expect(aliasesStore).toBeDefined();
  });
});
