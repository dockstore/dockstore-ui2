import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaphotExporterModalComponent } from './snaphot-exporter-modal.component';

describe('SnapshotDoiOrcidComponentComponent', () => {
  let component: SnaphotExporterModalComponent;
  let fixture: ComponentFixture<SnaphotExporterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnaphotExporterModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaphotExporterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
