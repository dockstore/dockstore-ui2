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

import { DockstoreTool } from './../shared/swagger/model/dockstoreTool';
import { SourceFile } from './../shared/swagger/model/sourceFile';
import { Token } from './../shared/swagger/model/token';
import { Workflow } from './../shared/swagger/model/workflow';

export const updatedWorkflow: Workflow = {
    'descriptorType': 'cwl',
    'gitUrl': 'updatedGitUrl',
    'mode': Workflow.ModeEnum.FULL,
    'organization': 'updatedOrganization',
    'repository': 'updatedRepository',
    'workflow_path': 'updatedWorkflowPath',
    'workflowVersions': [],
    'defaultTestParameterFilePath': 'updatedTestParameterPath',
    'sourceControl': Workflow.SourceControlEnum.GITHUB
};

export const sampleWorkflow1: Workflow = {
    id: 1,
    'descriptorType': 'cwl',
    'gitUrl': 'updatedGitUrl',
    'mode': Workflow.ModeEnum.FULL,
    'organization': 'updatedOrganization',
    'repository': 'updatedRepository',
    'workflow_path': 'updatedWorkflowPath',
    'workflowVersions': [],
    'defaultTestParameterFilePath': 'updatedTestParameterPath',
    'sourceControl': Workflow.SourceControlEnum.GITHUB
};

export const sampleWorkflow2: Workflow = {
    id: 2,
    'descriptorType': 'cwl',
    'gitUrl': 'updatedGitUrl',
    'mode': Workflow.ModeEnum.FULL,
    'organization': 'updatedOrganization',
    'repository': 'updatedRepository',
    'workflow_path': 'updatedWorkflowPath',
    'workflowVersions': [],
    'defaultTestParameterFilePath': 'updatedTestParameterPath',
    'sourceControl': Workflow.SourceControlEnum.GITHUB
};

export const sampleWorkflow3: Workflow = {
    id: 3,
    'descriptorType': 'cwl',
    'gitUrl': 'sampleGitUrl',
    'mode': Workflow.ModeEnum.FULL,
    'organization': 'sampleOrganization',
    'repository': 'sampleRepository',
    'workflow_path': 'sampleWorkflowPath',
    'workflowVersions': [],
    'defaultTestParameterFilePath': 'updatedTestParameterPath',
    'sourceControl': Workflow.SourceControlEnum.GITHUB
};

export const sampleTool1: DockstoreTool = {
    id: 1,
    default_cwl_path: 'sampleDefaultCWLPath',
    default_dockerfile_path: 'sampleDefaultDockerfilePath',
    default_wdl_path: 'sampleDefaultWDLPath',
    gitUrl: 'sampleGitUrl',
    mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
    name: 'sampleName',
    namespace: 'sampleNamespace',
    private_access: false,
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: 'sampleToolname',
    defaultCWLTestParameterFile: 'sampleDefaultCWLTestParameterFile',
    defaultWDLTestParameterFile: 'sampleDefaultWDLTestParameterFile'
};

export const sampleTool2: DockstoreTool = {
    id: 2,
    default_cwl_path: 'sampleDefaultCWLPath',
    default_dockerfile_path: 'sampleDefaultDockerfilePath',
    default_wdl_path: 'sampleDefaultWDLPath',
    gitUrl: 'sampleGitUrl',
    mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
    name: 'sampleName',
    namespace: 'sampleNamespace',
    private_access: false,
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: 'sampleToolname',
    defaultCWLTestParameterFile: 'sampleDefaultCWLTestParameterFile',
    defaultWDLTestParameterFile: 'sampleDefaultWDLTestParameterFile'
};

export const sampleTool3: DockstoreTool = {
    id: 3,
    default_cwl_path: 'sampleDefaultCWLPath',
    default_dockerfile_path: 'sampleDefaultDockerfilePath',
    default_wdl_path: 'sampleDefaultWDLPath',
    gitUrl: 'sampleGitUrl',
    mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
    name: 'sampleName',
    namespace: 'sampleNamespace',
    private_access: false,
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: 'sampleToolname',
    defaultCWLTestParameterFile: 'sampleDefaultCWLTestParameterFile',
    defaultWDLTestParameterFile: 'sampleDefaultWDLTestParameterFile'
};

export const gitLabToken: Token = {
    'id': 4,
    'tokenSource': 'gitlab.com',
    'content': 'fakeGitLabToken',
    'username': 'garyluu',
    'refreshToken': null,
    'userId': 2,
};

export const gitHubToken: Token = {
    'id': 3,
    'tokenSource': 'github.com',
    'content': 'fakeGitHubToken',
    'username': 'garyluu',
    'refreshToken': null,
    'userId': 2,
};

