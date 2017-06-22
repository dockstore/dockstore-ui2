"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dockstore_model_1 = require("../shared/dockstore.model");
var ParamFilesService = (function () {
    function ParamFilesService(httpService) {
        this.httpService = httpService;
    }
    ParamFilesService.prototype.getContainerTestParamFiles = function (toolId, tagName, descriptorType) {
        var testParamFilesUrl = dockstore_model_1.Dockstore.API_URI + '/containers/' + toolId + '/testParameterFiles';
        if (tagName && descriptorType) {
            testParamFilesUrl += '?tag=' + tagName;
            testParamFilesUrl += '&descriptorType=' + descriptorType;
        }
        else if (tagName) {
            testParamFilesUrl += '?tag=' + tagName;
        }
        else if (testParamFilesUrl) {
            testParamFilesUrl += '?descriptorType=' + descriptorType;
        }
        return this.httpService.getResponse(testParamFilesUrl);
    };
    ParamFilesService.prototype.getTagsWithParam = function (toolId, validTags) {
        for (var _i = 0, validTags_1 = validTags; _i < validTags_1.length; _i++) {
            var tag = validTags_1[_i];
            this.getContainerTestParamFiles(toolId, tag.name).subscribe(function (result) {
                console.log(result);
            });
        }
    };
    return ParamFilesService;
}());
ParamFilesService = __decorate([
    core_1.Injectable()
], ParamFilesService);
exports.ParamFilesService = ParamFilesService;
