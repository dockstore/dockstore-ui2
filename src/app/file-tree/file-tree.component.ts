import { Component, Inject } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SourceFile } from 'app/shared/swagger';

/** File node data with possible child nodes. */
export interface FileNode {
  name: string;
  absolutePath: string;
  children?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  level: number;
  absolutePath: string;
  expandable: boolean;
}

/**
 * TODO: Dialog title? Dialog actions?
 * TODO: In the tree, it's not obvious to click on a file to select
 * TODO: When to actually use this component instead of the simpler dropdown? Over a certain amount of files?
 * TODO: Add a better indicator for currently selected file in the tree
 * TODO: Expand the parent nodes where the selected file is a child of
 * TODO: Truncate new file label (fix the select file button shrinking without css, add padding between the label and the button)
 * Stretch TODO: Make sure there's always more than one child node, otherwise collapse child with parent (i.e. instead of parentname => childname, it's just parentname/childname)
 */
@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
})
export class FileTreeComponent {
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  constructor(
    private matDialogRef: MatDialogRef<FileTreeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { files: SourceFile[]; selectedFile: SourceFile }
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.convertSourceFilesToTree(data.files);
  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number): FlatTreeNode {
    return {
      name: node.name,
      level,
      absolutePath: node.absolutePath,
      expandable: !!node.children && node.children.length > 0,
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode): number {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode): FileNode[] | null | undefined {
    return node.children;
  }

  selectFile(node: FileNode) {
    this.matDialogRef.close(node.absolutePath);
  }

  convertSourceFilesToTree(sourceFiles: SourceFile[]): FileNode[] {
    if (!sourceFiles || sourceFiles.length === 0) {
      return [];
    }
    // Everything is assumed to be an absolute path starting with "/", removing that slash as it's not needed for path.split
    const paths = sourceFiles.map((sourceFile) => sourceFile.absolutePath.substring(1));
    let result: FileNode[] = [];
    let level = { result };
    paths.forEach((path) => {
      path.split('/').reduce((accumulator, filename) => {
        console.log(filename);
        if (!accumulator[filename]) {
          accumulator[filename] = { result: [] };
          accumulator.result.push({ name: filename, children: accumulator[filename].result, absolutePath: '/' + path });
        }
        return accumulator[filename];
      }, level);
    });
    return result;
  }
}
