import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TokenService } from '../token.service';
import { UserService } from '../user.service';
import { TokenStubService, UserStubService } from './../../test/service-stubs';
import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [RouterTestingModule.withRoutes([{ path: '**', component: AuthComponent }])],
      providers: [
        { provide: TokenService, useClass: TokenStubService },
        { provide: UserService, useClass: UserStubService }
      ]
    })
      .compileComponents();
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
