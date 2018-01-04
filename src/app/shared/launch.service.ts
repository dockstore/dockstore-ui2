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

import { Injectable } from '@angular/core';

@Injectable()
export abstract class LaunchService {
    protected static readonly descriptorWdl = ' --descriptor wdl';
    constructor() { }
    abstract getParamsString(path: string, versionName: string, currentDescriptor: string);
    abstract getCliString(path: string, versionName: string, currentDescriptor: string);
    abstract getCwlString(path: string, versionName: string);
    getConsonanceString(path: string, versionName: string) {
        return `$ consonance run --tool-dockstore-id ${path}:${versionName} ` +
            '--run-descriptor Dockstore.json --flavour \<AWS instance-type\>';
    }

    /**
     * This creates the Dockstore-supported cwltool launch command
     * @param path The GA4GH Tool's path
     * @param versionName The ToolVersion's name
     */
    getDockstoreSupportedCwlLaunchString(path: string, versionName: string) {
        return `$ cwltool --non-strict ${path}:${versionName} Dockstore.json`;
    }

    /**
     * This creates the Dockstore-supported cwltool make-template command
     * @param path The GA4GH Tool's path
     * @param versionName The ToolVersion's name
     */
    getDockstoreSupportedCwlMakeTemplateString(path: string, versionName: string) {
        return `$ cwltool --make-template ${path}:${versionName} > input.yaml`;
    }
}
