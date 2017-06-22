"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var dockstore_model_1 = require("../shared/dockstore.model");
var DockstoreService = (function () {
    function DockstoreService(httpService, authService) {
        this.httpService = httpService;
        this.authService = authService;
    }
    DockstoreService.prototype.getValidVersions = function (versions) {
        var validVersions = [];
        for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
            var version = versions_1[_i];
            if (version.valid) {
                validVersions.push(version);
            }
        }
        return validVersions;
    };
    DockstoreService.prototype.getVersionVerified = function (versions) {
        for (var _i = 0, versions_2 = versions; _i < versions_2.length; _i++) {
            var version = versions_2[_i];
            if (version.verified) {
                return true;
            }
        }
        return false;
    };
    DockstoreService.prototype.getVerifiedSources = function (toolRef) {
        var sources = [];
        if (toolRef !== null) {
            // for (let i = 0; i < toolRef.tags.length; i++) {
            //   if (toolRef.tags[ i ].verified) {
            //     sources.push(toolRef.tags[ i ].verifiedSource);
            //   }
            // }
            for (var _i = 0, _a = toolRef.tags; _i < _a.length; _i++) {
                var version = _a[_i];
                if (version.verified) {
                    sources.push({
                        version: version.name,
                        verifiedSource: version.verifiedSource
                    });
                }
            }
        }
        return sources.filter(function (elem, pos) {
            return sources.indexOf(elem) === pos;
        });
    };
    DockstoreService.prototype.getVerifiedWorkflowSources = function (workflow) {
        var sources = [];
        if (workflow !== null) {
            for (var _i = 0, _a = workflow.workflowVersions; _i < _a.length; _i++) {
                var version = _a[_i];
                if (version.verified) {
                    sources.push({
                        version: version.name,
                        verifiedSource: version.verifiedSource
                    });
                }
            }
        }
        return sources.filter(function (elem, pos) {
            return sources.indexOf(elem) === pos;
        });
    };
    DockstoreService.prototype.getLabelStrings = function (labels) {
        var sortedLabels = labels.sort(function (a, b) {
            if (a.value < b.value) {
                return -1;
            }
            if (a.value > b.value) {
                return 1;
            }
        });
        var labelStrings = [];
        for (var i = 0; i < sortedLabels.length; i++) {
            labelStrings.push(sortedLabels[i].value);
        }
        return labelStrings;
    };
    DockstoreService.prototype.isEncoded = function (uri) {
        if (uri) {
            return uri !== decodeURIComponent(uri);
        }
        return null;
    };
    /* Highlight Code */
    DockstoreService.prototype.highlightCode = function (code) {
        return '<pre><code class="YAML highlight">' + code + '</pre></code>';
    };
    /* Strip mailto from email field */
    DockstoreService.prototype.stripMailTo = function (email) {
        if (email) {
            return email.replace(/^mailto:/, '');
        }
        return null;
    };
    DockstoreService.prototype.getIconClass = function (columnName, sortColumn, sortReverse) {
        if (sortColumn === columnName) {
            return !sortReverse ? 'glyphicon-sort-by-alphabet' :
                'glyphicon-sort-by-alphabet-alt';
        }
        else {
            return 'glyphicon-sort';
        }
    };
    DockstoreService.prototype.setContainerLabels = function (containerId, labels) {
        var url = dockstore_model_1.Dockstore.API_URI + "/containers/" + containerId + "/labels";
        var myParams = new http_1.URLSearchParams();
        myParams.set('labels', labels);
        return this.httpService.request(url, myParams, http_1.RequestMethod.Put, this.authService.getToken());
    };
    DockstoreService.prototype.setWorkflowLabels = function (workflowId, labels) {
        var url = dockstore_model_1.Dockstore.API_URI + "/workflows/" + workflowId + "/labels";
        var myParams = new http_1.URLSearchParams();
        myParams.set('labels', labels);
        return this.httpService.request(url, myParams, http_1.RequestMethod.Put, this.authService.getToken());
    };
    return DockstoreService;
}());
DockstoreService = __decorate([
    core_1.Injectable()
], DockstoreService);
exports.DockstoreService = DockstoreService;