export const bitbucketToken: Token = {
    'id': 2,
    'tokenSource': 'bitbucket.org',
    'content': 'fakeBitbucketToken',
    'username': 'garyluu',
    'refreshToken': null,
    'userId': 2,
};

export const quayToken: Token = {
    'id': 1,
    'tokenSource': 'quay.io',
    'content': 'fakeQuayToken',
    'username': 'garyluu',
    'refreshToken': null,
    'userId': 2,
};

/**
 * Near identical to the production 'quay.io/wtsicgp/dockstore-cgpmap/cgpmap-cramOut' tool but with many versions and dates removed
 */
export const realTool = {
    'id': 5064,
    'author': 'Keiran Raine',
    'description': 'fakeDescription',
    'labels': [

    ],
    'users': [
        {
            'id': 5991,
            'username': 'keiranmraine',
            'isAdmin': false,
            'company': 'Cancer Genome Project, Wellcome Trust, Sanger Institute',
            'bio': 'Principal Bioinformatician in the Cancer Genome Project IT group @cancerit.',
            'location': 'Letchworth Garden City, UK',
            'email': null,
            'avatarUrl': 'https:\/\/avatars1.githubusercontent.com\/u\/3740323?v=4',
            'name': 'keiranmraine'
        }
    ],
    'starredUsers': [

    ],
    'email': 'keiranmraine@gmail.com',
    'defaultVersion': '3.0.0-rc8',
    'gitUrl': 'git@github.com:cancerit\/dockstore-cgpmap.git',
    'mode': DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    'name': 'dockstore-cgpmap',
    'toolname': 'cgpmap-cramOut',
    'namespace': 'wtsicgp',
    'registry': DockstoreTool.RegistryEnum.QUAYIO,
    'tags': [
        {
            'id': 10839,
            'reference': '3.0.0-rc8',
            'sourceFiles': [
                {
                    'id': 2422302,
                    'type': SourceFile.TypeEnum.DOCKERFILE,
                    'content': 'fakeContent',
                    'path': '\/Dockerfile'
                },
                {
                    'id': 2422252,
                    'type': SourceFile.TypeEnum.DOCKSTORECWL,
                    'content': 'fakeContent',
                    'path': '\/cwls\/cgpmap-cramOut.cwl'
                }
            ],
            'hidden': false,
            'valid': true,
            'name': '3.0.0-rc8',
            'dirtyBit': false,
            'verified': false,
            'verifiedSource': null,
            'size': 138842221,
            'automated': true,
            'workingDirectory': 'cwls',
            'image_id': '9b453c6c70972ada4f8997620d7e03ca7531f1233ac4cf3ae8f9090695ba1d63',
            'dockerfile_path': '\/Dockerfile',
            'cwl_path': '\/cwls\/cgpmap-cramOut.cwl',
            'wdl_path': ''
        }
    ],
    'is_published': true,
    'last_modified': null,
    'default_dockerfile_path': '\/Dockerfile',
    'default_cwl_path': '\/cwls\/cgpmap-cramOut.cwl',
    'default_wdl_path': '',
    'defaultCWLTestParameterFile': '\/examples\/cramOut\/fastq_gz_input.json',
    'defaultWDLTestParameterFile': '',
    'tool_maintainer_email': '',
    'private_access': false,
    'path': 'quay.io\/wtsicgp\/dockstore-cgpmap',
    'tool_path': 'quay.io\/wtsicgp\/dockstore-cgpmap\/cgpmap-cramOut'
};

/**
 * Near identical to the production 'quay.io/wtsicgp/dockstore-cgpmap/cgpmap-cramOut' tool but with dates removed
 */
export const realTag = {
    'id': 10839,
    'reference': '3.0.0-rc8',
    'sourceFiles': [
        {
            'id': 2422302,
            'type': SourceFile.TypeEnum.DOCKERFILE,
            'content': 'fakeContent',
            'path': '\/Dockerfile'
        },
        {
            'id': 2422252,
            'type': SourceFile.TypeEnum.DOCKSTORECWL,
            'content': 'fakeContent',
            'path': '\/cwls\/cgpmap-cramOut.cwl'
        }
    ],
    'hidden': false,
    'valid': true,
    'name': '3.0.0-rc8',
    'dirtyBit': false,
    'verified': false,
    'verifiedSource': null,
    'size': 138842221,
    'automated': true,
    'workingDirectory': 'cwls',
    'image_id': '9b453c6c70972ada4f8997620d7e03ca7531f1233ac4cf3ae8f9090695ba1d63',
    'dockerfile_path': '\/Dockerfile',
    'cwl_path': '\/cwls\/cgpmap-cramOut.cwl',
    'wdl_path': ''
};
