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
var version_selector_1 = require("../../shared/selectors/version-selector");
var DockerfileComponent = (function (_super) {
    __extends(DockerfileComponent, _super);
    function DockerfileComponent(dockerfileService, highlightJsService, fileService, elementRef) {
        var _this = _super.call(this) || this;
        _this.dockerfileService = dockerfileService;
        _this.highlightJsService = highlightJsService;
        _this.fileService = fileService;
        _this.elementRef = elementRef;
        _this.nullContent = false;
        return _this;
    }
    DockerfileComponent.prototype.reactToVersion = function () {
        var _this = this;
        if (this.currentVersion) {
            this.nullContent = false;
            this.dockerfileService.getDockerfile(this.id, this.currentVersion.name)
                .subscribe(function (file) {
                _this.content = _this.fileService.highlightCode(file.content);
                _this.contentHighlighted = true;
            });
        }
        else {
            this.nullContent = true;
        }
    };
    DockerfileComponent.prototype.ngAfterViewChecked = function () {
        if (this.contentHighlighted) {
            this.contentHighlighted = false;
            this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
        }
    };
    return DockerfileComponent;
}(version_selector_1.VersionSelector));
__decorate([
    core_1.Input()
], DockerfileComponent.prototype, "id", void 0);
DockerfileComponent = __decorate([
    core_1.Component({
        selector: 'app-dockerfile',
        templateUrl: './dockerfile.component.html',
    })
], DockerfileComponent);
exports.DockerfileComponent = DockerfileComponent;
