import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetadataService } from '../metadata/metadata.service';
import { GA4GHService } from './../shared/swagger/api/gA4GH.service';
import { GA4GHStubService } from './../test/service-stubs';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [MetadataService, { provide: GA4GHService, useClass: GA4GHStubService }],
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
