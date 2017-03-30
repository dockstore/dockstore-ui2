import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchContainersComponent } from './search-containers.component';

describe('SearchContainersComponent', () => {
  let component: SearchContainersComponent;
  let fixture: ComponentFixture<SearchContainersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchContainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
