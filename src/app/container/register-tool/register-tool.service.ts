import { ContainerWebService } from './../../shared/containerWeb.service';
import { Tool } from './tool';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Repository, FriendlyRepositories } from './../../shared/enum/Repository.enum';
import { Registry } from './../../shared/enum/Registry.enum';

@Injectable()
export class RegisterToolService {
    toolRegisterError: BehaviorSubject<any> = new BehaviorSubject<boolean>(null);
    customDockerRegistryPath: BehaviorSubject<string> = new BehaviorSubject<string>('quay.io');
    private registries = Registry;
    private repositories = Repository;
    private friendlyRepositories = FriendlyRepositories;
    showCustomDockerRegistryPath: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private dockerRegistryMap;

    tool: BehaviorSubject<any> = new BehaviorSubject<Tool>(
        new Tool('GitHub', '', '/Dockerfile',
            '/Dockstore.cwl', '/Dockstore.wdl',
            '/test.cwl.json', '/test.wdl.json',
            'Quay.io', '', false, '', ''));
    constructor(private containerWebService: ContainerWebService) {
        this.containerWebService.getDockerRegistryList().subscribe(map => this.dockerRegistryMap = map);
    }

    setTool(newTool: Tool): void {
        this.tool.next(newTool);
    }

    registerTool(newTool: Tool, customDockerRegistryPath) {
        console.log('Registering tool');
        this.setTool(newTool);
        const normalizedToolObj = this.getNormalizedToolObj(newTool, customDockerRegistryPath);
        this.containerWebService.postRegisterManual(normalizedToolObj).subscribe(response => {
            console.log(response);
        });
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
            path += this.getImageRegistryPath(toolObj.irProvider);
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

    getToolRegistry(irProvider) {
        for (let i = 0; i < this.dockerRegistryMap.length; i++) {
          if (irProvider === this.dockerRegistryMap[i].friendlyName) {
            return this.dockerRegistryMap[i].enum;
          }
        }
      };

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

    registryKeys(): Array<string> {
        if (this.dockerRegistryMap) {
            return this.dockerRegistryMap.map((a) => {return a.enum; });
        }
    }

    friendlyRegistryKeys(): Array<string> {
        if (this.dockerRegistryMap) {
            return this.dockerRegistryMap.map((a) => {return a.friendlyName; });
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
