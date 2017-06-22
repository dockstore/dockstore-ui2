"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileService = (function () {
    function FileService() {
    }
    /* Highlight Code */
    FileService.prototype.highlightCode = function (code) {
        return '<pre><code class="yaml highlight">' + code + '</pre></code>';
    };
    return FileService;
}());
exports.FileService = FileService;
