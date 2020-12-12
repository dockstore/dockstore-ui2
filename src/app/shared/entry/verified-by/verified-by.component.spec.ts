import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CustomMaterialModule } from '../../modules/material.module';
import { VerifiedByComponent } from './verified-by.component';

describe('VerifiedByComponent', () => {
  let component: VerifiedByComponent;
  let fixture: ComponentFixture<VerifiedByComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CustomMaterialModule],
        declarations: [VerifiedByComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
