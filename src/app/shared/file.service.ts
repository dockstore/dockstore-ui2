export class FileService {

    /* Highlight Code */
    highlightCode(code: string): string {
      return '<pre><code class="yaml highlight">' + code + '</pre></code>';
    }
}
