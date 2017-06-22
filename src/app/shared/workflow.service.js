"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var core_1 = require("@angular/core");
var dockstore_model_1 = require("./dockstore.model");
var WorkflowService = (function () {
    function WorkflowService(httpService) {
        this.httpService = httpService;
        this.workflowSource = new BehaviorSubject_1.BehaviorSubject(null);
        // Observable streams
        this.workflow$ = this.workflowSource.asObservable();
    }
    WorkflowService.prototype.setWorkflow = function (workflow) {
        this.workflowSource.next(workflow);
    };
    WorkflowService.prototype.getParamsString = function (path, tagName) {
        return 'dockstore workflow convert entry2json --entry ' + path + ':' + tagName + " > Dockstore.json\n            \nvim Dockstore.json";
    };
    WorkflowService.prototype.getCliString = function (path, tagName) {
        return 'dockstore workflow launch --entry ' + path + ':' + tagName + ' --json Dockstore.json';
    };
    WorkflowService.prototype.getCwlString = function (path, tagName) {
        return 'cwltool --non-strict https://www.dockstore.org:8443/api/ga4gh/v1/workflows/'
            + encodeURIComponent(path)
            + '/versions/'
            + tagName
            + '/plain-CWL/descriptor Dockstore.json';
    };
    WorkflowService.prototype.getTestJson = function (workflowId, versionName) {
        var workflowTestUrl = dockstore_model_1.Dockstore.API_URI + '/workflows/' + workflowId + '/testParameterFiles?version=' + versionName;
        return this.httpService.getResponse(workflowTestUrl);
    };
    WorkflowService.prototype.getDescriptors = function (versions, version) {
        if (versions.length && version) {
            var typesAvailable = new Array();
            for (var _i = 0, _a = version.sourceFiles; _i < _a.length; _i++) {
                var file = _a[_i];
                var type = file.type;
                if (type === 'DOCKSTORE_CWL' && !typesAvailable.includes('cwl')) {
                    typesAvailable.push('cwl');
                }
                else if (type === 'DOCKSTORE_WDL' && !typesAvailable.includes('wdl')) {
                    typesAvailable.push('wdl');
                }
            }
            return typesAvailable;
        }
    };
    return WorkflowService;
}());
WorkflowService = __decorate([
    core_1.Injectable()
], WorkflowService);
exports.WorkflowService = WorkflowService;
