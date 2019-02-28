import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationStarringComponent } from './organization-starring.component';

describe('OrganizationStarringComponent', () => {
  let component: OrganizationStarringComponent;
  let fixture: ComponentFixture<OrganizationStarringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationStarringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationStarringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
