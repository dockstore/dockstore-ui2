import { AfterViewInit, Component, SecurityContext, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownModule, MarkdownService, SECURITY_CONTEXT } from 'ngx-markdown';
import { MarkdownWrapperComponent } from './markdown-wrapper.component';

@Component({
  template: `<markdown-wrapper class="markdown1" fxFlex [data]="fakeHTML"></markdown-wrapper>`,
})
class MockParentComponent implements AfterViewInit {
  @ViewChild(MarkdownWrapperComponent) appComponentRef: MarkdownWrapperComponent;
  fakeHTML: string = '# Header1' +
    '\n <span class="phishingScam"><a>Fake Button!</a></span>' +
    '\n ## Header2' +
    '\n <span class="mat-focus-indicator mat-flat-button mat-button-base mat-primary"><a href="www.github.com">has href but no styling</a></span>' +
    '\n <span class="mat-focus-indicator mat-flat-button mat-button-base mat-primary"><a href="javascript:window.alert(\'mashing\')">no href and no styling</a></span>' +
    '\n `<span class="mat-focus-indicator mat-flat-button mat-button-base mat-primary"><a href="javascript:window.alert(\'mashing\')">Safe!</a></span>`';
  ngAfterViewInit() {}
}

describe('MarkdownWrapperComponent', () => {
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

  it('should contain h1', async(() => {
    const trueHTML: string = wrapperComponent.mkdRef.element.nativeElement.querySelector('h1').innerHTML;
    expect(trueHTML).toContain('Header1');
  }));

  it('should contain h2', async(() => {
    const trueHTML: string = wrapperComponent.mkdRef.element.nativeElement.querySelector('h2').innerHTML;
    expect(trueHTML).toContain('Header2');
  }));

  it('should have correctly sanitized spans', async(() => {
    const spanArray = wrapperComponent.mkdRef.element.nativeElement.querySelectorAll('span');

    // first <span> should contain just a link and no class
    expect(spanArray[0].outerHTML).toContain('Fake Button!');
    expect(spanArray[0].outerHTML).not.toContain('class');

    // second span should have an href but no classes
    expect(spanArray[1].outerHTML).toContain('has href but no styling');
    expect(spanArray[1].outerHTML).toContain('<a href="www.github.com">has href but no styling</a>');
    expect(spanArray[1].outerHTML).not.toContain('class');

    // third span should have no href and no styling
    expect(spanArray[2].outerHTML).toContain('no href and no styling');
    expect(spanArray[2].outerHTML).not.toContain('href=');
    expect(spanArray[2].outerHTML).not.toContain('class');
  }));

  it('should not sanitize text ', async(() => {
    const trueHTML: string = wrapperComponent.mkdRef.element.nativeElement.querySelector('code').innerHTML;
    expect(trueHTML).toContain('class="mat-focus-indicator mat-flat-button mat-button-base mat-primary');
    expect(trueHTML).toContain('href="javascript:window.alert(\'mashing\')');
    expect(trueHTML).toContain('Safe!');
  }));
});
