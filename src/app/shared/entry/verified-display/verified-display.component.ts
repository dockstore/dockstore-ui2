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
import { VersionVerifiedPlatform } from '../../openapi';
import { Tag, VerificationInformation, WorkflowVersion } from '../../swagger';

@Component({
  selector: 'app-verified-display',
  templateUrl: './verified-display.component.html',
  styleUrls: ['./verified-display.component.scss'],
})
export class VerifiedDisplayComponent implements OnInit, OnChanges {
  @Input() verifiedByPlatform: Array<VersionVerifiedPlatform>;
  @Input() version: Tag | WorkflowVersion | null;
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
    this.dataSource.data = this.getCustomVerificationInformationArray(this.version.id, this.verifiedByPlatform);
  }

  /**
   * Extracts the custom verification information object array from the sourcefiles
   *
   * @param {number} versionid The versionid to get verfication information for
   * @param {Array<VersionVerifiedPlatform>} sourceFiles  The list of sourcefiles from an entry's version
   * @returns {Array<CustomVerificationInformationObject>}   Custom object array (that contains path, verifier, platform)
   * @memberof VerifiedDisplayComponent
   */
  getCustomVerificationInformationArray(versionid: number, verifiedByPlatform: Array<VersionVerifiedPlatform>): Array<any> {
    const customVerificationInformationArray: Array<VerificationInformation> = new Array();
    if (versionid && verifiedByPlatform) {
      verifiedByPlatform
        .filter((vs: VersionVerifiedPlatform) => vs.versionId === versionid)
        .forEach((vs) => {
          if (vs.verified) {
            const customVerificationInformationObject = {
              // This allows the string to break after every slash for word-wrapping purposes
              path: vs.path.replace(/\//g, '/' + '\u2028'),
              platform: vs.source,
              platformVersion: vs.platformVersion ? vs.platformVersion : 'N/A',
              metadata: vs.metadata,
            };
            customVerificationInformationArray.push(customVerificationInformationObject);
          }
        });
    }
    return customVerificationInformationArray;
  }
}
