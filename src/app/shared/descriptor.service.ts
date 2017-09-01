import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class DescriptorService {

    constructor() { }
    protected type: string;
    protected abstract getSecondaryWdl(id: number, versionName: string);
    protected abstract getWdl(id: number, versionName: string);
    protected abstract getSecondaryCwl(id: number, versionName: string);
    protected abstract getCwl(id: number, versionName: string);
    getFiles(id: number, versionName: string, descriptor: string, type: string) {
        let observable;
        this.type = type;
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
}
