"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var descriptorType_enum_1 = require("../../shared/enum/descriptorType.enum");
var tagEditorMode_enum_1 = require("../../shared/enum/tagEditorMode.enum");
var validationMessages_model_1 = require("../../shared/validationMessages.model");
var view_1 = require("../../shared/view");
var view_service_1 = require("./view.service");
var ViewContainerComponent = (function (_super) {
    __extends(ViewContainerComponent, _super);
    function ViewContainerComponent(paramfilesService, viewService, listContainersService, dateService, communicatorService, containerTagsService) {
        var _this = _super.call(this, dateService) || this;
        _this.paramfilesService = paramfilesService;
        _this.viewService = viewService;
        _this.listContainersService = listContainersService;
        _this.communicatorService = communicatorService;
        _this.containerTagsService = containerTagsService;
        // Enumss
        _this.TagEditorMode = tagEditorMode_enum_1.TagEditorMode;
        _this.DescriptorType = descriptorType_enum_1.DescriptorType;
        _this.editMode = true;
        _this.formErrors = validationMessages_model_1.formErrors;
        return _this;
    }
    // Almost all these functions should be moved to a service
    ViewContainerComponent.prototype.getSizeString = function (size) {
        return this.viewService.getSizeString(size);
    };
    ViewContainerComponent.prototype.onSubmit = function () {
        switch (this.mode) {
            case tagEditorMode_enum_1.TagEditorMode.Add: {
                this.addTag();
                break;
            }
            case tagEditorMode_enum_1.TagEditorMode.Edit: {
                this.editTag();
                break;
            }
            default: {
                console.log('No idea how you submitted in neither edit or add mode');
            }
        }
    };
    ViewContainerComponent.prototype.addTag = function () {
        console.log('Saving tag...');
    };
    ViewContainerComponent.prototype.ngAfterViewChecked = function () {
        this.formChanged();
    };
    ViewContainerComponent.prototype.formChanged = function () {
        var _this = this;
        if (this.currentForm === this.tagEditorForm) {
            return;
        }
        this.tagEditorForm = this.currentForm;
        if (this.tagEditorForm) {
            this.tagEditorForm.valueChanges
                .subscribe(function (data) { return _this.onValueChanged(data); });
        }
    };
    ViewContainerComponent.prototype.onValueChanged = function (data) {
        if (!this.tagEditorForm) {
            return;
        }
        var form = this.tagEditorForm.form;
        for (var field in validationMessages_model_1.formErrors) {
            if (validationMessages_model_1.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                validationMessages_model_1.formErrors[field] = '';
                var control = form.get(field);
                if (control && !control.valid) {
                    var messages = validationMessages_model_1.validationMessages[field];
                    for (var key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            validationMessages_model_1.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    };
    ViewContainerComponent.prototype.editTag = function () {
        var _this = this;
        console.log('Editing tag...');
        var newCWL = this.unsavedCWLTestParameterFilePaths.filter(function (x) { return _this.savedCWLTestParameterFilePaths.indexOf(x) === -1; });
        if (newCWL && newCWL.length > 0) {
            this.paramfilesService.putFiles(this.tool.id, newCWL, this.version.name, 'CWL').subscribe();
        }
        var missingCWL = this.savedCWLTestParameterFilePaths.filter(function (x) { return _this.unsavedCWLTestParameterFilePaths.indexOf(x) === -1; });
        if (missingCWL && missingCWL.length > 0) {
            this.paramfilesService.deleteFiles(this.tool.id, missingCWL, this.version.name, 'CWL').subscribe();
        }
        var newWDL = this.unsavedWDLTestParameterFilePaths.filter(function (x) { return _this.savedWDLTestParameterFilePaths.indexOf(x) === -1; });
        if (newWDL && newWDL.length > 0) {
            this.paramfilesService.putFiles(this.tool.id, newWDL, this.version.name, 'WDL').subscribe();
        }
        var missingWDL = this.savedWDLTestParameterFilePaths.filter(function (x) { return _this.unsavedWDLTestParameterFilePaths.indexOf(x) === -1; });
        if (missingWDL && missingWDL.length > 0) {
            this.paramfilesService.deleteFiles(this.tool.id, missingWDL, this.version.name, 'WDL').subscribe();
        }
        this.containerTagsService.putTags(this.tool.id, this.unsavedVersion).subscribe();
    };
    ViewContainerComponent.prototype.setMode = function (mode) {
        var _this = this;
        console.log('Setting mode to: ' + tagEditorMode_enum_1.TagEditorMode[mode]);
        this.viewService.setCurrentMode(mode);
        this.unsavedCWLTestParameterFilePaths = [];
        this.unsavedWDLTestParameterFilePaths = [];
        this.savedCWLTestParameterFilePaths = [];
        this.savedWDLTestParameterFilePaths = [];
        this.paramfilesService.getFiles(this.tool.id, 'containers', this.version.name, 'CWL').subscribe(function (file) {
            _this.savedCWLTestParameterFiles = file;
            _this.savedCWLTestParameterFiles.forEach(function (fileObject) {
                _this.savedCWLTestParameterFilePaths.push(fileObject.path);
            });
            _this.unsavedCWLTestParameterFilePaths = _this.savedCWLTestParameterFilePaths.slice();
        });
        this.paramfilesService.getFiles(this.tool.id, 'containers', this.version.name, 'WDL').subscribe(function (file) {
            _this.savedWDLTestParameterFiles = file;
            _this.savedWDLTestParameterFiles.forEach(function (fileObject) {
                _this.savedWDLTestParameterFilePaths.push(fileObject.path);
            });
            _this.unsavedWDLTestParameterFilePaths = _this.savedWDLTestParameterFilePaths.slice();
        });
    };
    ViewContainerComponent.prototype.addTestParameterFile = function (descriptorType) {
        switch (descriptorType) {
            case descriptorType_enum_1.DescriptorType.CWL: {
                var newTestFile = this.unsavedTestCWLFile;
                this.unsavedCWLTestParameterFilePaths.push(newTestFile);
                this.unsavedTestCWLFile = '';
                break;
            }
            case descriptorType_enum_1.DescriptorType.WDL: {
                var newTestFile = this.unsavedTestWDLFile;
                this.unsavedWDLTestParameterFilePaths.push(newTestFile);
                this.unsavedTestWDLFile = '';
                break;
            }
            default: {
                console.log('No idea how you submitted in neither edit or add mode');
            }
        }
    };
    ViewContainerComponent.prototype.removeTestParameterFile = function (index, descriptorType) {
        switch (descriptorType) {
            case descriptorType_enum_1.DescriptorType.CWL: {
                this.unsavedCWLTestParameterFilePaths.splice(index, 1);
                break;
            }
            case descriptorType_enum_1.DescriptorType.WDL: {
                this.unsavedWDLTestParameterFilePaths.splice(index, 1);
                break;
            }
            default: {
                console.log('No idea how you submitted in neither edit or add mode');
            }
        }
    };
    ViewContainerComponent.prototype.getFilteredDockerPullCmd = function (path, tagName) {
        if (tagName === void 0) { tagName = ''; }
        return this.listContainersService.getDockerPullCmd(path, tagName);
    };
    ViewContainerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.viewService.mode.subscribe(function (mode) {
            _this.mode = mode;
        });
        this.unsavedVersion = Object.assign({}, this.version);
        this.tool = this.communicatorService.getTool();
        this.viewService.unsavedTestCWLFile.subscribe(function (file) {
            _this.unsavedTestCWLFile = file;
        });
        this.viewService.unsavedTestWDLFile.subscribe(function (file) {
            _this.unsavedTestWDLFile = file;
        });
        this.savedCWLTestParameterFilePaths = [];
        this.savedWDLTestParameterFilePaths = [];
    };
    return ViewContainerComponent;
}(view_1.View));
__decorate([
    core_1.ViewChild('tagEditorForm')
], ViewContainerComponent.prototype, "currentForm", void 0);
ViewContainerComponent = __decorate([
    core_1.Component({
        selector: 'app-view-container',
        templateUrl: './view.component.html',
        styleUrls: ['./view.component.css'],
        providers: [view_service_1.ViewService]
    })
    // This is actually the tag edtior
], ViewContainerComponent);
exports.ViewContainerComponent = ViewContainerComponent;
