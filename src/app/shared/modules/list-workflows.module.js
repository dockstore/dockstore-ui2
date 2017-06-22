"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var angular_datatables_1 = require("angular-datatables");
var header_module_1 = require("./header.module");
var list_component_1 = require("../../workflows/list/list.component");
var workflow_service_1 = require("../workflow.service");
var ListWorkflowsModule = (function () {
    function ListWorkflowsModule() {
    }
    return ListWorkflowsModule;
}());
ListWorkflowsModule = __decorate([
    core_1.NgModule({
        declarations: [
            list_component_1.ListWorkflowsComponent
        ],
        imports: [
            common_1.CommonModule,
            router_1.RouterModule,
            angular_datatables_1.DataTablesModule.forRoot(),
            header_module_1.HeaderModule
        ],
        exports: [
            list_component_1.ListWorkflowsComponent
        ],
        providers: [
            workflow_service_1.WorkflowService
        ]
    })
], ListWorkflowsModule);
exports.ListWorkflowsModule = ListWorkflowsModule;
