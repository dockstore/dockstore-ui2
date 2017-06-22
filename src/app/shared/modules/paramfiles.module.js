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
var highlight_js_module_1 = require("../../shared/angular2-highlight-js/lib/highlight-js.module");
var select_module_1 = require("./select.module");
var paramfiles_component_1 = require("../../paramfiles/paramfiles.component");
var ParamfilesModule = (function () {
    function ParamfilesModule() {
    }
    return ParamfilesModule;
}());
ParamfilesModule = __decorate([
    core_1.NgModule({
        declarations: [
            paramfiles_component_1.ParamfilesComponent
        ],
        imports: [
            common_1.CommonModule,
            highlight_js_module_1.HighlightJsModule,
            select_module_1.SelectModule
        ],
        providers: [
            highlight_js_module_1.HighlightJsService
        ],
        exports: [
            paramfiles_component_1.ParamfilesComponent
        ]
    })
], ParamfilesModule);
exports.ParamfilesModule = ParamfilesModule;
