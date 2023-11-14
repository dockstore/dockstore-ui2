import { inject, TestBed } from '@angular/core/testing';
import { SecurityContext } from '@angular/core';
import { MarkdownWrapperService } from './markdown-wrapper.service';
import { MarkdownService, SECURITY_CONTEXT } from 'ngx-markdown';

describe('MarkdownWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkdownWrapperService, MarkdownService, { provide: SECURITY_CONTEXT, useValue: SecurityContext.HTML }],
    });
  });

  it('should be created', inject([MarkdownWrapperService], (service: MarkdownWrapperService) => {
    expect(service).toBeTruthy();
  }));

  it('should remove tabs from table headers', inject([MarkdownWrapperService], (service: MarkdownWrapperService) => {
    // tab characters should be removed from the header for strings with table syntax
    expect(service.removeTabsFromTableHeaders('|table|with|tabs|\n|\t---|---:|---\t|\n|1|2|3|')).toEqual(
      '|table|with|tabs|\n|    ---|---:|---    |\n|1|2|3|'
    );
    expect(service.removeTabsFromTableHeaders('|test||table|\n | --- \t|| --- \t\t|')).toEqual(
      '|test||table|\n | ---     || ---         |'
    );
    expect(service.removeTabsFromTableHeaders('   | :---: \t   \t| ------: \t | \t---------- |')).toEqual(
      '   | :---:            | ------:      |     ---------- |'
    );

    // tab characters should not removed for strings that do not follow table syntax
    expect(service.removeTabsFromTableHeaders('someString\t')).toEqual('someString\t');
    expect(service.removeTabsFromTableHeaders('this | is | not | a\t | table')).toEqual('this | is | not | a\t | table');
    expect(service.removeTabsFromTableHeaders('---\t-|----\t\t:|-\t---\t-::\t|\n')).toEqual('---\t-|----\t\t:|-\t---\t-::\t|\n');
  }));

  it('should add "raw=true" to img.src attributes generated from inline markdown images and change nothing else', inject(
    [MarkdownWrapperService],
    (service: MarkdownWrapperService) => {
      // add "raw=true" to an img.src that references github
      expect(service.makeGitHubImagesRaw('<img src="https://github.com/some/repo/foo.png" alt="abc" title="123">')).toEqual(
        '<img src="https://github.com/some/repo/foo.png?raw=true" alt="abc" title="123">'
      );
      // add "raw=true" to multiple imgs on same line
      expect(
        service.makeGitHubImagesRaw('<img src="https://github.com/foo.jpg"> some text <img src="https://github.com/bar.jpg">')
      ).toEqual('<img src="https://github.com/foo.jpg?raw=true"> some text <img src="https://github.com/bar.jpg?raw=true">');
      // don't change anything else
      expect(service.makeGitHubImagesRaw('<img src="foo.html" width="120" height="120">')).toEqual(
        '<img src="foo.html" width="120" height="120">'
      );
      expect(service.makeGitHubImagesRaw('<a href="https://github.com/some/repo/foo.html">')).toEqual(
        '<a href="https://github.com/some/repo/foo.html">'
      );
    }
  ));
});
