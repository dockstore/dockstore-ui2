import { Workflow } from './../shared/swagger/model/workflow';
import { Configuration } from './../shared/swagger/configuration';
import { SearchService } from './../search/search.service';
import { Observable } from 'rxjs/Observable';
import { Metadata } from './../shared/swagger/model/metadata';
import { Doc } from './../docs/doc.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export class ContainerStubService {
    private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
    copyBtn$ = this.copyBtnSource.asObservable();
    getDescriptors() {
        return null;
    }
    toolCopyBtnClick(copyBtn): void {
    }
    copyBtnSubscript(): void {
    }
}

export class FileStubService { }
export class DocsStubService {
    getDocs(): Doc[] {
        return null;
    }
    getDoc(slug: string): Doc {
        return null;
    }
}

export class GA4GHStubService {
    metadataGet(): Observable<Metadata> {
        const metadata: Metadata = {
            version: '3',
            apiversion: '3',
        };
        return Observable.of(metadata);
    }
}

export class SearchStubService {

}

export class ListContainersStubService {
}

export class TrackLoginStubService {

}

export class LoginStubService {

}

export class AuthStubService {
    getToken() {
        return 'asdf';
    }
}

export class ConfigurationStub {

}

export class UsersServiceStub {
    getUser() {
        return Observable.of({});
    }
    userWorkflows() {
        return Observable.of([]);
    }
}

export class HttpStubService {
    getDockstoreToken() {
        return 'IMAFAKEDOCKSTORETOKEN';
    }
}

export class WorkflowStubService {
    workflows$ = Observable.of([]);
    nsWorkflows$ = Observable.of([]);
    workflow$ = Observable.of({});
    setWorkflow(thing: Workflow) {
    }
    setWorkflows(thing: any) {
    }
    setNsWorkflows(thing: any) {
    }
}

export class RefreshStubService {

}

export class RegisterWorkflowModalStubService {
}


