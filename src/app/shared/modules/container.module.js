"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var containerTags_service_1 = require("./../containerTags.service");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var ngx_clipboard_1 = require("ngx-clipboard");
var angular_datatables_1 = require("angular-datatables");
var highlight_js_module_1 = require("../angular2-highlight-js/lib/highlight-js.module");
var angular2_markdown_1 = require("angular2-markdown");
/* External Library */
var accordion_1 = require("ngx-bootstrap/accordion");
var alert_1 = require("ngx-bootstrap/alert");
var tabs_1 = require("ngx-bootstrap/tabs");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var ngx_sharebuttons_1 = require("ngx-sharebuttons");
var container_component_1 = require("../../container/container.component");
var container_service_1 = require("../container.service");
var descriptors_component_1 = require("../../container/descriptors/descriptors.component");
var dockerfile_component_1 = require("../../container/dockerfile/dockerfile.component");
var dockerfile_service_1 = require("../../container/dockerfile/dockerfile.service");
var files_component_1 = require("../../container/files/files.component");
var launch_component_1 = require("../../container/launch/launch.component");
var launch_service_1 = require("../../container/launch/launch.service");
var paramfiles_component_1 = require("../../container/paramfiles/paramfiles.component");
var paramfiles_service_1 = require("../../container/paramfiles/paramfiles.service");
var versions_component_1 = require("../../container/versions/versions.component");
var view_component_1 = require("../../container/view/view.component");
var workflow_service_1 = require("../workflow.service");
var date_service_1 = require("../date.service");
var file_service_1 = require("../file.service");
var header_module_1 = require("./header.module");
var list_containers_module_1 = require("./list-containers.module");
var paramfiles_module_1 = require("./paramfiles.module");
var select_module_1 = require("./select.module");
var orderby_module_1 = require("../../shared/modules/orderby.module");
var ContainerModule = (function () {
    function ContainerModule() {
    }
    return ContainerModule;
}());
ContainerModule = __decorate([
    core_1.NgModule({
        declarations: [
            container_component_1.ContainerComponent,
            launch_component_1.LaunchComponent,
            versions_component_1.VersionsContainerComponent,
            view_component_1.ViewContainerComponent,
            files_component_1.FilesContainerComponent,
            dockerfile_component_1.DockerfileComponent,
            descriptors_component_1.DescriptorsComponent,
            paramfiles_component_1.ParamfilesComponent
        ],
        imports: [
            common_1.CommonModule,
            ngx_clipboard_1.ClipboardModule,
            angular2_markdown_1.MarkdownModule.forRoot(),
            angular_datatables_1.DataTablesModule.forRoot(),
            highlight_js_module_1.HighlightJsModule,
            header_module_1.HeaderModule,
            select_module_1.SelectModule,
            list_containers_module_1.ListContainersModule,
            paramfiles_module_1.ParamfilesModule,
            tooltip_1.TooltipModule.forRoot(),
            tabs_1.TabsModule.forRoot(),
            accordion_1.AccordionModule.forRoot(),
            alert_1.AlertModule.forRoot(),
            forms_1.FormsModule,
            ngx_sharebuttons_1.ShareButtonsModule.forRoot(),
            orderby_module_1.OrderByModule
        ],
        providers: [
            highlight_js_module_1.HighlightJsService,
            containerTags_service_1.ContainerTagsService,
            date_service_1.DateService,
            file_service_1.FileService,
            container_service_1.ContainerService,
            launch_service_1.LaunchService,
            dockerfile_service_1.DockerfileService,
            paramfiles_service_1.ParamfilesService,
            workflow_service_1.WorkflowService
        ],
        exports: [
            container_component_1.ContainerComponent
        ]
    })
], ContainerModule);
exports.ContainerModule = ContainerModule;
