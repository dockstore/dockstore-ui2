"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var view_1 = require("../../shared/view");
var ViewWorkflowComponent = (function (_super) {
    __extends(ViewWorkflowComponent, _super);
    function ViewWorkflowComponent(viewService, workflowService, dateService) {
        var _this = _super.call(this, dateService) || this;
        _this.viewService = viewService;
        _this.workflowService = workflowService;
        return _this;
    }
    ViewWorkflowComponent.prototype.initItems = function () {
        var _this = this;
        if (this.version) {
            this.workflowService.getTestJson(this.workflowId, this.version.name)
                .subscribe(function (items) {
                _this.items = items;
            });
        }
    };
    ViewWorkflowComponent.prototype.getSizeString = function (size) {
        return this.viewService.getSizeString(size);
    };
    ViewWorkflowComponent.prototype.ngAfterViewInit = function () {
        this.initItems();
    };
    return ViewWorkflowComponent;
}(view_1.View));
__decorate([
    core_1.Input()
], ViewWorkflowComponent.prototype, "workflowId", void 0);
ViewWorkflowComponent = __decorate([
    core_1.Component({
        selector: 'app-view-workflow',
        templateUrl: './view.component.html',
        styleUrls: ['./view.component.css']
    })
], ViewWorkflowComponent);
exports.ViewWorkflowComponent = ViewWorkflowComponent;
