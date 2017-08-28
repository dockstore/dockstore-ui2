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
    tool$ = Observable.of({});
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
    searchInfo$ = Observable.of({});
    loading$ = Observable.of(false);
    setLoading() {
    }
}

export class ListContainersStubService {
}

export class TrackLoginStubService {
    isLoggedIn$ = Observable.of(true);
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

export class UsersStubService {
    getUser() {
        return Observable.of({});
    }
    userWorkflows() {
        return Observable.of([]);
    }
    getStarredTools() {
        return Observable.of([]);
    }
    getStarredWorkflows() {
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
    copyBtn$ = Observable.of({});
    setWorkflow(thing: Workflow) {
    }
    setWorkflows(thing: any) {
    }
    setNsWorkflows(thing: any) {
    }
    getDescriptors() {

    }
}

export class RefreshStubService {

}

export class RegisterWorkflowModalStubService {
}

export class PageNumberStubService {
}

export class LogoutStubService {
}

export class UserStubService {
    user$ = Observable.of({});
}

export class AdvancedSearchStubService {
    showModal$ = Observable.of(true);
    advancedSearch$ = Observable.of({});
}

export class StarringStubService {
    getStarring(id: any, type: any) {
        return Observable.of({});
    }
}

export class StarEntryStubService {
    starEntry$ = Observable.of({});
}

export class ImageProviderStubService {

}

export class DagStubService {

}

export class DescriptorsStubService {

}

export class ParamFilesStubService {
    getVersions() {
        return Observable.of([]);
    }
    getDescriptors() {
        return Observable.of({});
    }
}

export class DockstoreStubService {
    getIconClass() {

    }
}

export class DateStubService {
    getVerifiedLink() {
        return '/docs/faq#what-is-a-verified-tool-or-workflow-';
    }
}

export class WorkflowsStubService {
}
