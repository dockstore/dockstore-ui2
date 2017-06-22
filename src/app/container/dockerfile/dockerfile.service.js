"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dockstore_model_1 = require("../../shared/dockstore.model");
var DockerfileService = (function () {
    function DockerfileService(httpService) {
        this.httpService = httpService;
    }
    DockerfileService.prototype.getDockerfile = function (toolId, tag) {
        var dockerFileUrl = dockstore_model_1.Dockstore.API_URI + "/containers/" + toolId + "/dockerfile";
        if (tag) {
            dockerFileUrl += '?tag=' + tag;
        }
        return this.httpService.getResponse(dockerFileUrl);
    };
    return DockerfileService;
}());
DockerfileService = __decorate([
    core_1.Injectable()
], DockerfileService);
exports.DockerfileService = DockerfileService;
