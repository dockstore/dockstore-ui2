"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var angular_datatables_1 = require("angular-datatables");
var highlight_js_module_1 = require("../shared/angular2-highlight-js/lib/highlight-js.module");
var angular2_markdown_1 = require("angular2-markdown");
/* Bootstrap */
var accordion_1 = require("ngx-bootstrap/accordion");
var tabs_1 = require("ngx-bootstrap/tabs");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var alert_1 = require("ngx-bootstrap/alert");
var header_module_1 = require("../shared/modules/header.module");
var list_workflows_module_1 = require("../shared/modules/list-workflows.module");
var paramfiles_module_1 = require("../shared/modules/paramfiles.module");
var select_module_1 = require("../shared/modules/select.module");
var workflow_module_1 = require("../shared/modules/workflow.module");
var search_component_1 = require("./search/search.component");
var workflows_component_1 = require("./workflows.component");
var workflows_routing_1 = require("./workflows.routing");
var workflow_service_1 = require("../shared/workflow.service");
var WorkflowsModule = (function () {
    function WorkflowsModule() {
    }
    return WorkflowsModule;
}());
WorkflowsModule = __decorate([
    core_1.NgModule({
        declarations: [
            workflows_component_1.WorkflowsComponent,
            search_component_1.SearchWorkflowsComponent
        ],
        imports: [
            common_1.CommonModule,
            accordion_1.AccordionModule.forRoot(),
            alert_1.AlertModule.forRoot(),
            angular_datatables_1.DataTablesModule.forRoot(),
            highlight_js_module_1.HighlightJsModule,
            header_module_1.HeaderModule,
            list_workflows_module_1.ListWorkflowsModule,
            angular2_markdown_1.MarkdownModule.forRoot(),
            select_module_1.SelectModule,
            tabs_1.TabsModule.forRoot(),
            tooltip_1.TooltipModule.forRoot(),
            paramfiles_module_1.ParamfilesModule,
            workflow_module_1.WorkflowModule,
            workflows_routing_1.workflowsRouting
        ],
        providers: [
            highlight_js_module_1.HighlightJsService,
            workflow_service_1.WorkflowService
        ]
    })
], WorkflowsModule);
exports.WorkflowsModule = WorkflowsModule;
