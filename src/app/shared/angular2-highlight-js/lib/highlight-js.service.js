/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var HighlightJsService = (function () {
    function HighlightJsService() {
    }
    HighlightJsService.prototype.highlight = function (codeBlock, useBr) {
        if (useBr) {
            hljs.configure({ useBR: true });
        }
        hljs.highlightBlock(codeBlock);
        hljs.lineNumbersBlock(codeBlock);
    };
    return HighlightJsService;
}());
HighlightJsService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
HighlightJsService.ctorParameters = function () { return []; };
exports.HighlightJsService = HighlightJsService;
//# sourceMappingURL=highlight-js.service.js.map
