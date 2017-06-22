"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var dockstore_model_1 = require("../../shared/dockstore.model");
var ParamfilesService = (function () {
    // TODO: have an endpoints to
    // - get versions with test paramfiles
    // - get descriptors with test paramfiles for each version
    function ParamfilesService(httpService, authService, http) {
        this.httpService = httpService;
        this.authService = authService;
        this.http = http;
    }
    ParamfilesService.prototype.getFiles = function (id, type, versionName, descriptor) {
        var testParamFilesUrl = dockstore_model_1.Dockstore.API_URI + '/' + type + '/' + id + '/testParameterFiles';
        if (type === 'containers') {
            if (versionName && descriptor) {
                testParamFilesUrl += '?tag=' + versionName;
                testParamFilesUrl += '&descriptorType=' + descriptor;
            }
            else if (versionName) {
                testParamFilesUrl += '?tag=' + versionName;
            }
            else if (testParamFilesUrl) {
                testParamFilesUrl += '?descriptor=' + descriptor;
            }
        }
        else if (type === 'workflows') {
            if (versionName) {
                testParamFilesUrl += '?version=' + versionName;
            }
        }
        return this.httpService.getResponse(testParamFilesUrl);
    };
    ParamfilesService.prototype.putFiles = function (containerId, testParameterFiles, tagName, descriptorType) {
        return this.requestFiles(containerId, testParameterFiles, tagName, descriptorType, http_1.RequestMethod.Put);
    };
    ParamfilesService.prototype.deleteFiles = function (containerId, testParameterFiles, tagName, descriptorType) {
        return this.requestFiles(containerId, testParameterFiles, tagName, descriptorType, http_1.RequestMethod.Delete);
    };
    ParamfilesService.prototype.requestFiles = function (containerId, testParameterFiles, tagName, descriptorType, method) {
        var url = dockstore_model_1.Dockstore.API_URI + "/containers/" + containerId + "/testParameterFiles";
        var myParams = new http_1.URLSearchParams();
        testParameterFiles.forEach(function (file) {
            myParams.append('testParameterPaths', file);
        });
        myParams.set('tagName', tagName);
        myParams.set('descriptorType', descriptorType);
        return this.httpService.request(url, myParams, method, this.authService.getToken());
    };
    // get descriptors which have test parameter files
    ParamfilesService.prototype.getDescriptors = function (version) {
        var descriptorsWithParamfiles = [];
        if (version) {
            for (var _i = 0, _a = version.sourceFiles; _i < _a.length; _i++) {
                var file = _a[_i];
                var type = file.type;
                if (type === 'CWL_TEST_JSON' && !descriptorsWithParamfiles.includes('cwl')) {
                    descriptorsWithParamfiles.push('cwl');
                }
                else if (type === 'WDL_TEST_JSON' && !descriptorsWithParamfiles.includes('wdl')) {
                    descriptorsWithParamfiles.push('wdl');
                }
            }
        }
        return descriptorsWithParamfiles;
    };
    // get versions which have test parameter files
    ParamfilesService.prototype.getVersions = function (versions) {
        var versionsWithParamfiles = [];
        if (versions) {
            for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
                var version = versions_1[_i];
                if (this.getDescriptors(version).length) {
                    versionsWithParamfiles.push(version);
                }
            }
        }
        return versionsWithParamfiles;
    };
    return ParamfilesService;
}());
ParamfilesService = __decorate([
    core_1.Injectable()
], ParamfilesService);
exports.ParamfilesService = ParamfilesService;
