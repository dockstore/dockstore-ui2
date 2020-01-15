import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsComponent } from './organizations.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTooltipModule, MatProgressBarModule } from '@angular/material';
import { LoadingComponent } from 'app/shared/loading/loading.component';

describe('OrganizationsComponent', () => {
  let component: OrganizationsComponent;
  let fixture: ComponentFixture<OrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationsComponent, LoadingComponent],
      imports: [RouterTestingModule, MatFormFieldModule, FormsModule, HttpClientTestingModule, MatTooltipModule, MatProgressBarModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
