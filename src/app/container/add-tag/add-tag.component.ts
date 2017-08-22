import { Tag } from './../../shared/swagger/model/tag';
import { ContainertagsService } from './../../shared/swagger/api/containertags.service';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ContainerService } from './../../shared/container.service';
import { ParamfilesService } from './../paramfiles/paramfiles.service';
import { formErrors, validationMessages, validationPatterns } from './../../shared/validationMessages.model';
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
  public validationPatterns = validationPatterns;
  editMode = true;
  unsavedVersion: Tag = {
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
  unsavedTestCWLFile = '';
  unsavedTestWDLFile = '';
  unsavedCWLTestParameterFilePaths = [];
  unsavedWDLTestParameterFilePaths = [];
  constructor(private containerService: ContainerService, private containertagsService: ContainertagsService,
    private paramFilesService: ParamfilesService) {
  }

  ngOnInit() {
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
      if (this.tool) {
        this.unsavedVersion.cwl_path = this.tool.default_cwl_path;
        this.unsavedVersion.wdl_path = this.tool.default_wdl_path;
        this.unsavedVersion.dockerfile_path = this.tool.default_dockerfile_path;
      }
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
      console.log(response);
      this.tool.tags = response;
      this.paramFilesService.putFiles(this.tool.id, this.unsavedCWLTestParameterFilePaths, this.unsavedVersion.name, 'CWL').subscribe();
      this.paramFilesService.putFiles(this.tool.id, this.unsavedWDLTestParameterFilePaths, this.unsavedVersion.name, 'WDL').subscribe();
      this.containerService.setTool(this.tool);
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
}
