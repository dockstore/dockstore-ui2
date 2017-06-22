"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var dockstore_model_1 = require("../../shared/dockstore.model");
var DescriptorsService = (function () {
    function DescriptorsService(httpService) {
        this.httpService = httpService;
        this.descriptorToType = new Map([
            ['cwl', 'DOCKSTORE_CWL'],
            ['wdl', 'DOCKSTORE_WDL']
        ]);
    }
    DescriptorsService.prototype.getFiles = function (id, versionName, descriptor, type) {
        var observable;
        this.type = type;
        if (descriptor === 'cwl') {
            observable = this.getCwlFiles(id, versionName);
        }
        else if (descriptor === 'wdl') {
            observable = this.getWdlFiles(id, versionName);
        }
        return observable.map(function (filesArray) {
            var files = [];
            files.push(filesArray[0]);
            for (var _i = 0, _a = filesArray[1]; _i < _a.length; _i++) {
                var file = _a[_i];
                files.push(file);
            }
            return files;
        });
    };
    DescriptorsService.prototype.getCwlFiles = function (id, versionName) {
        return Observable_1.Observable.zip(this.getCwl(id, versionName), this.getSecondaryCwl(id, versionName));
    };
    DescriptorsService.prototype.getWdlFiles = function (id, versionName) {
        return Observable_1.Observable.zip(this.getWdl(id, versionName), this.getSecondaryWdl(id, versionName));
    };
    DescriptorsService.prototype.getCwl = function (id, versionName) {
        var cwlURL = dockstore_model_1.Dockstore.API_URI + "/" + this.type + "/" + id + "/cwl?tag=" + versionName;
        return this.httpService.getResponse(cwlURL);
    };
    DescriptorsService.prototype.getSecondaryCwl = function (id, versionName) {
        var sec_cwlURL = dockstore_model_1.Dockstore.API_URI + "/" + this.type + "/" + id + "/secondaryCwl?tag=" + versionName;
        return this.httpService.getResponse(sec_cwlURL);
    };
    DescriptorsService.prototype.getWdl = function (id, versionName) {
        var wdlURL = dockstore_model_1.Dockstore.API_URI + "/" + this.type + "/" + id + "/wdl?tag=" + versionName;
        return this.httpService.getResponse(wdlURL);
    };
    DescriptorsService.prototype.getSecondaryWdl = function (id, versionName) {
        var sec_wdlURL = dockstore_model_1.Dockstore.API_URI + "/" + this.type + "/" + id + "/secondaryWdl?tag=" + versionName;
        return this.httpService.getResponse(sec_wdlURL);
    };
    return DescriptorsService;
}());
DescriptorsService = __decorate([
    core_1.Injectable()
], DescriptorsService);
exports.DescriptorsService = DescriptorsService;
