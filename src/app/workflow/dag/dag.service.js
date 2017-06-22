"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = require("rxjs/Subject");
var dockstore_model_1 = require("./../../shared/dockstore.model");
var core_1 = require("@angular/core");
var DagService = (function () {
    function DagService(httpService) {
        this.httpService = httpService;
        this.validVersions = new Subject_1.Subject();
        this.currentWorkflowId = new Subject_1.Subject();
        this.currentVersion = new Subject_1.Subject();
        this.currentDagResults = new Subject_1.Subject();
        this.dynamicPopover = {
            link: '',
            title: '',
            type: '',
            docker: '',
            run: ''
        };
        this.style = [
            {
                selector: 'node',
                style: {
                    'content': 'data(name)',
                    'font-size': '16px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': '#7a88a9'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#9dbaea',
                    'target-arrow-color': '#9dbaea',
                    'curve-style': 'bezier'
                }
            },
            {
                selector: 'node[id = "UniqueBeginKey"]',
                style: {
                    'content': 'Start',
                    'font-size': '16px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': '#4caf50'
                }
            },
            {
                selector: 'node[id = "UniqueEndKey"]',
                style: {
                    'content': 'End',
                    'font-size': '16px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': '#f44336'
                }
            },
            {
                selector: 'node[type = "workflow"]',
                style: {
                    'content': 'data(name)',
                    'font-size': '16px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': '#4ab4a9'
                }
            },
            {
                selector: 'node[type = "tool"]',
                style: {
                    'content': 'data(name)',
                    'font-size': '16px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': '#51aad8'
                }
            },
            {
                selector: 'node[type = "expressionTool"]',
                style: {
                    'content': 'data(name)',
                    'font-size': '16px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': '#9966FF'
                }
            },
            {
                selector: 'edge.notselected',
                style: {
                    'opacity': '0.4'
                }
            }
        ];
    }
    DagService.prototype.getTooltipText = function (name, tool, type, docker, run) {
        this.setDynamicPopover(name, tool, type, docker, run);
        return "<div>\n          <div><b>Type:</b>" + this.dynamicPopover.type + "</div>" +
            this.getRunText(this.dynamicPopover.run) +
            this.getDockerText(this.dynamicPopover.link, this.dynamicPopover.docker) +
            "</div>";
    };
    ;
    DagService.prototype.updateUndefinedPopoverContent = function () {
        if (this.dynamicPopover.title === undefined) {
            this.dynamicPopover.title = 'n/a';
        }
        if (this.dynamicPopover.type === undefined) {
            this.dynamicPopover.type = 'n/a';
        }
        if (this.dynamicPopover.docker === undefined) {
            this.dynamicPopover.docker = 'n/a';
        }
        if (this.dynamicPopover.run === undefined) {
            this.dynamicPopover.run = 'n/a';
        }
    };
    ;
    DagService.prototype.setDynamicPopover = function (name, tool, type, docker, run) {
        this.dynamicPopover.title = name;
        this.dynamicPopover.link = tool;
        this.dynamicPopover.type = type;
        this.dynamicPopover.docker = docker;
        this.dynamicPopover.run = run;
        this.updateUndefinedPopoverContent();
    };
    DagService.prototype.getRunText = function (run) {
        var isHttp = this.isHttp(run);
        if (isHttp) {
            return "<div><b>Run:</b> <a href='" + run + "'>" + run + "</a></div>";
        }
        else {
            return "<div><b>Run:</b>" + run + "</div>";
        }
    };
    ;
    DagService.prototype.getDockerText = function (link, docker) {
        var validLink = !this.isNA(docker);
        console.log(validLink);
        if (validLink) {
            return "<div><b>Docker:</b> <a href='" + link + "'>" + docker + "</a></div>";
        }
        else {
            return "<div><b>Docker:</b>" + docker + "</div>";
        }
    };
    DagService.prototype.isNA = function (docker) {
        return (docker === 'n/a');
    };
    ;
    DagService.prototype.isHttp = function (run) {
        if (run.match('^http') || run.match('^https')) {
            return true;
        }
        else {
            return false;
        }
    };
    ;
    DagService.prototype.setCurrentWorkflowId = function (newWorkflowId) {
        this.currentWorkflowId.next(newWorkflowId);
    };
    DagService.prototype.setCurrentVersion = function (newVersion) {
        this.currentVersion.next(newVersion);
    };
    DagService.prototype.setDagResults = function (results) {
        this.currentDagResults.next(results);
    };
    DagService.prototype.updateDagResults = function (workflowId, versionId) {
        var _this = this;
        var url = dockstore_model_1.Dockstore.API_URI + '/workflows/' + workflowId + '/dag/' + versionId;
        this.httpService.getAuthResponse(url).subscribe(function (results) { return _this.currentDagResults.next(results); });
    };
    DagService.prototype.getDagResults = function (workflowId, versionId) {
        var url = dockstore_model_1.Dockstore.API_URI + '/workflows/' + workflowId + '/dag/' + versionId;
        return this.httpService.getAuthResponse(url);
    };
    DagService.prototype.getCurrentDAG = function (workflowId, versionId) {
        if (workflowId != null && versionId != null) {
            var url = dockstore_model_1.Dockstore.API_URI + '/workflows/' + workflowId + '/dag/' + versionId;
            return this.httpService.getAuthResponse(url);
        }
        else {
            return null;
        }
    };
    return DagService;
}());
DagService = __decorate([
    core_1.Injectable()
], DagService);
exports.DagService = DagService;
