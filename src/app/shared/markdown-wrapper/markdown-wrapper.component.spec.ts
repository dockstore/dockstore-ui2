import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';
import { MarkdownWrapperComponent } from './markdown-wrapper.component';

describe('MarkdownWrapperComponent', () => {
  let markdownWrapper: MarkdownWrapperComponent;
  let fixture: ComponentFixture<MarkdownWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ declarations: [MarkdownWrapperComponent] }).compileComponents();
    fixture = TestBed.createComponent(MarkdownWrapperComponent);
    markdownWrapper = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(markdownWrapper).toBeDefined();
  });

  it('should contain markdown element', () => {
    const currHTML: HTMLElement = fixture.debugElement.nativeElement;
    expect(currHTML.innerHTML).toContain('markdown');
  });

  it('should sanitize html', () => {
    const fakeHTMLInput = '<span class="mat-focus-indicator mat-flat-button mat-button-base mat-primary">Delete Your Potatoes</span>';
    markdownWrapper.data = fakeHTMLInput;
    expect(markdownWrapper.customSanitize(fakeHTMLInput)).not.toContain('class');
  });
});
