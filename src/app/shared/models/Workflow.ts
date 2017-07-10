import { Label } from './Label';
import { User } from './User';
import { WorkflowVersion } from './WorkflowVersion';

export class Workflow {
    id: number;
    author: string;
    description: string;
    email: string;
    defaultVersion: string;
    lastUpdated: string;
    gitUrl: string;
    mode: string;
    workflowName: string;
    organization: string;
    repository: string;
    path: string;
    descriptorType: string;
    is_published: boolean;
    last_modified: number;
    workflow_path: string;

    labels: Label[];
    users: User[];
    starredUsers: User[];
    workflowVersions: WorkflowVersion[];
}
