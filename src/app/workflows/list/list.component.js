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
var ListWorkflowsComponent = (function (_super) {
    __extends(ListWorkflowsComponent, _super);
    // TODO: make an API endpoint to retrieve only the necessary properties for the workflows table
    // gitUrl
    function ListWorkflowsComponent(communicatorService, workflowService, listService, providerService) {
        var _this = _super.call(this, listService, providerService, 'workflows') || this;
        _this.communicatorService = communicatorService;
        _this.workflowService = workflowService;
        return _this;
    }
    ListWorkflowsComponent.prototype.sendWorkflowInfo = function (workflow) {
        this.communicatorService.setWorkflow(workflow);
        this.workflowService.setWorkflow(workflow);
    };
    ListWorkflowsComponent.prototype.initToolLister = function () {
    };
    return ListWorkflowsComponent;
}(tool_lister_1.ToolLister));
__decorate([
    core_1.Input()
], ListWorkflowsComponent.prototype, "previewMode", void 0);
ListWorkflowsComponent = __decorate([
    core_1.Component({
        selector: 'app-list-workflows',
        templateUrl: './list.component.html'
    })
], ListWorkflowsComponent);
exports.ListWorkflowsComponent = ListWorkflowsComponent;
