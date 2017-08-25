import { By } from '@angular/platform-browser';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './../test/router-stubs';
import { HeaderModule } from './../shared/modules/header.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DocsComponent } from './docs.component';

describe('DocsComponent', () => {
  let component: DocsComponent;
  let fixture: ComponentFixture<DocsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
      imports: [HeaderModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render subject', () => {
    const h3 = fixture.debugElement.query(By.css('h3'));
    expect(h3.nativeElement.innerText).toBe(' Documentation');
  });
});
