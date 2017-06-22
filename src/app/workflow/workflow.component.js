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
var WorkflowComponent = (function (_super) {
    __extends(WorkflowComponent, _super);
    function WorkflowComponent(dockstoreService, dateService, updateWorkflow, toolService, communicatorService, providerService, router, workflowService, containerService) {
        var _this = _super.call(this, toolService, communicatorService, providerService, router, workflowService, containerService, 'workflows') || this;
        _this.dockstoreService = dockstoreService;
        _this.dateService = dateService;
        _this.updateWorkflow = updateWorkflow;
        _this.labelPattern = validationMessages_model_1.validationPatterns.label;
        _this.totalShare = 0;
        return _this;
    }
    WorkflowComponent.prototype.setProperties = function () {
        var workflowRef = this.workflow;
        console.log(workflowRef);
        this.labels = this.dockstoreService.getLabelStrings(this.workflow.labels);
        this.shareURL = window.location.href;
        workflowRef.email = this.dockstoreService.stripMailTo(workflowRef.email);
        workflowRef.agoMessage = this.dateService.getAgoMessage(workflowRef.last_modified);
        workflowRef.versionVerified = this.dockstoreService.getVersionVerified(workflowRef.workflowVersions);
        workflowRef.verifiedSources = this.dockstoreService.getVerifiedWorkflowSources(workflowRef);
        this.resetWorkflowEditData();
    };
    WorkflowComponent.prototype.sumCounts = function (count) {
        console.log(count);
        this.totalShare += count;
    };
    WorkflowComponent.prototype.getValidVersions = function () {
        this.validVersions = this.dockstoreService.getValidVersions(this.workflow.workflowVersions);
    };
    WorkflowComponent.prototype.setTab = function (tab) {
        this.mode = tab;
    };
    WorkflowComponent.prototype.checkMode = function (tab) {
        return (tab === this.mode);
    };
    WorkflowComponent.prototype.toggleLabelsEditMode = function () {
        this.labelsEditMode = !this.labelsEditMode;
    };
    WorkflowComponent.prototype.resetWorkflowEditData = function () {
        var labelArray = this.dockstoreService.getLabelStrings(this.workflow.labels);
        var workflowLabels = labelArray.join(', ');
        this.workflowEditData = {
            labels: workflowLabels,
            is_published: this.workflow.is_published
        };
    };
    WorkflowComponent.prototype.submitWorkflowEdits = function () {
        if (!this.labelsEditMode) {
            this.labelsEditMode = true;
            return;
        }
        // the edit object should be recreated
        if (this.workflowEditData.labels !== 'undefined') {
            this.setWorkflowLabels();
        }
    };
    WorkflowComponent.prototype.setWorkflowLabels = function () {
        var _this = this;
        return this.dockstoreService.setWorkflowLabels(this.workflow.id, this.workflowEditData.labels).
            subscribe(function (workflow) {
            _this.workflow.labels = workflow.labels;
            _this.updateWorkflow.setWorkflow(workflow);
            _this.labelsEditMode = false;
        });
    };
    return WorkflowComponent;
}(tool_1.Tool));
WorkflowComponent = __decorate([
    core_1.Component({
        selector: 'app-workflow',
        templateUrl: './workflow.component.html',
        styleUrls: ['./workflow.component.css']
    })
], WorkflowComponent);
exports.WorkflowComponent = WorkflowComponent;
