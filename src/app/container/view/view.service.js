"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ViewService = (function () {
    function ViewService() {
        this.mode = new BehaviorSubject_1.BehaviorSubject(null);
        this.unsavedTestCWLFile = new BehaviorSubject_1.BehaviorSubject('');
        this.unsavedTestWDLFile = new BehaviorSubject_1.BehaviorSubject('');
    }
    ViewService.prototype.setCurrentMode = function (mode) {
        this.mode.next(mode);
    };
    ViewService.prototype.setCurrentUnsavedTestWDLFile = function (file) {
        this.unsavedTestWDLFile.next(file);
    };
    ViewService.prototype.setCurrentUnsavedTestCWLFile = function (file) {
        this.unsavedTestCWLFile.next(file);
    };
    ViewService.prototype.getSizeString = function (size) {
        var sizeStr = '';
        if (size) {
            var exp = Math.log(size) / Math.log(2);
            if (exp < 10) {
                sizeStr = size.toFixed(2) + ' bytes';
            }
            else if (exp < 20) {
                sizeStr = (size / Math.pow(2, 10)).toFixed(2) + ' kB';
            }
            else if (exp < 30) {
                sizeStr = (size / Math.pow(2, 20)).toFixed(2) + ' MB';
            }
            else if (exp < 40) {
                sizeStr = (size / Math.pow(2, 30)).toFixed(2) + ' GB';
            }
        }
        return sizeStr;
    };
    return ViewService;
}());
exports.ViewService = ViewService;
