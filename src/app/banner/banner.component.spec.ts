import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GA4GHStubService } from './../test/service-stubs';
import { BannerComponent } from './banner.component';
import { MetadataService } from '../metadata/metadata.service';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerComponent ],
      providers: [ {provide: MetadataService, useClass: GA4GHStubService} ]
    })
    .compileComponents();
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
