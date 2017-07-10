import { SourceFile } from './SourceFile';

export class WorkflowVersion {
id: number;
reference: string;
hidden: boolean;
valid: boolean;
name: string;
dirtyBit: boolean;
verified: boolean;
verifiedSource: string;
workingDirectory: string;
last_modified: string;
workflow_path: string;
sourceFiles: SourceFile[];
}

