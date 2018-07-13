import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { SourceFile, VerificationInformation } from '../../shared/swagger';
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
  displayedColumns = ['path', 'platform', 'metadata'];
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
          path: sourceFile.path,
          platform: platform,
          metadata: verifiedInformation.metadata
        };
        this.thingythings.push(thing);
      });
    });
    this.dataSource.data = this.thingythings;
  }

}
