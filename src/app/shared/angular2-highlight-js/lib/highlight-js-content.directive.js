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
var HighlightJsContentDirective = (function () {
    function HighlightJsContentDirective(elementRef, zone) {
        this.elementRef = elementRef;
        this.zone = zone;
    }
    HighlightJsContentDirective.prototype.ngOnInit = function () {
        if (this.useBr) {
            hljs.configure({ useBR: true });
        }
    };
    HighlightJsContentDirective.prototype.ngAfterViewChecked = function () {
        var selector = this.highlightSelector || 'code';
        if (this.elementRef.nativeElement.innerHTML && this.elementRef.nativeElement.querySelector) {
            var snippets_1 = this.elementRef.nativeElement.querySelectorAll(selector);
            this.zone.runOutsideAngular(function () {
                for (var _i = 0, snippets_2 = snippets_1; _i < snippets_2.length; _i++) {
                    var snippet = snippets_2[_i];
                    hljs.highlightBlock(snippet);
                }
            });
        }
    };
    return HighlightJsContentDirective;
}());
HighlightJsContentDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[highlight-js-content]'
            },] },
];
/** @nocollapse */
HighlightJsContentDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.NgZone, },
]; };
HighlightJsContentDirective.propDecorators = {
    'useBr': [{ type: core_1.Input },],
    'highlightSelector': [{ type: core_1.Input, args: ['highlight-js-content',] },],
};
exports.HighlightJsContentDirective = HighlightJsContentDirective;
//# sourceMappingURL=highlight-js-content.directive.js.map
