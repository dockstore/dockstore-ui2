"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DateService = DateService_1 = (function () {
    function DateService() {
    }
    // get a message containing both the day and time of day
    DateService.prototype.getDateTimeMessage = function (timestamp, dateOnly) {
        if (dateOnly === void 0) { dateOnly = false; }
        var dateString = 'n/a';
        if (timestamp) {
            var date = new Date(timestamp);
            dateString = DateService_1.months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
            if (!dateOnly) {
                dateString += ' at ' + date.toLocaleTimeString();
            }
        }
        return dateString;
    };
    DateService.prototype.getTime = function (timestamp, convert) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / convert);
    };
    /*Note: change this link if necessary */
    DateService.prototype.getVerifiedLink = function () {
        return '/docs/faq#what-is-a-verified-tool-or-workflow-';
    };
    DateService.prototype.getAgoMessage = function (timestamp) {
        if (timestamp) {
            var msToMins = 1000 * 60;
            var msToHours = msToMins * 60;
            var msToDays = msToHours * 24;
            var time = this.getTime(timestamp, msToDays);
            if (time < 1) {
                time = this.getTime(timestamp, msToHours);
                if (time < 1) {
                    time = this.getTime(timestamp, msToMins);
                    if (time < 1) {
                        return '< 1 minute ago';
                    }
                    else {
                        return time + ((time === 1) ? ' minute ago' : ' minutes ago');
                    }
                }
                else {
                    return time + ((time === 1) ? ' hour ago' : ' hours ago');
                }
            }
            else {
                return time + ((time === 1) ? ' day ago' : ' days ago');
            }
        }
        else {
            return 'n/a';
        }
    };
    return DateService;
}());
DateService.months = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
    'May', 'Jun.', 'Jul.', 'Aug.',
    'Sept.', 'Oct.', 'Nov.', 'Dec.'];
DateService = DateService_1 = __decorate([
    core_1.Injectable()
], DateService);
exports.DateService = DateService;
var DateService_1;
