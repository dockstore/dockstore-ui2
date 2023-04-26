// These types represent the various parts of the parsed Jupyter notebook JSON.
// Each describes a union of the variants of each part: for example, the `Cell`
// interface contains properties corresponding to both "code" and "markdown" cells.
// Each includes only the properties that are necessary to process the notebook.

export interface Notebook {
  nbformat?: number;
  nbformat_minor?: number;
  metadata?: NotebookMetadata;
  cells?: Cell[];
}

export interface NotebookMetadata {}

export interface Cell {
  cell_type?: string;
  metadata?: CellMetadata;
  source?: string | string[];
  attachments?: Attachments;
  execution_count?: number | null;
  outputs?: Output[];
}

export interface CellMetadata {
  source_hidden?: boolean;
  outputs_hidden?: boolean;
  id?: string;
  colab_type?: string;
}

export interface Attachments {
  [name: string]: MimeBundle;
}

export interface MimeBundle {
  [mimeType: string]: string | string[];
}

export interface Output {
  output_type?: string;
  name?: string;
  text?: string | string[];
  data?: MimeBundle;
  metadata?: OutputMetadata;
}

export interface OutputMetadata {
  [mimeType: string]: WidthHeight;
}

export interface WidthHeight {
  width?: number;
  height?: number;
}
