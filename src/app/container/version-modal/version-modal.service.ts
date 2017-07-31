import { ToolVersion } from './../../shared/swagger/model/toolVersion';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';

@Injectable()
export class VersionModalService {
    mode: Subject<TagEditorMode> = new BehaviorSubject<TagEditorMode>(null);
    unsavedTestCWLFile: Subject<string> = new BehaviorSubject<string>('');
    unsavedTestWDLFile: Subject<string> = new BehaviorSubject<string>('');
    isModalShown: Subject<boolean> = new BehaviorSubject<boolean>(false);
    version: Subject<ToolVersion> = new BehaviorSubject<ToolVersion>(null);
    public setCurrentMode(mode: TagEditorMode): void {
        this.mode.next(mode);
    }

    public setIsModalShown(isModalShown: boolean) {
        this.isModalShown.next(isModalShown);
    }

    public setVersion(version: ToolVersion) {
        this.version.next(version);
    }

    public setCurrentUnsavedTestWDLFile(file: string): void {
        this.unsavedTestWDLFile.next(file);
    }

    public setCurrentUnsavedTestCWLFile(file: string): void {
        this.unsavedTestCWLFile.next(file);
    }

    getSizeString(size: number) {
        let sizeStr = '';

        if (size) {
            const exp = Math.log(size) / Math.log(2);
            if (exp < 10) {
                sizeStr = size.toFixed(2) + ' bytes';
            } else if (exp < 20) {
                sizeStr = (size / Math.pow(2, 10)).toFixed(2) + ' kB';
            } else if (exp < 30) {
                sizeStr = (size / Math.pow(2, 20)).toFixed(2) + ' MB';
            } else if (exp < 40) {
                sizeStr = (size / Math.pow(2, 30)).toFixed(2) + ' GB';
            }
        }

        return sizeStr;
    }
    constructor() { }
}
