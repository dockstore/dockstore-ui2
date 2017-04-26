import { TestBed, async } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

/* External Services */
import { AuthService } from 'ng2-ui-auth';

/* Internal Modules */
import { HeaderModule } from './shared/header.module';
import { ListContainersModule } from './shared/list-containers.module';
import { ListWorkflowsModule } from './shared/list-workflows.module';
import { TabsModule } from './shared/tabs.module';

/* Components */
import { SponsorsComponent } from './sponsors/sponsors.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SearchWorkflowsComponent } from './search-workflows/search-workflows.component';
import { HomeFootNoteComponent } from './home-foot-note/home-foot-note.component';
import { ToolDetailsComponent } from './tool-details/tool-details.component';

/* Internal Services */
import { DockstoreService } from './shared/dockstore.service';
import { HttpService } from './shared/http.service';
import { TrackLoginService } from './shared/track-login.service';
import { TokenService } from './loginComponents/token.service';
import { UserService } from './loginComponents/user.service';
import { LoginApi } from './login/login.api';
import { LoginService } from './login/login.service';
import { LogoutService } from './shared/logout.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarComponent,
        SponsorsComponent,
        FooterComponent,
      ],
      imports: [
        RouterModule,
        HeaderModule,
        TabsModule,
        ListContainersModule,
        ListWorkflowsModule
      ],
      providers: [
        AuthService,
        TrackLoginService,
      ],

    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));
});
