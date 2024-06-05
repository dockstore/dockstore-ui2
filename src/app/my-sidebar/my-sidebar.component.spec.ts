import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderService } from '../shared/provider.service';
import { ActivatedRoute, ActivatedRouteStub } from '../test';
import { ProviderStubService } from '../test/service-stubs';
import { MySidebarComponent } from './my-sidebar.component';

describe('MySidebarComponent', () => {
  let component: MySidebarComponent;
  let fixture: ComponentFixture<MySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySidebarComponent],
      providers: [
        { provide: ProviderService, useClass: ProviderStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
