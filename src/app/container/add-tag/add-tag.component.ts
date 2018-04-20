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

import { ContainersService } from '../../shared/swagger';
import { Tag } from './../../shared/swagger/model/tag';
import { ContainertagsService } from './../../shared/swagger/api/containertags.service';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ContainerService } from './../../shared/container.service';
import { ParamfilesService } from './../paramfiles/paramfiles.service';
import { formErrors, validationMessages, validationDescriptorPatterns } from './../../shared/validationMessages.model';
import { DescriptorType } from '../../shared/enum/descriptorType.enum';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.css']
})
export class AddTagComponent implements OnInit, AfterViewChecked {
  addTagForm: NgForm;
  @ViewChild('addTagForm') currentForm: NgForm;
  public DescriptorType = DescriptorType;
  public tool;
  public formErrors = formErrors;
  public validationPatterns = validationDescriptorPatterns;
  public trackByIndex;
  editMode = true;
  unsavedVersion: Tag;
  unsavedTestCWLFile = '';
  unsavedTestWDLFile = '';
  unsavedCWLTestParameterFilePaths = [];
  unsavedWDLTestParameterFilePaths = [];
  constructor(private containerService: ContainerService, private containertagsService: ContainertagsService,
    private containersService: ContainersService, private paramFilesService: ParamfilesService) {
  }

  initializeTag() {
    this.unsavedVersion = {
      'name': '',
      'reference': '',
      'image_id': '',
      'dockerfile_path': '',
      'cwl_path': '',
      'wdl_path': '',
      'hidden': false,
      'automated': false,
      'dirtyBit': false,
      'verified': false,
      'verifiedSource': null,
      'size': 0
    };
    this.unsavedCWLTestParameterFilePaths = [];
    this.unsavedWDLTestParameterFilePaths = [];
  }

  loadDefaults() {
    if (this.tool) {
      this.unsavedVersion.cwl_path = this.tool.default_cwl_path;
      this.unsavedVersion.wdl_path = this.tool.default_wdl_path;
      this.unsavedVersion.dockerfile_path = this.tool.default_dockerfile_path;
      if (this.tool.defaultCWLTestParameterFile) {
        this.unsavedTestCWLFile = this.tool.defaultCWLTestParameterFile;
      }
      if (this.tool.defaultWDLTestParameterFile) {
        this.unsavedTestWDLFile = this.tool.defaultWDLTestParameterFile;
      }
    }
  }

  ngOnInit() {
    this.initializeTag();
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
      this.loadDefaults();
    });
  }

  addTestParameterFile(descriptorType: DescriptorType) {
    switch (descriptorType) {
      case DescriptorType.CWL: {
        const newTestFile = this.unsavedTestCWLFile;
        this.unsavedCWLTestParameterFilePaths.push(newTestFile);
        this.unsavedTestCWLFile = '';
        break;
      }
      case DescriptorType.WDL: {
        const newTestFile = this.unsavedTestWDLFile;
        this.unsavedWDLTestParameterFilePaths.push(newTestFile);
        this.unsavedTestWDLFile = '';
        break;
      }
      default: {
        console.log('No idea how you submitted in neither edit or add mode');
      }
    }
  }

  removeTestParameterFile(index: number, descriptorType: DescriptorType) {
    switch (descriptorType) {
      case DescriptorType.CWL: {
        this.unsavedCWLTestParameterFilePaths.splice(index, 1);
        break;
      }
      case DescriptorType.WDL: {
        this.unsavedWDLTestParameterFilePaths.splice(index, 1);
        break;
      }
      default: {
        console.log('No idea how you submitted in neither edit or add mode');
      }
    }
  }

  addTag() {
    this.containertagsService.addTags(this.tool.id, [this.unsavedVersion]).subscribe(response => {
      this.tool.tags = response;
      const id = this.tool.id;
      const tagName = this.unsavedVersion.name;
      // Store the unsaved test files if valid and exist
      if (this.unsavedTestCWLFile.length > 0) {
        this.addTestParameterFile(DescriptorType.CWL);
      }
      if (this.unsavedTestWDLFile.length > 0) {
        this.addTestParameterFile(DescriptorType.WDL);
      }

      this.containersService.addTestParameterFiles(id, this.unsavedCWLTestParameterFilePaths, 'CWL', null, tagName).subscribe();
      this.containersService.addTestParameterFiles(id, this.unsavedWDLTestParameterFilePaths, 'WDL', null, tagName).subscribe();
      this.containerService.setTool(this.tool);
      this.initializeTag();
      this.loadDefaults();
    }, error => console.log(error));
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.addTagForm) { return; }
    this.addTagForm = this.currentForm;
    if (this.addTagForm) {
      this.addTagForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.addTagForm) { return; }
    const form = this.addTagForm.form;
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  // Validation ends here
  // Checks if the currently edited test parameter file already exists
  // TODO: This code is repeated in version-modal.component.ts for tools, move it somewhere common
  hasDuplicateTestJson(type) {
    if (type === 'cwl') {
      if (this.unsavedCWLTestParameterFilePaths.includes(this.unsavedTestCWLFile)) {
        return true;
      } else {
        return false;
      }
    } else if (type === 'wdl') {
      if (this.unsavedWDLTestParameterFilePaths.includes(this.unsavedTestWDLFile)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
