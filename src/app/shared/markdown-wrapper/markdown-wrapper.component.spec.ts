import { SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarkdownModule, MarkdownService, SECURITY_CONTEXT } from 'ngx-markdown';
import { BaseUrlPipe } from '../entry/base-url.pipe';
import { MarkdownWrapperComponent } from './markdown-wrapper.component';

describe('MarkdownWrapperComponent', () => {
  let wrapperComponent: MarkdownWrapperComponent;
  let fixture: ComponentFixture<MarkdownWrapperComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MarkdownModule],
        declarations: [MarkdownWrapperComponent],
        providers: [MarkdownService, { provide: SECURITY_CONTEXT, useValue: SecurityContext.HTML }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownWrapperComponent);
    fixture.detectChanges();
    wrapperComponent = fixture.debugElement.componentInstance;
  });

  it(
    'should create the app',
    waitForAsync(() => {
      expect(wrapperComponent).toBeDefined();
    })
  );

  it(
    'should contain h1',
    waitForAsync(() => {
      wrapperComponent.data = '# Header1';
      wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('Header1');
    })
  );

  it(
    'should contain h2',
    waitForAsync(() => {
      wrapperComponent.data = '## Header2';
      wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('Header2');
    })
  );

  it(
    'should have correctly sanitized spans',
    waitForAsync(() => {
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
    })
  );

  it(
    'should not sanitize text ',
    waitForAsync(() => {
      wrapperComponent.data =
        '`<span class="mat-focus-indicator mat-flat-button mat-button-base mat-primary"><a href="javascript:window.alert(\'mashing\')">Safe!</a></span>`';
      wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('class="mat-focus-indicator mat-flat-button mat-button-base mat-primary');
      expect(fixture.nativeElement.innerHTML).toContain('href="javascript:window.alert(\'mashing\')"');
      expect(fixture.nativeElement.innerHTML).toContain('Safe!');
    })
  );

  it(
    'Link generated for relative link in markdown should be correct',
    waitForAsync(() => {
      const pipe = new BaseUrlPipe();
      wrapperComponent.data = '[relative link here](docs/hello_world.md)';
      wrapperComponent.baseUrl = pipe.transform('https://github.com/kathy-t/hello_world', 'master');
      wrapperComponent.ngOnChanges(); // has to be called manually in unit tests (TestBed doesn't by default)
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(
        '<a href="https://github.com/kathy-t/hello_world/blob/master/docs/hello_world.md">relative link here</a>'
      );
    })
  );
});
