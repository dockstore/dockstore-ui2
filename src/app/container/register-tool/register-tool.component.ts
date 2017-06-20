import { RegisterToolService } from './register-tool.service';
import { Component, OnInit } from '@angular/core';
import { validationMessages, formErrors } from '../../shared/validationMessages.model';
import { Repository } from './../../shared/enum/Repository.enum';
import { Registry, FriendlyRegistry } from './../../shared/enum/Registry.enum';

@Component({
  selector: 'app-register-tool',
  templateUrl: './register-tool.component.html',
  styleUrls: ['./register-tool.component.css'],
  providers: [RegisterToolService]
})
export class RegisterToolComponent implements OnInit {
  private toolRegisterError: boolean;
  private tool: any;
  private formErrors = formErrors;

  constructor(private registerToolService: RegisterToolService) { }

  isInvalidCustomRegistry() {
    this.registerToolService.isInvalidCustomRegistry();
  }

  repositoryKeys(): Array<string> {
    return this.registerToolService.repositoryKeys();
  }

  registryKeys(): Array<string> {
    return this.registerToolService.registryKeys();
  }

  friendlyRegistryKeys(): Array<string> {
    return this.registerToolService.friendlyRegistryKeys();
  }

  friendlyRepositoryKeys(): Array<string> {
    return this.registerToolService.friendlyRepositoryKeys();
  }

  isInvalidPrivateTool() {
    this.registerToolService.isInvalidPrivateTool();
  }

  registerTool() {
    this.registerToolService.registerTool();
  }

  getUnfriendlyRegistryName(registry: string): Registry {
    return this.registerToolService.getUnfriendlyRegistryName(registry);
  }

  getUnfriendlyRepositoryName(repository: Repository): string {
    return this.registerToolService.getFriendlyRepositoryName(repository);
  }

  ngOnInit() {
    this.registerToolService.toolRegisterError.subscribe(toolRegisterError => this.toolRegisterError = toolRegisterError);
    this.registerToolService.tool.subscribe(tool => this.tool = tool);
    console.log(this.tool.srcProvider);
  }
}
