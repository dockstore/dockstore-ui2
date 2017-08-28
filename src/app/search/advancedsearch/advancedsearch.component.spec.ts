import { AdvancedSearchStubService } from '../../test/service-stubs';
import { AdvancedSearchService } from './advanced-search.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchComponent } from './advancedsearch.component';

describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSearchComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ ModalModule.forRoot() ],
      providers: [{provide: AdvancedSearchService, useClass: AdvancedSearchStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
