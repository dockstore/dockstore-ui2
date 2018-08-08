import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material';

import { CustomMaterialModule } from '../../../../shared/modules/material.module';
import { UserStubService } from '../../../../test/service-stubs';
import { UserService } from '../../../user.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog.component';

describe('DeleteAccountDialogComponent', () => {
  let component: DeleteAccountDialogComponent;
  let fixture: ComponentFixture<DeleteAccountDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAccountDialogComponent ],
      imports: [CustomMaterialModule, ReactiveFormsModule],
      providers: [{provide: UserService, useClass: UserStubService}, {
        provide: MatDialogRef,
        useValue: {
          close: (dialogResult: any) => { }
        }
      }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
