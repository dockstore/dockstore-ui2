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
var tool_1 = require("../shared/tool");
var validationMessages_model_1 = require("../shared/validationMessages.model");
var ContainerComponent = (function (_super) {
    __extends(ContainerComponent, _super);
    function ContainerComponent(dockstoreService, dateService, imageProviderService, listContainersService, updateContainer, toolService, communicatorService, providerService, router, workflowService, containerService) {
        var _this = _super.call(this, toolService, communicatorService, providerService, router, workflowService, containerService, 'containers') || this;
        _this.dockstoreService = dockstoreService;
        _this.dateService = dateService;
        _this.imageProviderService = imageProviderService;
        _this.listContainersService = listContainersService;
        _this.updateContainer = updateContainer;
        _this.totalShare = 0;
        _this.labelPattern = validationMessages_model_1.validationPatterns.label;
        return _this;
    }
    ContainerComponent.prototype.setProperties = function () {
        var toolRef = this.tool;
        this.labels = this.dockstoreService.getLabelStrings(this.tool.labels);
        this.dockerPullCmd = this.listContainersService.getDockerPullCmd(this.tool.path);
        this.privateOnlyRegistry = this.imageProviderService.checkPrivateOnlyRegistry(this.tool);
        this.shareURL = window.location.href;
        this.labelsEditMode = false;
        toolRef.agoMessage = this.dateService.getAgoMessage(toolRef.lastBuild);
        toolRef.email = this.dockstoreService.stripMailTo(toolRef.email);
        toolRef.lastBuildDate = this.dateService.getDateTimeMessage(toolRef.lastBuild);
        toolRef.lastUpdatedDate = this.dateService.getDateTimeMessage(toolRef.lastUpdated);
        toolRef.versionVerified = this.dockstoreService.getVersionVerified(toolRef.tags);
        toolRef.verifiedSources = this.dockstoreService.getVerifiedSources(toolRef);
        toolRef.verifiedLinks = this.dateService.getVerifiedLink();
        if (!toolRef.imgProviderUrl) {
            toolRef = this.imageProviderService.setUpImageProvider(toolRef);
        }
        this.resetContainerEditData();
    };
    ContainerComponent.prototype.sumCounts = function (count) {
        console.log(count);
        this.totalShare += count;
    };
    ContainerComponent.prototype.getValidVersions = function () {
        this.validVersions = this.dockstoreService.getValidVersions(this.tool.tags);
    };
    ContainerComponent.prototype.toggleLabelsEditMode = function () {
        this.labelsEditMode = !this.labelsEditMode;
    };
    ContainerComponent.prototype.resetContainerEditData = function () {
        var labelArray = this.dockstoreService.getLabelStrings(this.tool.labels);
        var toolLabels = labelArray.join(', ');
        this.containerEditData = {
            labels: toolLabels,
            is_published: this.tool.is_published
        };
    };
    ContainerComponent.prototype.submitContainerEdits = function () {
        if (!this.labelsEditMode) {
            this.labelsEditMode = true;
            return;
        }
        // the edit object should be recreated
        if (this.containerEditData.labels !== 'undefined') {
            this.setContainerLabels();
        }
    };
    ContainerComponent.prototype.setContainerLabels = function () {
        var _this = this;
        return this.dockstoreService.setContainerLabels(this.tool.id, this.containerEditData.labels).
            subscribe(function (tool) {
            _this.tool.labels = tool.labels;
            _this.updateContainer.setTool(tool);
            _this.labelsEditMode = false;
        });
    };
    return ContainerComponent;
}(tool_1.Tool));
ContainerComponent = __decorate([
    core_1.Component({
        selector: 'app-container',
        templateUrl: './container.component.html',
    })
], ContainerComponent);
exports.ContainerComponent = ContainerComponent;
