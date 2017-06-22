"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var paramfiles_service_1 = require("./paramfiles.service");
var ParamfilesComponent = (function () {
    function ParamfilesComponent(highlightJsService, containerService, paramFilesService, fileService) {
        this.highlightJsService = highlightJsService;
        this.containerService = containerService;
        this.paramFilesService = paramFilesService;
        this.fileService = fileService;
    }
    ParamfilesComponent.prototype.onVersionChange = function (tagName) {
        this.descriptorTypes = Array.from(this.tagsMap.get(tagName).keys());
        this.onDescriptorChange(this.descriptorTypes[0], tagName);
    };
    ParamfilesComponent.prototype.onDescriptorChange = function (descriptorName, currentTag) {
        // List of files (path, content,etc)
        this.files = this.tagsMap.get(currentTag).get(descriptorName);
        // List of filePath
        this.filePaths = this.files.map(function (file) { return file.path; });
        this.onPathChange(this.filePaths[0]);
    };
    ParamfilesComponent.prototype.onPathChange = function (path) {
        this.content = this.fileService.highlightCode(this.getFile(this.files, path).content);
    };
    ParamfilesComponent.prototype.getFile = function (files, path) {
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (file.path === path) {
                return file;
            }
        }
    };
    ParamfilesComponent.prototype.ngOnInit = function () {
        this.tagsMap = this.paramFilesService.getTagsWithParam(this.toolId, this.validTags);
        if (this.tagsMap.size > 0) {
            this.tagNames = Array.from(this.tagsMap.keys());
            this.onVersionChange(this.tagNames[0]);
        }
    };
    return ParamfilesComponent;
}());
__decorate([
    core_1.Input()
], ParamfilesComponent.prototype, "toolId", void 0);
__decorate([
    core_1.Input()
], ParamfilesComponent.prototype, "validTags", void 0);
ParamfilesComponent = __decorate([
    core_1.Component({
        selector: 'app-paramfiles',
        templateUrl: './paramfiles.component.html',
        styleUrls: ['./paramfiles.component.css'],
        providers: [paramfiles_service_1.ParamFilesService]
    })
], ParamfilesComponent);
exports.ParamfilesComponent = ParamfilesComponent;
