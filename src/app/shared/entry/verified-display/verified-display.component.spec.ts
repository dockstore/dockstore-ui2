/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomMaterialModule } from '../../modules/material.module';
import { SourceFile } from '../../swagger';
import { VerifiedDisplayComponent } from './verified-display.component';
import { testSourceFiles } from '../../../test/mocked-objects';

describe('VerifiedDisplayComponent', () => {
  let component: VerifiedDisplayComponent;
  let fixture: ComponentFixture<VerifiedDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifiedDisplayComponent],
      imports: [CustomMaterialModule, BrowserAnimationsModule]
    })
      .compileComponents();
  }));

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
      'path': '/\u2028Dockstore-BTCA-SG.json',
      'platform': 'Dockstore CLI',
      'platformVersion': '1.0.0',
      'metadata': 'Docktesters group'
    },
    {
      'path': '/\u2028Dockstore.json',
      'platform': 'Dockstore CLI',
      'platformVersion': 'N/A',
      'metadata': 'Docktesters group'
    }
  ];

  it('should create datasource data from sourcefiles', () => {
    expect(component.getCustomVerificationInformationArray(testSourceFiles))
      .toEqual(expectedObject);
  });
});
