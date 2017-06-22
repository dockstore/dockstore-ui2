"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ToolLister = (function () {
    function ToolLister(listService, providerService, toolType) {
        this.listService = listService;
        this.providerService = providerService;
        this.toolType = toolType;
        this.displayTable = false;
        this.publishedTools = [];
        this._toolType = toolType;
    }
    ToolLister.prototype.ngOnInit = function () {
        var _this = this;
        this.listService.getPublishedTools(this._toolType)
            .subscribe(function (tools) {
            _this.publishedTools = tools.map(function (tool) { return _this.providerService.setUpProvider(tool); });
            _this.initToolLister();
            _this.displayTable = true;
        });
    };
    return ToolLister;
}());
ToolLister = __decorate([
    core_1.Injectable()
], ToolLister);
exports.ToolLister = ToolLister;
