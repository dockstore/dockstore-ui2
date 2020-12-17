import { SecurityContext } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownModule, MarkdownService, SECURITY_CONTEXT } from 'ngx-markdown';
import { MarkdownWrapperComponent } from './markdown-wrapper.component';

describe('MarkdownWrapperComponent', () => {
  let wrapperComponent: MarkdownWrapperComponent;
  let fixture: ComponentFixture<MarkdownWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownModule],
      declarations: [MarkdownWrapperComponent],
      providers: [MarkdownService, { provide: SECURITY_CONTEXT, useValue: SecurityContext.HTML }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownWrapperComponent);
    fixture.detectChanges();
    wrapperComponent = fixture.debugElement.componentInstance;
  });

  it('should create the app', async(() => {
    expect(wrapperComponent).toBeDefined();
  }));

  it('should contain h1', async(() => {
    wrapperComponent.data = '# Header1';
    wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('Header1');
  }));

  it('should contain h2', async(() => {
    wrapperComponent.data = '## Header2';
    wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('Header2');
  }));

  it('should have correctly sanitized spans', async(() => {
    // first <span> should contain just a link and no class
    wrapperComponent.data = '<span class="phishingScam"><a>Fake Button!</a></span>';
    wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('Fake Button!');
    expect(fixture.nativeElement.innerHTML).not.toContain('class');

    // second span should have an href but no classes
    wrapperComponent.data =
      '<span class="mat-focus-indicator mat-flat-button mat-button-base mat-primary"><a href="www.github.com">has href but no styling</a></span>';
    wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('has href but no styling');
    expect(fixture.nativeElement.innerHTML).toContain('<a href="www.github.com">has href but no styling</a>');
    expect(fixture.nativeElement.innerHTML).not.toContain('class');

    // third span should have no href and no styling
    wrapperComponent.data =
      '<span class="mat-focus-indicator mat-flat-button mat-button-base mat-primary"><a href="javascript:window.alert(\'mashing\')">no href and no styling</a></span>';
    wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('no href and no styling');
    expect(fixture.nativeElement.innerHTML).not.toContain('href=');
    expect(fixture.nativeElement.innerHTML).not.toContain('class');
  }));

  it('should not sanitize text ', async(() => {
    wrapperComponent.data =
      '`<span class="mat-focus-indicator mat-flat-button mat-button-base mat-primary"><a href="javascript:window.alert(\'mashing\')">Safe!</a></span>`';
    wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('class="mat-focus-indicator mat-flat-button mat-button-base mat-primary');
    expect(fixture.nativeElement.innerHTML).toContain('href="javascript:window.alert(\'mashing\')"');
    expect(fixture.nativeElement.innerHTML).toContain('Safe!');
  }));
});
