import { RouterTestingModule } from '@angular/router/testing';
import { TokensStubService, TokenStubService } from './../../test/service-stubs';
import { TokenService } from '../token.service';
import { AuthComponent } from './auth.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';


describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthComponent],
      imports: [ RouterTestingModule.withRoutes([{path: '**', component: AuthComponent}]) ],
      providers: [{provide: TokenService, useClass: TokenStubService}]
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
