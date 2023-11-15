import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGithubAppComponent } from './register-github-app.component';

describe('RegisterGithubAppComponent', () => {
  let component: RegisterGithubAppComponent;
  let fixture: ComponentFixture<RegisterGithubAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterGithubAppComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterGithubAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
