import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExporterStepComponent } from './exporter-step.component';

describe('ExporterStepComponent', () => {
  let component: ExporterStepComponent;
  let fixture: ComponentFixture<ExporterStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExporterStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExporterStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
