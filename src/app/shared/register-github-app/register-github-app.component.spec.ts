import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGithubAppComponent } from './register-github-app.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('RegisterGithubAppComponent', () => {
  let component: RegisterGithubAppComponent;
  let fixture: ComponentFixture<RegisterGithubAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterGithubAppComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: MatDialogRef,
        },
        {
          provide: MAT_DIALOG_DATA,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterGithubAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
