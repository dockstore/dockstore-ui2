import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetadataService } from '../metadata/metadata.service';
import { GA4GHV20Service } from './../shared/openapi/api/gA4GHV20.service';
import { GA4GHV20StubService } from './../test/service-stubs';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [MetadataService, { provide: GA4GHV20Service, useClass: GA4GHV20StubService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
