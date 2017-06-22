"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var angular_datatables_1 = require("angular-datatables");
var highlight_js_module_1 = require("../../shared/angular2-highlight-js/lib/highlight-js.module");
var angular2_markdown_1 = require("angular2-markdown");
/* Bootstrap */
var accordion_1 = require("ngx-bootstrap/accordion");
var tabs_1 = require("ngx-bootstrap/tabs");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var alert_1 = require("ngx-bootstrap/alert");
var ngx_sharebuttons_1 = require("ngx-sharebuttons");
/* Component */
var versions_component_1 = require("../../workflow/versions/versions.component");
var files_component_1 = require("../../workflow/files/files.component");
var descriptors_component_1 = require("../../workflow/descriptors/descriptors.component");
var paramfiles_component_1 = require("../../workflow/paramfiles/paramfiles.component");
var workflow_component_1 = require("../../workflow/workflow.component");
var launch_component_1 = require("../../workflow/launch/launch.component");
var view_component_1 = require("../../workflow/view/view.component");
/* Module */
var header_module_1 = require("../modules/header.module");
var list_workflows_module_1 = require("../modules/list-workflows.module");
var paramfiles_module_1 = require("../modules/paramfiles.module");
var select_module_1 = require("../modules/select.module");
var dag_module_1 = require("./../../workflow/dag/dag.module");
/* Service */
var launch_service_1 = require("../../container/launch/launch.service");
var container_service_1 = require("../container.service");
var paramfiles_service_1 = require("../../container/paramfiles/paramfiles.service");
var dockerfile_service_1 = require("../../container/dockerfile/dockerfile.service");
var view_service_1 = require("../../container/view/view.service");
var date_service_1 = require("../date.service");
var file_service_1 = require("../file.service");
var workflow_service_1 = require("../../shared/workflow.service");
var descriptors_service_1 = require("../../container/descriptors/descriptors.service");
var orderby_module_1 = require("../../shared/modules/orderby.module");
var WorkflowModule = (function () {
    function WorkflowModule() {
    }
    return WorkflowModule;
}());
WorkflowModule = __decorate([
    core_1.NgModule({
        declarations: [
            workflow_component_1.WorkflowComponent,
            descriptors_component_1.DescriptorsWorkflowComponent,
            files_component_1.FilesWorkflowComponent,
            paramfiles_component_1.ParamfilesWorkflowComponent,
            versions_component_1.VersionsWorkflowComponent,
            launch_component_1.LaunchWorkflowComponent,
            view_component_1.ViewWorkflowComponent
        ],
        imports: [
            common_1.CommonModule,
            alert_1.AlertModule.forRoot(),
            angular2_markdown_1.MarkdownModule.forRoot(),
            angular_datatables_1.DataTablesModule,
            header_module_1.HeaderModule,
            highlight_js_module_1.HighlightJsModule,
            list_workflows_module_1.ListWorkflowsModule,
            paramfiles_module_1.ParamfilesModule,
            select_module_1.SelectModule,
            tooltip_1.TooltipModule.forRoot(),
            tabs_1.TabsModule.forRoot(),
            accordion_1.AccordionModule.forRoot(),
            ngx_sharebuttons_1.ShareButtonsModule.forRoot(),
            orderby_module_1.OrderByModule,
            forms_1.FormsModule,
            dag_module_1.DagModule
        ],
        providers: [
            highlight_js_module_1.HighlightJsService,
            date_service_1.DateService,
            file_service_1.FileService,
            container_service_1.ContainerService,
            launch_service_1.LaunchService,
            view_service_1.ViewService,
            dockerfile_service_1.DockerfileService,
            paramfiles_service_1.ParamfilesService,
            workflow_service_1.WorkflowService,
            descriptors_service_1.DescriptorsService
        ],
        exports: [
            workflow_component_1.WorkflowComponent
        ]
    })
], WorkflowModule);
exports.WorkflowModule = WorkflowModule;
