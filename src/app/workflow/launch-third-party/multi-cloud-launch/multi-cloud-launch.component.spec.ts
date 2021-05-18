import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CustomMaterialModule } from '../../../shared/modules/material.module';
import { UsersService } from '../../../shared/openapi';
import { UserStubService } from '../../../test/service-stubs';
import { FilterCloudInstancesPipe } from '../filterCloudInstances.pipe';
import { MultiCloudLaunchComponent } from './multi-cloud-launch.component';

describe('MultiCloudLaunchComponent', () => {
  let component: MultiCloudLaunchComponent;
  let fixture: ComponentFixture<MultiCloudLaunchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MultiCloudLaunchComponent, FilterCloudInstancesPipe],
        imports: [CustomMaterialModule, HttpClientModule],
        providers: [{ provider: UsersService, useClass: UserStubService }],
      });
    })
  );

  beforeEach(() => {
    TestBed.inject(UsersService);
    fixture = TestBed.createComponent(MultiCloudLaunchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
