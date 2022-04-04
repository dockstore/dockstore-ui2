import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubAppToolsAccordionComponent } from './github-app-tools-accordion.component';

describe('GithubAppToolsAccordionComponent', () => {
  let component: GithubAppToolsAccordionComponent;
  let fixture: ComponentFixture<GithubAppToolsAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GithubAppToolsAccordionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubAppToolsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
