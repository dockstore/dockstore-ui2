"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommunicatorService = (function () {
    function CommunicatorService() {
        this._public = false;
    }
    CommunicatorService.prototype.setTool = function (tool) {
        this._tool = tool;
    };
    CommunicatorService.prototype.setWorkflow = function (workflow) {
        this._workflow = workflow;
    };
    CommunicatorService.prototype.getTool = function () {
        return this._tool;
    };
    CommunicatorService.prototype.getWorkflow = function () {
        return this._workflow;
    };
    return CommunicatorService;
}());
exports.CommunicatorService = CommunicatorService;
