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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { ContainerService } from '../../shared/container.service';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { HostedService } from '../../shared/swagger/api/hosted.service';
import { MetadataService } from '../../shared/swagger/api/metadata.service';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { ToolQuery } from '../../shared/tool/tool.query';
import { Tool } from './tool';

@Injectable()
export class RegisterToolService {
  toolRegisterError: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  customDockerRegistryPath: BehaviorSubject<string> = new BehaviorSubject<string>('quay.io');
  public showCustomDockerRegistryPath: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public disabledPrivateCheckbox = false;
  private dockerRegistryMap = [];
  private sourceControlMap = [];
  refreshing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tools;
  private selectedTool;
  isModalShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  tool: BehaviorSubject<any> = new BehaviorSubject<Tool>(
    new Tool(
      'GitHub',
      '',
      '/Dockerfile',
      '/Dockstore.cwl',
      '/Dockstore.wdl',
      '/test.cwl.json',
      '/test.wdl.json',
      'Quay.io',
      '',
      false,
      '',
      ''
    )
  );
  constructor(
    private containersService: ContainersService,
    private matSnackBar: MatSnackBar,
    private containerService: ContainerService,
    private alertService: AlertService,
    private router: Router,
    private metadataService: MetadataService,
    private hostedService: HostedService,
    private toolQuery: ToolQuery
  ) {
    this.metadataService.getDockerRegistries().subscribe(map => (this.dockerRegistryMap = map));
    this.metadataService.getSourceControlList().subscribe(map => (this.sourceControlMap = map));
    this.containerService.tools$.subscribe(tools => (this.tools = tools));
    this.toolQuery.tool$.subscribe(tool => (this.selectedTool = tool));
  }
  deregisterTool() {
    this.containersService.deleteContainer(this.selectedTool.id).subscribe(
      response => {
        const newTools: Array<DockstoreTool> = this.tools.filter((tool: DockstoreTool) => tool.id !== this.selectedTool.id);
        const found = newTools.find(
          (tool: DockstoreTool) =>
            tool.registry_string === this.selectedTool.registry_string && tool.namespace === this.selectedTool.namespace
        );
        if (found) {
          this.router.navigateByUrl('/my-tools/' + found.tool_path);
        } else {
          this.containerService.setTool(null);
        }
        this.containerService.setTools(newTools);
      },
      error => {
        this.matSnackBar.open('Encountered problems deleting tool', 'Dismiss');
      }
    );
  }
  setTool(newTool: Tool): void {
    this.tool.next(newTool);
  }

  setIsModalShown(isModalShown: boolean) {
    this.isModalShown.next(isModalShown);
  }

  registerTool(newTool: Tool, customDockerRegistryPath) {
    this.setTool(newTool);
    this.alertService.start('Registering new tool');
    const normalizedToolObj: DockstoreTool = this.getNormalizedToolObj(newTool, customDockerRegistryPath);
    this.containersService.registerManual(normalizedToolObj).subscribe(
      (registeredDockstoreTool: DockstoreTool) => {
        this.containersService
          .refresh(registeredDockstoreTool.id)
          .pipe(finalize(() => {}))
          .subscribe(
            (refreshedDockstoreTool: DockstoreTool) => {
              this.setIsModalShown(false);
              this.alertService.detailedSuccess();
              this.containerService.addToTools(this.tools, refreshedDockstoreTool);
              this.containerService.setTool(refreshedDockstoreTool);
              this.router.navigateByUrl('/my-tools' + '/' + refreshedDockstoreTool.tool_path);
            },
            (error: HttpErrorResponse) => this.alertService.detailedError(error)
          );
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  /**
   * Registers a hosted tool
   * @param {any}  hostedTool hosted tool object
   */
  registerHostedTool(hostedTool: any): void {
    const splitPath = hostedTool.path.split('/');
    const namespace = splitPath[0];
    const name = splitPath[1];
    this.alertService.start('Registering tool');
    this.hostedService
      .createHostedTool(name, hostedTool.registry, undefined, namespace, hostedTool.entryName ? hostedTool.entryName : undefined)
      .subscribe(
        (result: DockstoreTool) => {
          this.alertService.detailedSuccess();
          this.setIsModalShown(false);
          this.containerService.addToTools(this.tools, result);
          this.containerService.setTool(result);
          this.router.navigateByUrl('/my-tools' + '/' + result.tool_path);
        },
        error => {
          this.alertService.detailedError(error);
        }
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
      imageName = part !== 'name' ? matchObj[1] : matchObj[4];
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

  checkForSpecialDockerRegistry(toolObj: Tool): void {
    for (const registry of this.dockerRegistryMap) {
      if (toolObj.irProvider === registry.friendlyName) {
        if (registry.privateOnly === 'true') {
          toolObj.private_access = true;
          this.disabledPrivateCheckbox = true;
        } else {
          this.disabledPrivateCheckbox = false;
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
        if (irProvider === 'Amazon ECR' || irProvider === 'Seven Bridges') {
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
      return this.dockerRegistryMap.map(a => a.friendlyName);
    }
  }

  friendlyRepositoryKeys(): Array<string> {
    if (this.sourceControlMap) {
      return this.sourceControlMap.map(a => a.friendlyName);
    }
  }
}
