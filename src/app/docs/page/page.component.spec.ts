import { TwitterService } from './../../shared/twitter.service';
import { DocsStubService } from './../../test/service-stubs';
import { DocsService } from './../docs.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective, RouterOutletStubComponent, ActivatedRouteStub, ActivatedRoute } from './../../test/router-stubs';
import { MarkdownModule } from 'angular2-markdown';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageComponent,
        RouterLinkStubDirective, RouterOutletStubComponent],
      imports: [MarkdownModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: DocsService, useClass: DocsStubService },
        TwitterService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
