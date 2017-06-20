import { Tool } from './tool';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Repository, FriendlyRepositories } from './../../shared/enum/Repository.enum';
import { Registry, FriendlyRegistry } from './../../shared/enum/Registry.enum';

@Injectable()
export class RegisterToolService {
    toolRegisterError: BehaviorSubject<any> = new BehaviorSubject<boolean>(null);
    private registries = Registry;
    private repositories = Repository;
    private friendlyRegistries = FriendlyRegistry;
    private friendlyRepositories = FriendlyRepositories;
    tool: BehaviorSubject<any> = new BehaviorSubject<Tool>(
        new Tool('GitHub', '', '', '', '', '', '', 'Quay.io', '', false, '', ''));
    constructor() { }

    registerTool() {
        console.log('Registering tool');
    }
    isInvalidPrivateTool() {
        return false;
    }
    isInvalidCustomRegistry() {
        return false;
    }

    repositoryKeys(): Array<string> {
    const keys = Object.keys(this.repositories);
    return keys.slice(keys.length / 2);
  }

  registryKeys(): Array<string> {
    const keys = Object.keys(this.registries);
    return keys.slice(keys.length / 2);
  }

  friendlyRegistryKeys(): Array<string> {
    const keys = Object.keys(this.friendlyRegistries);
    return keys.slice(keys.length / 2);
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
