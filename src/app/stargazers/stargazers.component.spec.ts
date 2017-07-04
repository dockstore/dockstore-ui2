import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StargazersComponent } from './stargazers.component';

describe('StargazersComponent', () => {
  let component: StargazersComponent;
  let fixture: ComponentFixture<StargazersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StargazersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StargazersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
