import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class InfoTabService {
    public dockerFileEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public cwlPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public wdlPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor() { }
    setDockerFileEditing(editing: boolean) {
        this.dockerFileEditing$.next(editing);
    }

    setCWLPathEditing(editing: boolean) {
        this.cwlPathEditing$.next(editing);
    }

    setWDLPathEditing(editing: boolean) {
        this.wdlPathEditing$.next(editing);
    }
}
