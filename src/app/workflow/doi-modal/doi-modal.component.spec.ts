import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoiModalComponent } from './doi-modal.component';

describe('SnapshotDoiOrcidComponentComponent', () => {
  let component: DoiModalComponent;
  let fixture: ComponentFixture<DoiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoiModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
