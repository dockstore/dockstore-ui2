import { AfterViewInit, Component, SecurityContext, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownModule, MarkdownService, SECURITY_CONTEXT } from 'ngx-markdown';
import { MarkdownWrapperComponent } from './markdown-wrapper.component';

@Component({
  template: `<markdown-wrapper class="markdown1" fxFlex [data]="fakeHTML"></markdown-wrapper>`,
})
class MockParentComponent implements AfterViewInit {
  @ViewChild(MarkdownWrapperComponent) appComponentRef: MarkdownWrapperComponent;
  fakeHTML: string = '' + '# Hello' + '<span class="phishingScam">Hello!</span>' + '';
  ngAfterViewInit() {}
}

fdescribe('MarkdownWrapperComponent', () => {
  let mock: MockParentComponent;
  let wrapperComponent: MarkdownWrapperComponent;
  let fixture: ComponentFixture<MockParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownModule],
      declarations: [MockParentComponent, MarkdownWrapperComponent],
      providers: [MarkdownService, { provide: SECURITY_CONTEXT, useValue: SecurityContext.HTML }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockParentComponent);
    fixture.detectChanges();

    mock = fixture.debugElement.componentInstance;
    wrapperComponent = mock.appComponentRef;
  });

  it('should create the app', async(() => {
    expect(wrapperComponent).toBeDefined();
  }));

  it('should not contain class', async(() => {
    console.log(wrapperComponent.mkdRef.element);
    const trueHTML: string = wrapperComponent.mkdRef.element.nativeElement.innerHTML;
    expect(trueHTML).not.toContain('class');
    expect(trueHTML).toContain('Hello!');
  }));

  // it('should not contain class', async(() => {
  //   mock.fakeHTML = '<span class="phishingScam moreclass">goodbye!</span>';
  //   fixture.detectChanges();
  //   const trueHTML: string = wrapperComponent.mkdRef.element.nativeElement.innerHTML;
  //   console.log(trueHTML);
  //   expect(trueHTML).not.toContain("class");
  //   expect(trueHTML).toContain("Hello!");
  // }));
});
