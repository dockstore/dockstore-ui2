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
var file_selector_1 = require("../../shared/selectors/file-selector");
var ParamfilesComponent = (function (_super) {
    __extends(ParamfilesComponent, _super);
    function ParamfilesComponent(containerService, highlightJsService, paramfilesService, fileService, elementRef) {
        var _this = _super.call(this) || this;
        _this.containerService = containerService;
        _this.highlightJsService = highlightJsService;
        _this.paramfilesService = paramfilesService;
        _this.fileService = fileService;
        _this.elementRef = elementRef;
        return _this;
    }
    ParamfilesComponent.prototype.getDescriptors = function (version) {
        return this.paramfilesService.getDescriptors(this.currentVersion);
    };
    ParamfilesComponent.prototype.getFiles = function (descriptor) {
        return this.paramfilesService.getFiles(this.id, 'containers', this.currentVersion.name, this.currentDescriptor);
    };
    ParamfilesComponent.prototype.reactToFile = function () {
        this.content = this.fileService.highlightCode(this.currentFile.content);
        this.contentHighlighted = true;
    };
    ParamfilesComponent.prototype.ngAfterViewChecked = function () {
        if (this.contentHighlighted) {
            this.contentHighlighted = false;
            this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
        }
    };
    return ParamfilesComponent;
}(file_selector_1.FileSelector));
__decorate([
    core_1.Input()
], ParamfilesComponent.prototype, "id", void 0);
ParamfilesComponent = __decorate([
    core_1.Component({
        selector: 'app-paramfiles-container',
        templateUrl: './paramfiles.component.html'
    })
], ParamfilesComponent);
exports.ParamfilesComponent = ParamfilesComponent;
