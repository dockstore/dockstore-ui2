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
}
