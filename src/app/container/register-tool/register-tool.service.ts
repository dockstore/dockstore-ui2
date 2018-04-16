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
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContainerService } from './../../shared/container.service';
import { Repository } from './../../shared/enum/Repository.enum';
import { StateService } from './../../shared/state.service';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { MetadataService } from './../../shared/swagger/api/metadata.service';
import { DockstoreTool } from './../../shared/swagger/model/dockstoreTool';
import { Tool } from './tool';

@Injectable()
export class RegisterToolService {
    toolRegisterError: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    customDockerRegistryPath: BehaviorSubject<string> = new BehaviorSubject<string>('quay.io');
    private repositories = Repository;
    public showCustomDockerRegistryPath: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private dockerRegistryMap = [];
    private sourceControlMap = [];
    refreshing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private tools;
    private selectedTool;
    isModalShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    tool: BehaviorSubject<any> = new BehaviorSubject<Tool>(
        new Tool('GitHub', '', '/Dockerfile',
            '/Dockstore.cwl', '/Dockstore.wdl',
            '/test.cwl.json', '/test.wdl.json',
            'Quay.io', '', false, '', ''));
    constructor(private containersService: ContainersService,
        private containerService: ContainerService,
        private stateService: StateService,
        private metadataService: MetadataService) {
        this.metadataService.getDockerRegistries().subscribe(map => this.dockerRegistryMap = map);
        this.metadataService.getSourceControlList().subscribe(map => this.sourceControlMap = map);
        this.containerService.tools$.subscribe(tools => this.tools = tools);
        this.containerService.tool$.subscribe(tool => this.selectedTool = tool);
    }
    deregisterTool() {
        this.containersService.deleteContainer(this.selectedTool.id).subscribe(response => {
            const index = this.tools.indexOf(this.selectedTool);
            this.tools.splice(index, 1);
            this.containerService.setTools(this.tools);
        }, error => {
            console.log(error);
        });
    }
    setTool(newTool: Tool): void {
        this.tool.next(newTool);
    }

    setIsModalShown(isModalShown: boolean) {
        this.isModalShown.next(isModalShown);
    }

    setToolRegisterError(error: HttpErrorResponse) {
        let errorObj = null;
        if (error) {
          if (error.status === 0) {
            errorObj = { message: 'The webservice is currently down, possibly due to load. Please wait and try again later.', errorDetails: '' }
          } else {
            errorObj = {
                message: 'The webservice encountered an error trying to create this ' +
                'tool, please ensure that the tool attributes are ' +
                'valid and the same image has not already been registered.',
                errorDetails: '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
                error.error
            };
          }
        }
        this.toolRegisterError.next(errorObj);
    }

    registerTool(newTool: Tool, customDockerRegistryPath) {
        this.setTool(newTool);
        const normalizedToolObj: DockstoreTool = this.getNormalizedToolObj(newTool, customDockerRegistryPath);
        this.containersService.registerManual(normalizedToolObj).subscribe(response => {
            this.setToolRegisterError(null);
            this.stateService.setRefreshMessage('Registering new tool...');
            this.containersService.refresh(response.id).subscribe(refreshResponse => {
                this.setIsModalShown(false);
                this.containerService.addToTools(this.tools, refreshResponse);
                this.containerService.setTool(refreshResponse);
                this.stateService.setRefreshMessage(null);
            });
            // Use types instead
        }, error => this.setToolRegisterError(error)
        );
    }

    setCustomDockerRegistryPath(newCustomDockerRegistryPath: string): void {
        this.customDockerRegistryPath.next(newCustomDockerRegistryPath);
    }

    setShowCustomDockerRegistryPath(newShowCustomDockerRegistoryPath: boolean): void {
        this.showCustomDockerRegistryPath.next(newShowCustomDockerRegistoryPath);
    }

    isInvalidPrivateTool(toolObj: Tool) {
        return toolObj.private_access === true && !toolObj.tool_maintainer_email;
    }

