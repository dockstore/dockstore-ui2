"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Tool = (function () {
    function Tool(toolService, communicatorService, providerService, router, workflowService, containerService, toolType) {
        this.toolService = toolService;
        this.communicatorService = communicatorService;
        this.providerService = providerService;
        this.router = router;
        this.workflowService = workflowService;
        this.containerService = containerService;
        this.isWorkflowPublic = true;
        this.isToolPublic = true;
        this._toolType = toolType;
        // this.isToolPublic = true;
    }
    Tool.prototype.ngOnInit = function () {
        var _this = this;
        this.workflowSubscription = this.workflowService.workflow$.subscribe(function (workflow) {
            _this.workflow = workflow;
            _this.setUpWorkflow(workflow);
        });
        this.toolSubscription = this.containerService.tool$.subscribe(function (tool) {
            _this.tool = tool;
            _this.setUpTool(tool);
        });
        if (this._toolType === 'workflows') {
            if (this.isWorkflowPublic) {
                this.routeSub = this.router.events.subscribe(function (event) {
                    return _this.urlWorkflowChanged(event);
                });
            }
            else {
                this.setUpWorkflow(this.communicatorService.getWorkflow());
            }
        }
        else if (this._toolType === 'containers') {
            if (this.isToolPublic) {
                this.routeSub = this.router.events.subscribe(function (event) {
                    return _this.urlToolChanged(event);
                });
            }
            else {
                this.setUpTool((this.communicatorService.getTool()));
            }
        }
    };
    Tool.prototype.ngOnDestroy = function () {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
        this.workflowSubscription.unsubscribe();
        this.toolSubscription.unsubscribe();
    };
    Tool.prototype.setUpWorkflow = function (workflow) {
        if (workflow) {
            this.workflow = workflow;
            if (!workflow.providerUrl) {
                this.providerService.setUpProvider(workflow);
            }
            this.workflow = Object.assign(workflow, this.workflow);
            this.title = this.workflow.path;
            this.initTool();
        }
    };
    Tool.prototype.setUpTool = function (tool) {
        if (tool) {
            this.tool = tool;
            if (!tool.providerUrl) {
                this.providerService.setUpProvider(tool);
            }
            this.tool = Object.assign(tool, this.tool);
            this.title = this.tool.path;
            var toolRef = this.tool;
            toolRef.buildMode = this.containerService.getBuildMode(toolRef.mode);
            toolRef.buildModeTooltip = this.containerService.getBuildModeTooltip(toolRef.mode);
            this.initTool();
        }
    };
    Tool.prototype.urlToolChanged = function (event) {
        var _this = this;
        // console.log(event.url);
        if (!this.tool) {
            this.title = this.decodedString(event.url.replace("/" + this._toolType + "/", ''));
        }
        else {
            this.title = this.tool.path;
        }
        this.toolService.getPublishedToolByPath(this.encodedString(this.title), this._toolType)
            .subscribe(function (tool) {
            _this.setUpTool(tool);
        }, function (error) {
            _this.router.navigate(['../']);
        });
    };
    Tool.prototype.urlWorkflowChanged = function (event) {
        var _this = this;
        // reuse provider and image provider
        if (!this.workflow) {
            this.title = this.decodedString(event.url.replace("/" + this._toolType + "/", ''));
        }
        else {
            this.title = this.workflow.path;
        }
        this.toolService.getPublishedWorkflowByPath(this.encodedString(this.title), this._toolType)
            .subscribe(function (workflow) {
            _this.setUpWorkflow(workflow);
        }, function (error) {
            _this.router.navigate(['../']);
        });
    };
    Tool.prototype.initTool = function () {
        this.setProperties();
        this.getValidVersions();
        this.chooseDefaultVersion();
    };
    Tool.prototype.chooseDefaultVersion = function () {
        var defaultVersionName;
        if (this._toolType === 'workflows') {
            defaultVersionName = this.workflow.defaultVersion;
        }
        else {
            defaultVersionName = this.tool.defaultVersion;
        }
        // if user did not specify a default version, use the latest version
        if (!defaultVersionName) {
            if (this.validVersions.length) {
                var last = this.validVersions.length - 1;
                defaultVersionName = this.validVersions[last].name;
            }
        }
        this.defaultVersion = this.getDefaultVersion(defaultVersionName);
    };
    Tool.prototype.getDefaultVersion = function (defaultVersionName) {
        for (var _i = 0, _a = this.validVersions; _i < _a.length; _i++) {
            var version = _a[_i];
            if (version.name === defaultVersionName) {
                return version;
            }
        }
    };
    Tool.prototype.encodedString = function (url) {
        if (!this.isEncoded(url)) {
            return encodeURIComponent(url);
        }
        return url;
    };
    Tool.prototype.decodedString = function (url) {
        if (this.isEncoded(url)) {
            return decodeURIComponent(url);
        }
        return url;
    };
    Tool.prototype.isEncoded = function (uri) {
        if (uri) {
            return uri !== decodeURIComponent(uri);
        }
        return null;
    };
    return Tool;
}());
__decorate([
    core_1.Input()
], Tool.prototype, "isWorkflowPublic", void 0);
__decorate([
    core_1.Input()
], Tool.prototype, "isToolPublic", void 0);
Tool = __decorate([
    core_1.Injectable()
], Tool);
exports.Tool = Tool;
