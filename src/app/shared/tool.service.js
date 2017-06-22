"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dockstore_model_1 = require("./dockstore.model");
var ToolService = (function () {
    function ToolService(httpService) {
        this.httpService = httpService;
    }
    ToolService.prototype.getPublishedToolByPath = function (path, toolType) {
        return this.httpService.getResponse(dockstore_model_1.Dockstore.API_URI + "/" + toolType + "/path/tool/" + path + "/published");
    };
    ToolService.prototype.getPublishedWorkflowByPath = function (path, toolType) {
        return this.httpService.getResponse(dockstore_model_1.Dockstore.API_URI + "/" + toolType + "/path/workflow/" + path + "/published");
    };
    return ToolService;
}());
ToolService = __decorate([
    core_1.Injectable()
], ToolService);
exports.ToolService = ToolService;
