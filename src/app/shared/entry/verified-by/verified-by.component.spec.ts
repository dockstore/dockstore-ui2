import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VerifiedByComponent } from './verified-by.component';

describe('VerifiedByComponent', () => {
  let component: VerifiedByComponent;
  let fixture: ComponentFixture<VerifiedByComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [VerifiedByComponent],
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
