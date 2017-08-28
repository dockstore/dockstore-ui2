import { UserService } from './../loginComponents/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LogoutStubService, UserStubService } from './../test/service-stubs';
import { LogoutService } from '../shared/logout.service';
import { TrackLoginService } from './../shared/track-login.service';
import { PageNumberStubService, TrackLoginStubService } from '../test/service-stubs';
import { PagenumberService } from '../shared/pagenumber.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [ RouterTestingModule ],
      schemas: [NO_ERRORS_SCHEMA ],
      providers: [{provide: PagenumberService, useClass: PageNumberStubService},
      {provide: TrackLoginService, useClass: TrackLoginStubService},
    {provide: LogoutService, useClass: LogoutStubService},
  {provide: UserService, useClass: UserStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
