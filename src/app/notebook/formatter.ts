import DOMPurify from 'dompurify';
import { MarkdownService } from 'ngx-markdown';

export class NotebookFormatter {
  public error: false;

  /*
  type NbFormat {
    metadata: ...
    cells: ...
  }
  */

  constructor() {}

  public format(notebook: string): string {
    const json = JSON.parse(notebook);
    const cells: string[] = json['cells'] ?? [];
    console.log(cells);
    let output = '';
    cells.forEach((cell) => {
      const type = cell['cell_type'];
      if (type == 'markdown') {
        output += '<div>markdown</div>';
        output += '<app-markdown-wrapper data="some markdown" baseUrl="">abc</app-markdown-wrapper>';
        output += '<div>moo</div>';
      }
      if (type == 'code') {
        output += '<div>code</div>';
      }
    });

    // output += "<div><b>Cell:</b> " + cell + "," + cell['cell_type'] + "</div>" + "<app-markdown-wrapper data='' MarkdownService.parse(cell['contents']));
    return output;
  }
}