    /**
     * Returns true (is invalid) if the customDockerRegistryPath is needed but not truthy
     * Returns false if the customDockerRegistryPath is not needed or is truthy
     * @param {Tool} toolObj
     * @param {string} customDockerRegistryPath
     * @returns {boolean}
     * @memberof RegisterToolService
     */
    isInvalidCustomRegistry(toolObj: Tool, customDockerRegistryPath: string): boolean {
        for (const registry of this.dockerRegistryMap) {
            if (toolObj.irProvider === registry.friendlyName) {
                if (registry.privateOnly === 'true') {
                    if (!customDockerRegistryPath) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    }

    getImagePath(imagePath, part) {
        /** Defines the regex that an image path (namespace/name) must match.
         Group 1 = namespace, Group 2 = name*/
        const imagePathRegexp = /^(([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)|_)\/([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)$/i;
        const matchObj = imagePath.match(imagePathRegexp);
        let imageName = '';
        if (matchObj && matchObj.length > 2) {
            imageName = (part !== 'name') ? matchObj[1] : matchObj[4];
        }
        return imageName;
    }

    getGitUrl(gitPath, scrProvider) {
        let gitUrl = '';
        switch (scrProvider) {
            case 'GitHub':
                gitUrl = 'https://github.com/';
                break;
            case 'GitLab':
                gitUrl = 'https://gitlab.com/';
                break;
            case 'Bitbucket':
            /* falls through */
            default:
                gitUrl = 'https://bitbucket.org/';
        }
        gitUrl += gitPath;
        return gitUrl;
    }

    createPath(toolObj: Tool, customDockerRegistryPath) {
        let path = '';
        if (customDockerRegistryPath !== null) {
            path += customDockerRegistryPath;
        } else {
            path += this.getImageRegistryPath(toolObj.irProvider);
        }
        path += '/' + this.getImagePath(toolObj.imagePath, 'namespace') + '/' + this.getImagePath(toolObj.imagePath, 'name');
        return path;
    }

    checkForSpecialDockerRegistry(toolObj: Tool) {
        for (const registry of this.dockerRegistryMap) {
            if (toolObj.irProvider === registry.friendlyName) {
                if (registry.privateOnly === 'true') {
                    toolObj.private_access = true;
                    $('#privateTool').attr('disabled', 'disabled');
                } else {
                    $('#privateTool').removeAttr('disabled');
                }

                if (registry.customDockerPath === 'true') {
                    this.setShowCustomDockerRegistryPath(true);
                    this.setCustomDockerRegistryPath(null);
                } else {
                    this.setShowCustomDockerRegistryPath(false);
                    this.setCustomDockerRegistryPath(this.getImageRegistryPath(toolObj.irProvider));
                }
            }
        }
    }

    getImageRegistryPath(irProvider): string {
        let foundEnum;
        this.dockerRegistryMap.forEach(element => {
            if (irProvider === element.friendlyName) {
                foundEnum = element.dockerPath;
            }
        });
        return foundEnum;
    }

    getToolRegistry(irProvider, customDockerRegistryPath): string {
        let foundPath;
        this.dockerRegistryMap.forEach(element => {
            if (irProvider === element.friendlyName) {
                if (irProvider === 'Amazon ECR') {
                  foundPath = customDockerRegistryPath;
                } else {
                  foundPath = element.dockerPath;
                }
            }
        });
        return foundPath;
    }

    registryKeys(): Array<string> {
        return this.dockerRegistryMap.map(a => a.enum);
    }

    getNormalizedToolObj(toolObj: Tool, customDockerRegistryPath: string): DockstoreTool {
        const normToolObj: any = {
            mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
            name: this.getImagePath(toolObj.imagePath, 'name'),
            toolname: toolObj.toolname,
            namespace: this.getImagePath(toolObj.imagePath, 'namespace'),
            registry_string: this.getToolRegistry(toolObj.irProvider, customDockerRegistryPath),
            gitUrl: this.getGitUrl(toolObj.gitPath, toolObj.scrProvider),
            default_dockerfile_path: toolObj.default_dockerfile_path,
            default_cwl_path: toolObj.default_cwl_path,
            default_wdl_path: toolObj.default_wdl_path,
            defaultCWLTestParameterFile: toolObj.default_cwl_test_parameter_file,
            defaultWDLTestParameterFile: toolObj.default_wdl_test_parameter_file,
            is_published: false,
            private_access: toolObj.private_access,
            tool_maintainer_email: toolObj.tool_maintainer_email
        };
        if (normToolObj.toolname === normToolObj.name || !normToolObj.toolname) {
            delete normToolObj.toolname;
        }
        return normToolObj;
    }

    friendlyRegistryKeys(): Array<string> {
        if (this.dockerRegistryMap) {
            return this.dockerRegistryMap.map((a) => a.friendlyName);
        }
    }

    friendlyRepositoryKeys(): Array<string> {
        if (this.sourceControlMap) {
            return this.sourceControlMap.map((a) => a.friendlyName);
        }
    }
}
