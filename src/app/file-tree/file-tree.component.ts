import { Component, Inject } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SourceFile } from 'app/shared/swagger';

/** File node data with possible child nodes. */
export interface FileNode {
  name: string;
  children?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  level: number;
  expandable: boolean;
}

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: SourceFile[]) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.convertSourceFilesToTree(data);
  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number): FlatTreeNode {
    return {
      name: node.name,
      level,
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
    console.log(node.name);
  }

  private convertSourceFilesToTree(sourceFiles: SourceFile[]): FileNode[] {
    const paths = sourceFiles.map((sourceFile) => sourceFile.absolutePath);
    let result = [];
    let level = { result };
    paths.forEach((path) => {
      path.split('/').reduce((r, name, i, a) => {
        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({ name, children: r[name].result });
        }

        return r[name];
      }, level);
    });
    return result;
  }
}
