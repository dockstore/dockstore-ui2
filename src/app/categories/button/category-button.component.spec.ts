import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryButtonComponent } from './category-button.component';

describe('CategoryButtonComponent', () => {
  let component: CategoryButtonComponent;
  let fixture: ComponentFixture<CategoryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
