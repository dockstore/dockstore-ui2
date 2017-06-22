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
var router_1 = require("@angular/router");
var angular_datatables_1 = require("angular-datatables");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var ngx_clipboard_1 = require("ngx-clipboard");
var list_component_1 = require("../../containers/list/list.component");
var list_service_1 = require("../../containers/list/list.service");
var header_module_1 = require("./header.module");
var container_service_1 = require("../container.service");
var ListContainersModule = (function () {
    function ListContainersModule() {
    }
    return ListContainersModule;
}());
ListContainersModule = __decorate([
    core_1.NgModule({
        declarations: [
            list_component_1.ListContainersComponent
        ],
        imports: [
            common_1.CommonModule,
            router_1.RouterModule,
            angular_datatables_1.DataTablesModule.forRoot(),
            ngx_clipboard_1.ClipboardModule,
            header_module_1.HeaderModule,
            tooltip_1.TooltipModule.forRoot(),
        ],
        providers: [
            list_service_1.ListContainersService,
            container_service_1.ContainerService
        ],
        exports: [
            list_component_1.ListContainersComponent
        ]
    })
], ListContainersModule);
exports.ListContainersModule = ListContainersModule;
