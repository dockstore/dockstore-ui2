/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { SourceFile } from './swagger/model/sourceFile';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class DescriptorService {

    constructor() { }
    protected abstract getSecondaryWdl(id: number, versionName: string);
    protected abstract getWdl(id: number, versionName: string);
    protected abstract getSecondaryCwl(id: number, versionName: string);
    protected abstract getCwl(id: number, versionName: string);
    getFiles(id: number, versionName: string, descriptor: string) {
        let observable;
        if (descriptor === 'cwl') {
            observable = this.getCwlFiles(id, versionName);
        } else if (descriptor === 'wdl') {
            observable = this.getWdlFiles(id, versionName);
        }
        return observable.map(filesArray => {
            const files = [];
            files.push(filesArray[0]);
            for (const file of filesArray[1]) {
                files.push(file);
            }
            return files;
        });
    }

    private getCwlFiles(id: number, versionName: string) {
        return Observable.zip(
            this.getCwl(id, versionName),
            this.getSecondaryCwl(id, versionName)
        );
    }

    private getWdlFiles(id: number, versionName: string) {
        return Observable.zip(
            this.getWdl(id, versionName),
            this.getSecondaryWdl(id, versionName)
        );
    }


    /**
     * Gets the descriptor types (cwl and or wdl) that the version has a sourcefile of
     *
     * @param {any} versions all version of the workflow/tool (currently not used be left in here just in case)
     * @param {any} version the current selected version of the workflow or tool
     * @returns an array that may contain 'cwl' or 'wdl'
     * @memberof DescriptorService
     */
    getDescriptors(versions, version) {
        if (version) {
            const descriptorTypes = new Array();
            const unique = new Set(version.sourceFiles.map((sourceFile: SourceFile) => sourceFile.type));
            unique.forEach(element => {
                if (element === SourceFile.TypeEnum.DOCKSTORECWL) {
                    descriptorTypes.push('cwl');
                } else if (element === SourceFile.TypeEnum.DOCKSTOREWDL) {
                    descriptorTypes.push('wdl');
                }
            });
            return descriptorTypes;
        }
    }
}
