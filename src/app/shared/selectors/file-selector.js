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
Object.defineProperty(exports, "__esModule", { value: true });
var descriptor_selector_1 = require("./descriptor-selector");
var FileSelector = (function (_super) {
    __extends(FileSelector, _super);
    function FileSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileSelector.prototype.reactToDescriptor = function () {
        var _this = this;
        this.getFiles(this.currentDescriptor)
            .subscribe(function (files) {
            _this.files = files;
            if (_this.files.length) {
                _this.onFileChange(_this.files[0]);
            }
        });
    };
    FileSelector.prototype.onFileChange = function (file) {
        this.currentFile = file;
        this.reactToFile();
    };
    return FileSelector;
}(descriptor_selector_1.DescriptorSelector));
exports.FileSelector = FileSelector;
