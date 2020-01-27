/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SourceFile, VerificationInformation } from '../../swagger';

@Component({
  selector: 'app-verified-display',
  templateUrl: './verified-display.component.html',
  styleUrls: ['./verified-display.component.scss']
})
export class VerifiedDisplayComponent implements OnInit, OnChanges {
  @Input() sourceFiles: SourceFile[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public dataSource: MatTableDataSource<any>;
  public displayedColumns = ['platform', 'platformVersion', 'path', 'metadata'];
  constructor() {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    // Update the dataSource's data
    this.dataSource.data = this.getCustomVerificationInformationArray(this.sourceFiles);
  }

  /**
   * Extracts the custom verification information object array from the sourcefiles
   *
   * @param {Array<SourceFile>} sourceFiles  The list of sourcefiles from an entry's version
   * @returns {Array<CustomVerificationInformationObject>}   Custom object array (that contains path, verifier, platform)
   * @memberof VerifiedDisplayComponent
   */
  getCustomVerificationInformationArray(sourceFiles: Array<SourceFile>): Array<any> {
    const customVerificationInformationArray: Array<VerificationInformation> = new Array();
    sourceFiles.forEach((sourceFile: SourceFile) => {
      const verifiedBySource = sourceFile.verifiedBySource;
      const verifiedBySourceArray = Object.entries(verifiedBySource);
      verifiedBySourceArray.forEach(arrayElement => {
        const platform: string = arrayElement[0];
        const verifiedInformation: VerificationInformation = arrayElement[1];
        if (verifiedInformation.verified) {
          const customVerificationInformationObject = {
            // This allows the string to break after every slash for word-wrapping purposes
            path: sourceFile.path.replace(/\//g, '/' + '\u2028'),
            platform: platform,
            platformVersion: verifiedInformation.platformVersion ? verifiedInformation.platformVersion : 'N/A',
            metadata: verifiedInformation.metadata
          };
          customVerificationInformationArray.push(customVerificationInformationObject);
        }
      });
    });
    return customVerificationInformationArray;
  }
}
