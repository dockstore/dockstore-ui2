export class NotebookFormatter {
  public error: false;

  /*
  type NbFormat {
    metadata: ...
    cells: ...
  }
  */

  constructor() {}

  public format(notebook: any): string {
    const cells: string = notebook['cells'];
    console.log(cells);
    return 'NotebookFormatter[ ' + notebook + ' ]';
  }
}
