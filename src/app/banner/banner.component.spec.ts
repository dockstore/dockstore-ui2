import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ServiceInfoService } from '../service-info/service-info.service';
import { GA4GHV20Service } from './../shared/openapi';
import { GA4GHV20StubService } from './../test/service-stubs';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BannerComponent],
        providers: [ServiceInfoService, { provide: GA4GHV20Service, useClass: GA4GHV20StubService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
