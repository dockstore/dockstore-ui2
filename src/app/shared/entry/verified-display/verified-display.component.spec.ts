/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { versionVerifiedPlatform } from '../../../test/mocked-objects';
import { VerifiedDisplayComponent } from './verified-display.component';

describe('VerifiedDisplayComponent', () => {
  let component: VerifiedDisplayComponent;
  let fixture: ComponentFixture<VerifiedDisplayComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule, VerifiedDisplayComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  const expectedObject = [
    {
      path: '/\u2028Dockstore-BTCA-SG.json',
      platform: 'Dockstore CLI',
      platformVersion: '1.0.0',
      metadata: 'Docktesters group',
    },
    {
      path: '/\u2028Dockstore.json',
      platform: 'Dockstore CLI',
      platformVersion: 'N/A',
      metadata: 'Docktesters group',
    },
  ];

  it('should create datasource data from sourcefiles', () => {
    expect(component.getCustomVerificationInformationArray(1, versionVerifiedPlatform)).toEqual(expectedObject);
  });
});
