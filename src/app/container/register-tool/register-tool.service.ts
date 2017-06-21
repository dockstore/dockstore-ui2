import { Tool } from './tool';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Repository, FriendlyRepositories } from './../../shared/enum/Repository.enum';
import { Registry } from './../../shared/enum/Registry.enum';

@Injectable()
export class RegisterToolService {
    toolRegisterError: BehaviorSubject<any> = new BehaviorSubject<boolean>(null);
    customDockerRegistryPath: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private registries = Registry;
    private repositories = Repository;
    private friendlyRepositories = FriendlyRepositories;
    showCustomDockerRegistryPath: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private dockerRegistryMap = [
        {
            'dockerPath': 'quay.io',
            'customDockerPath': 'false',
            'privateOnly': 'false',
            'enum': 'QUAY_IO',
            'friendlyName': 'Quay.io',
            'url': 'https://quay.io/repository/'
        },
        {
            'dockerPath': 'registry.hub.docker.com',
            'customDockerPath': 'false',
            'privateOnly': 'false',
            'enum': 'DOCKER_HUB',
            'friendlyName': 'Docker Hub',
            'url': 'https://hub.docker.com/'
        },
        {
            'dockerPath': 'registry.gitlab.com',
            'customDockerPath': 'false',
            'privateOnly': 'false',
            'enum': 'GITLAB',
            'friendlyName': 'GitLab',
            'url': 'https://gitlab.com/'
        },
        {
            'dockerPath': null,
            'customDockerPath': 'true',
            'privateOnly': 'true',
            'enum': 'AMAZON_ECR',
            'friendlyName': 'Amazon ECR',
            'url': null
        }
    ];
    result = this.dockerRegistryMap.map((a) => {return a.enum; });

    tool: BehaviorSubject<any> = new BehaviorSubject<Tool>(
        new Tool('GitHub', '', '/Dockerfile',
            '/Dockstore.cwl', '/Dockstore.wdl',
            '/test.cwl.json', '/test.wdl.json',
            'Quay.io', '', false, '', ''));
    constructor() { }

    setTool(newTool: Tool): void {
        this.tool.next(newTool);
    }

    registerTool(newTool: Tool) {
        this.setTool(newTool);
    }

    setCustomDockerRegistryPath(newCustomDockerRegistryPath: string): void {
        this.customDockerRegistryPath.next(newCustomDockerRegistryPath);
    }

    setShowCustomDockerRegistryPath(newShowCustomDockerRegistoryPath: boolean): void {
        this.showCustomDockerRegistryPath.next(newShowCustomDockerRegistoryPath);
    }

    isInvalidPrivateTool() {
        return false;
    }
    isInvalidCustomRegistry() {
        return false;
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
            path += this.getUnfriendlyRegistryName(toolObj.irProvider);
        }
        path += '/' + this.getImagePath(toolObj.imagePath, 'namespace') + '/' + this.getImagePath(toolObj.imagePath, 'name');
        return path;
    };

    checkForSpecialDockerRegistry(toolObj: Tool) {
        for (let i = 0; i < this.dockerRegistryMap.length; i++) {
            if (toolObj.irProvider === this.dockerRegistryMap[i].friendlyName) {
                if (this.dockerRegistryMap[i].privateOnly === 'true') {
                    toolObj.private_access = true;
                    $('#privateTool').attr('disabled', 'disabled');
                } else {
                    $('#privateTool').removeAttr('disabled');
                }

                if (this.dockerRegistryMap[i].customDockerPath === 'true') {
                    this.setShowCustomDockerRegistryPath(true);
                    this.setCustomDockerRegistryPath(null);
                } else {
                    this.setShowCustomDockerRegistryPath(false);
                    this.setCustomDockerRegistryPath(this.getImageRegistryPath(toolObj.irProvider));
                }
            }
        }
    };

    getImageRegistryPath(irProvider) {
        for (let i = 0; i < this.dockerRegistryMap.length; i++) {
            if (irProvider === this.dockerRegistryMap[i].friendlyName) {
                return this.dockerRegistryMap[i].dockerPath;
            }
        }
    };

    getNormalizedToolObj(toolObj: Tool, customDockerRegistryPath: string) {
        const normToolObj = {
            mode: 'MANUAL_IMAGE_PATH',
            name: this.getImagePath(toolObj.imagePath, 'name'),
            toolname: toolObj.toolname,
            namespace: this.getImagePath(toolObj.imagePath, 'namespace'),
            registry: this.getUnfriendlyRegistryName(toolObj.irProvider),
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
        if (normToolObj.toolname === normToolObj.name) {
            delete normToolObj.toolname;
        }
        return normToolObj;
    };

    repositoryKeys(): Array<string> {
        const keys = Object.keys(this.repositories);
        return keys.slice(keys.length / 2);
    }

    registryKeys(): Array<string> {
        return this.dockerRegistryMap.map((a) => {return a.enum; });
    }

    friendlyRegistryKeys(): Array<string> {
        return this.dockerRegistryMap.map((a) => {return a.friendlyName; });
    }

    friendlyRepositoryKeys(): Array<string> {
        const keys = Object.keys(this.friendlyRepositories);
        return keys.slice(keys.length / 2);
    }

    getUnfriendlyRegistryName(registry: string): Registry {
        switch (registry) {
            case 'Quay.io':
                return Registry.QUAY_IO;
            case 'Docker Hub':
                return Registry.DOCKER_HUB;
            case 'GitLab':
                return Registry.GITLAB;
            case 'Amazon ECR':
                return Registry.AMAZON_ECR;
            default:
                return null;
        }
    }

    getFriendlyRegistryName(registry: string): Registry {
        switch (registry) {
            case 'Quay.io':
                return Registry.QUAY_IO;
            case 'Docker Hub':
                return Registry.DOCKER_HUB;
            case 'GitLab':
                return Registry.GITLAB;
            case 'Amazon ECR':
                return Registry.AMAZON_ECR;
            default:
                return null;
        }
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
