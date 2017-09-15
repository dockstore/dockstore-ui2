import { PageInfo } from './../shared/models/PageInfo';
import { PagenumberService } from './../shared/pagenumber.service';
import { UserService } from './../loginComponents/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LogoutStubService, UserStubService } from './../test/service-stubs';
import { LogoutService } from '../shared/logout.service';
import { TrackLoginService } from './../shared/track-login.service';
import { PageNumberStubService, TrackLoginStubService } from '../test/service-stubs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let pagenumberService: PagenumberService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [PagenumberService,
        { provide: TrackLoginService, useClass: TrackLoginStubService },
        { provide: LogoutService, useClass: LogoutStubService },
        { provide: UserService, useClass: UserStubService }]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    pagenumberService = fixture.debugElement.injector.get(PagenumberService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create', () => {
    component.resetPageNumber();
    fixture.detectChanges();
    const toolPageInfo: PageInfo = new PageInfo();
    toolPageInfo.pgNumber = 0;
    toolPageInfo.searchQuery = '';
    pagenumberService.pgNumTools$.subscribe(pgNumTools => {
      expect(pgNumTools).toEqual(toolPageInfo);
    });
    pagenumberService.pgNumWorkflows$.subscribe(pgNumTools => {
      expect(pgNumTools).toEqual(toolPageInfo);
    });
  });
});
