import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { SourceFile, VerificationInformation } from '../../swagger';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-verified-display',
  templateUrl: './verified-display.component.html',
  styleUrls: ['./verified-display.component.scss']
})
export class VerifiedDisplayComponent implements OnInit, OnChanges {
  @Input() sourceFiles: SourceFile[];
  public thingythings: Array<any> = new Array();
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['platform', 'metadata', 'path'];
  constructor() {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.sourceFiles.forEach((sourceFile: SourceFile) => {
      const verifiedBySource = sourceFile.verifiedBySource;
      const array = Object.entries(verifiedBySource);
      array.forEach(arrayElement => {
        const platform: string = arrayElement[0];
        const verifiedInformation: VerificationInformation = arrayElement[1];
        const thing = {
          // This allows the string to break after every slash for word-wrapping purposes
          path: sourceFile.path.replace(/\//g, '/' + '\u2028'),
          platform: platform,
          metadata: verifiedInformation.metadata
        };
        this.thingythings.push(thing);
      });
    });
    this.dataSource.data = this.thingythings;
  }

}
