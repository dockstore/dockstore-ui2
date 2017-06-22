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
var ContainerTagsService = (function () {
    function ContainerTagsService(httpService) {
        this.httpService = httpService;
    }
    ContainerTagsService.prototype.getTags = function (containerId) {
        return this.httpService.getResponse(dockstore_model_1.Dockstore.API_URI + "/containers/path/" + containerId + "/tags");
    };
    ContainerTagsService.prototype.postTags = function (containerId, tags) {
        return this.httpService.postResponse(dockstore_model_1.Dockstore.API_URI + "/containers/" + containerId + "/tags", tags);
    };
    ContainerTagsService.prototype.putTags = function (containerId, tags) {
        return this.httpService.putResponse(dockstore_model_1.Dockstore.API_URI + "/containers/" + containerId + "/tags", [tags]);
    };
    ContainerTagsService.prototype.deleteTag = function (containerId, tagId) {
        return this.httpService.delete(dockstore_model_1.Dockstore.API_URI + "/containers/" + containerId + "/tags/" + tagId);
    };
    ContainerTagsService.prototype.putVerifyTag = function (containerId, tagId, body) {
        return this.httpService.putResponse(dockstore_model_1.Dockstore.API_URI + "/containers/" + containerId + "/verify/" + tagId, body);
    };
    return ContainerTagsService;
}());
ContainerTagsService = __decorate([
    core_1.Injectable()
], ContainerTagsService);
exports.ContainerTagsService = ContainerTagsService;
