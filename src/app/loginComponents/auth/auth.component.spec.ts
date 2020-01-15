import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from '../../shared/user/user.service';
import { TokenStubService, UserStubService } from '../../test/service-stubs';
import { AuthComponent } from './auth.component';
import { TokenService } from '../../shared/state/token.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [RouterTestingModule.withRoutes([{ path: '**', component: AuthComponent }]), MatSnackBarModule],
      providers: [{ provide: UserService, useClass: UserStubService }, { provide: TokenService, useClass: TokenStubService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
