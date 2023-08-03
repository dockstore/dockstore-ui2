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
    expect(service.removeTabsFromTableHeaders('|test||table|\n| --- \t|| --- \t\t|')).toEqual('|test||table|\n| ---     || ---         |');
    expect(service.removeTabsFromTableHeaders('| :--: \t   \t| ------: \t | \t---------- |')).toEqual(
      '| :--:            | ------:      |     ---------- |'
    );

    // tab characters should not removed for strings that do not follow table syntax
    expect(service.removeTabsFromTableHeaders('| this | is | not | a\t | table |')).toEqual('| this | is | not | a\t | table |');
    expect(service.removeTabsFromTableHeaders('not |\n|| | a |----||--\t  ---|table')).toEqual('not |\n|| | a |----||--\t  ---|table');
    expect(service.removeTabsFromTableHeaders('|---\t-|----\t\t:|-\t---\t-::\t|\n')).toEqual('|---\t-|----\t\t:|-\t---\t-::\t|\n');
  }));
});
