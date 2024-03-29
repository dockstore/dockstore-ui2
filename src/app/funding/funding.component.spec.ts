/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { HeaderComponent } from '../header/header.component';
import { HeaderModule } from '../shared/modules/header.module';

import { FundingComponent } from './funding.component';

describe('FundingComponent', () => {
  let component: FundingComponent;
  let fixture: ComponentFixture<FundingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HeaderModule, MatDividerModule, MatLegacyCardModule],
        declarations: [FundingComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
