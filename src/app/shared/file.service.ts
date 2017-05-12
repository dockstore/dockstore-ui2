export class FileService {

    /* Highlight Code */
    highlightCode(code: string): string {
      return '<pre><code class="YAML highlight">' + code + '</pre></code>';
    }

}
