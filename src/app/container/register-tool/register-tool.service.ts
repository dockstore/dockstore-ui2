import { ContainerService } from './../../shared/container.service';
import { ContainerWebService } from './../../shared/containerWeb.service';
import { Tool } from './tool';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, ViewChild } from '@angular/core';
import { Repository, FriendlyRepositories } from './../../shared/enum/Repository.enum';

@Injectable()
export class RegisterToolService {
    toolRegisterError: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    customDockerRegistryPath: BehaviorSubject<string> = new BehaviorSubject<string>('quay.io');
    private repositories = Repository;
    private friendlyRepositories = FriendlyRepositories;
    showCustomDockerRegistryPath: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private dockerRegistryMap = [];
    refreshingContainer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private tools;


    tool: BehaviorSubject<any> = new BehaviorSubject<Tool>(
        new Tool('GitHub', '', '/Dockerfile',
            '/Dockstore.cwl', '/Dockstore.wdl',
            '/test.cwl.json', '/test.wdl.json',
            'Quay.io', '', false, '', ''));
    constructor(private containerWebService: ContainerWebService, private containerService: ContainerService) {
        this.containerWebService.getDockerRegistryList().subscribe(map => this.dockerRegistryMap = map);
        this.containerService.tools.subscribe(tools => this.tools = tools);
    }

    setTool(newTool: Tool): void {
        this.tool.next(newTool);
    }

    setToolRegisterError(error: any) {
        let errorObj = null;
        if (error) {
            errorObj = {
                message: 'The webservice encountered an error trying to create this ' +
                'tool, please ensure that the tool attributes are ' +
                'valid and the same image has not already been registered.',
                errorDetails: '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
                error._body
            };
        }
        this.toolRegisterError.next(errorObj);
    }

    registerTool(newTool: Tool, customDockerRegistryPath) {
        this.setTool(newTool);
        const normalizedToolObj = this.getNormalizedToolObj(newTool, customDockerRegistryPath);
        this.containerWebService.postRegisterManual(normalizedToolObj).subscribe(response => {
            this.refreshingContainer.next(true);
            this.containerWebService.getContainerRefresh(response.id).subscribe(refreshResponse => {
                (<any>$('#registerContainerModal')).modal('toggle');
                this.containerService.addToTools(this.tools, refreshResponse);
                this.containerService.setTool(refreshResponse);
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
    };

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
    };

    createPath(toolObj: Tool, customDockerRegistryPath) {
        let path = '';
        if (customDockerRegistryPath !== null) {
            path += customDockerRegistryPath;
        } else {
            path += this.getImageRegistryPath(toolObj.irProvider);
        }
        path += '/' + this.getImagePath(toolObj.imagePath, 'namespace') + '/' + this.getImagePath(toolObj.imagePath, 'name');
        return path;
    };

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
    };

    getImageRegistryPath(irProvider): string {
        let foundEnum;
        this.dockerRegistryMap.forEach(element => {
            if (irProvider === element.friendlyName) {
                foundEnum = element.dockerPath;
            }
        });
        return foundEnum;
    };

    getToolRegistry(irProvider): string {
        let foundEnum;
        this.dockerRegistryMap.forEach(element => {
            if (irProvider === element.friendlyName) {
                foundEnum = element.enum;
            }
        });
        return foundEnum;
    };

    registryKeys(): Array<string> {
        return this.dockerRegistryMap.map(a => a.enum);
    }

    getNormalizedToolObj(toolObj: Tool, customDockerRegistryPath: string) {
        const normToolObj = {
            mode: 'MANUAL_IMAGE_PATH',
            name: this.getImagePath(toolObj.imagePath, 'name'),
            toolname: toolObj.toolname,
            namespace: this.getImagePath(toolObj.imagePath, 'namespace'),
            registry: this.getToolRegistry(toolObj.irProvider),
            gitUrl: this.getGitUrl(toolObj.gitPath, toolObj.scrProvider),
            default_dockerfile_path: toolObj.default_dockerfile_path,
            default_cwl_path: toolObj.default_cwl_path,
            default_wdl_path: toolObj.default_wdl_path,
            default_cwl_test_parameter_file: toolObj.default_cwl_test_parameter_file,
            default_wdl_test_parameter_file: toolObj.default_wdl_test_parameter_file,
            is_published: false,
            private_access: toolObj.private_access,
            tool_maintainer_email: toolObj.tool_maintainer_email,
            path: this.createPath(toolObj, customDockerRegistryPath)
        };
        if (normToolObj.toolname === normToolObj.name || normToolObj.toolname === '') {
            delete normToolObj.toolname;
        }
        return normToolObj;
    };

    repositoryKeys(): Array<string> {
        const keys = Object.keys(this.repositories);
        return keys.slice(keys.length / 2);
    }

    friendlyRegistryKeys(): Array<string> {
        if (this.dockerRegistryMap) {
            return this.dockerRegistryMap.map((a) => { return a.friendlyName; });
        }
    }

    friendlyRepositoryKeys(): Array<string> {
        const keys = Object.keys(this.friendlyRepositories);
        return keys.slice(keys.length / 2);
    }

    getFriendlyRepositoryName(repository: Repository): string {
        switch (repository) {
            case Repository.GITHUB:
                return 'Quay.io';
            case Repository.BITBUCKET:
                return 'Docker Hub';
            case Repository.GITLAB:
                return 'GitLab';
            default:
                return '';
        }
    }
}
