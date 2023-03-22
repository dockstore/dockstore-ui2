import { Component, Input, OnChanges } from '@angular/core';
import { FileService } from 'app/shared/file.service';
import { SourceFile, Workflow, WorkflowVersion } from 'app/shared/openapi';
import { finalize } from 'rxjs/operators';
import { SourceFileTabsService } from '../source-file-tabs/source-file-tabs.service';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { Observable } from 'rxjs';
import { NotebookFormatter } from './formatter';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import { Renderer } from 'marked';

@Component({
  selector: 'app-formatted-notebook',
  templateUrl: './formatted-notebook.component.html',
  styleUrls: ['./formatted-notebook.component.scss'],
})
export class FormattedNotebookComponent implements OnChanges {
  constructor(
    private fileService: FileService,
    private sourceFileTabsService: SourceFileTabsService,
    private markdownWrapperService: MarkdownWrapperService
  ) {}
  @Input() workflow: Workflow;
  @Input() version: WorkflowVersion;
  loading = true;
  formatted = '';
  displayError = false;

  ngOnChanges() {
    this.retrieveAndFormatNotebook();
  }

  retrieveAndFormatNotebook() {
    this.loading = true;
    this.displayError = false;
    this.sourceFileTabsService
      .getSourceFiles(this.workflow.id, this.version.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (sourceFiles: SourceFile[]) => {
          sourceFiles.forEach((sourceFile) => {
            if (this.isPrimaryDescriptor(sourceFile.path)) {
              this.formatted = this.format(sourceFile.content);
            }
          });
        },
        () => {
          this.displayError = true;
        }
      );
  }

  isPrimaryDescriptor(path: string): boolean {
    return path === this.version.workflow_path;
  }

  format(notebook: string): string {
    const json = JSON.parse(notebook);
    const cells: string[] = json['cells'] ?? [];
    console.log(cells);
    let output = '';
    cells.forEach((cell) => {
      const type = cell['cell_type'];
      if (type == 'markdown') {
        output += '<div class="markdown_cell">markdown</div>';
        output += '<div>' + this.renderMarkdown(cell['source'].join('\n')) + '</div>';
        output += '<div>' + this.renderMarkdown('# Heading!\nsome **text**') + '</div>';
        output += '<div>' + this.renderMarkdown('![inline image](attachment:f>oo.png "title")') + '</div>';
        output += '<div>moo!</div>';
      }
      if (type == 'code') {
        output += '<div>code</div>';
      }
    });

    return output;
  }

  renderMarkdown(markdown: string): string {
    const renderer = new Renderer();
    const escape = this.escape;
    // TODO add code to generate attachment images
    renderer.image = function (href, title, text) {
      return '[an attachment image] ' + escape(escape(href)) + ' ' + title + ' ' + text;
    };
    return this.markdownWrapperService.customCompileWithOptions(markdown, { baseUrl: '', renderer: renderer });
  }

  // TODO make better https://stackoverflow.com/questions/1787322/what-is-the-htmlspecialchars-equivalent-in-javascript
  escape(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }
}
