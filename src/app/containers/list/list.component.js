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
var tool_lister_1 = require("../../shared/tool-lister");
var ListContainersComponent = (function (_super) {
    __extends(ListContainersComponent, _super);
    function ListContainersComponent(listContainersService, communicatorService, dockstoreService, imageProviderService, dateService, listService, providerService) {
        var _this = _super.call(this, listService, providerService, 'containers') || this;
        _this.listContainersService = listContainersService;
        _this.communicatorService = communicatorService;
        _this.dockstoreService = dockstoreService;
        _this.imageProviderService = imageProviderService;
        _this.dateService = dateService;
        // TODO: make an API endpoint to retrieve only the necessary properties for the containers table
        // name, author, path, registry, gitUrl
        _this.dtOptions = {
            columnDefs: [
                {
                    orderable: false,
                    targets: [2, 3]
                }
            ]
        };
        _this.verifiedLink = _this.dateService.getVerifiedLink();
        return _this;
    }
    ListContainersComponent.prototype.sendToolInfo = function (tool) {
        this.communicatorService.setTool(tool);
    };
    ListContainersComponent.prototype.getFilteredDockerPullCmd = function (path) {
        return this.listContainersService.getDockerPullCmd(path);
    };
    ListContainersComponent.prototype.initToolLister = function () {
        var _this = this;
        this.publishedTools = this.publishedTools.map(function (tool) {
            return _this.imageProviderService.setUpImageProvider(tool);
        });
    };
    ListContainersComponent.prototype.getVerified = function (tool) {
        return this.dockstoreService.getVersionVerified(tool.tags);
    };
    return ListContainersComponent;
}(tool_lister_1.ToolLister));
__decorate([
    core_1.Input()
], ListContainersComponent.prototype, "previewMode", void 0);
ListContainersComponent = __decorate([
    core_1.Component({
        selector: 'app-list-containers',
        templateUrl: './list.component.html'
    })
], ListContainersComponent);
exports.ListContainersComponent = ListContainersComponent;
