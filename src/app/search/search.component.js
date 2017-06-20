"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var elasticsearch_1 = require("elasticsearch");
var SearchComponent = (function () {
    function SearchComponent(communicatorService) {
        this.communicatorService = communicatorService;
        this.buckets = new Map();
        this.initialQuery = '{"aggs":{"_type":{"terms":{"field":"_type","size":10000}},"registry":{"terms":{"field":"registry","size":10000}},"private_access":{"terms":{"field":"private_access","size":10000}},"tags_verified":{"terms":{"field":"tags.verified","size":10000}},"author":{"terms":{"field":"author","size":10000}},"namespace":{"terms":{"field":"namespace","size":10000}},"labels_value":{"terms":{"field":"labels.value","size":10000}},"tags_verifiedSource":{"terms":{"field":"tags.verifiedSource","size":10000}}},"query":{"match_all":{}}}';
        this.filters = new Map();
        this.bucketStubs = new Map([
            ['Entry Type', '_type'],
            ['Registry', 'registry'],
            ['Private Access', 'private_access'],
            ['Verified', 'tags.verified'],
            ['Author', 'author'],
            ['Organization', 'namespace'],
            ['Labels', 'labels.value'],
            ['Verified Source', 'tags.verifiedSource'],
        ]);
        this.values = '';
        this._client = new elasticsearch_1.Client({
            host: 'http://localhost:8080/api/ga4gh/v1/extended',
            apiVersion: '2.4',
            log: 'trace'
        });
    }
    SearchComponent.prototype.ngOnInit = function () {
        this.onEnter(this.initialQuery);
    };
    SearchComponent.prototype.onEnter = function (value) {
        var _this = this;
        this._client.search({
            index: 'tools',
            type: 'entry',
            body: value
        }).then(function (hits) {
            _this.hits = hits.hits.hits;
            _this.aggs = JSON.stringify(hits.aggregations, null, 2);
            var _loop_1 = function (property) {
                if (hits.aggregations.hasOwnProperty(property)) {
                    // loop through contents buckets
                    var category = hits.aggregations[property];
                    // look for top level buckets (no filtering)
                    if (category.buckets != null) {
                        category.buckets.forEach(function (bucket) {
                            if (_this.buckets.get(property) == null) {
                                _this.buckets.set(property, new Map());
                            }
                            _this.buckets.get(property).set(bucket.key, bucket.doc_count);
                        });
                    }
                    var _loop_2 = function (nestedProperty) {
                        if (category.hasOwnProperty(nestedProperty)) {
                            // this is copied and pasted, make this better
                            var nestedCategory = category[nestedProperty];
                            // look for top level buckets (no filtering)
                            if (nestedCategory != null && nestedCategory.buckets != null) {
                                nestedCategory.buckets.forEach(function (bucket) {
                                    if (_this.buckets.get(nestedProperty) == null) {
                                        _this.buckets.set(nestedProperty, new Map());
                                    }
                                    _this.buckets.get(nestedProperty).set(bucket.key, bucket.doc_count);
                                });
                            }
                        }
                    };
                    // look for second level buckets (with filtering)
                    for (var nestedProperty in category) {
                        _loop_2(nestedProperty);
                    }
                }
            };
            for (var property in hits.aggregations) {
                _loop_1(property);
            }
        });
    };
    SearchComponent.prototype.handleFilters = function (category, categoryValue) {
        console.log(category + ' ' + categoryValue);
        if (this.filters.has(category) && this.filters.get(category).has(categoryValue)) {
            this.filters.get(category).delete(categoryValue);
            // wipe out the category if empty
            if (this.filters.get(category).size === 0) {
                this.filters.delete(category);
            }
        }
        else {
            if (!this.filters.has(category)) {
                this.filters.set(category, new Set());
            }
            this.filters.get(category).add(categoryValue);
        }
    };
    SearchComponent.prototype.onClick = function (category, categoryValue) {
        if (category !== null && categoryValue !== null) {
            this.handleFilters(category, categoryValue);
        }
        // assemble a query and pretend to click
        var queryWrapper = new QueryWrapper();
        var t = {};
        // calculate number of filters
        var count = 0;
        this.filters.forEach(function (filter) {
            count += filter.size;
        });
        var boolFilter = new BoolFilter();
        if (count === 1) {
            category = this.filters.keys().next().value.toString();
            categoryValue = this.filters.get(category).values().next().value.toString();
            var modifiedFilterValue = category.substring(0, 1) + category.substring(1).replace('_', '.');
            queryWrapper.filter = new SingleFilter();
            t[modifiedFilterValue] = [];
            t[modifiedFilterValue][0] = [];
            t[modifiedFilterValue][0] = categoryValue;
            queryWrapper.filter = {};
            queryWrapper.filter.terms = t;
        }
        else if (count > 1) {
            boolFilter.bool['must'] = [];
            var _loop_3 = function (key) {
                var filter = this_1.filters.get(key);
                filter.forEach(function (insideFilter) {
                    var modifiedInnerFilterValue = key.substring(0, 1) + key.substring(1).replace('_', '.');
                    var terms = {};
                    terms[modifiedInnerFilterValue] = [];
                    terms[modifiedInnerFilterValue].push(insideFilter);
                    var termsWrapper = {};
                    termsWrapper['terms'] = terms;
                    boolFilter.bool['must'].push(termsWrapper);
                });
            };
            var this_1 = this;
            for (var _i = 0, _a = Array.from(this.filters.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                _loop_3(key);
            }
            queryWrapper.filter = boolFilter;
        }
        // if there is a description search
        if (this.values.toString().length > 0) {
            queryWrapper['query'] = {};
            queryWrapper['query']['match'] = {};
            queryWrapper['query']['match']['description'] = {};
            queryWrapper['query']['match']['description']['query'] = this.values;
        }
        else {
            queryWrapper['query'] = new Query();
        }
        // go through buckets
        queryWrapper.aggs = {};
        this.bucketStubs.forEach(function (key) {
            var modifiedKey = key.replace('.', '_');
            queryWrapper.aggs[modifiedKey] = {};
            queryWrapper.aggs[modifiedKey].aggs = {};
            queryWrapper.aggs[modifiedKey].aggs[modifiedKey] = {};
            queryWrapper.aggs[modifiedKey].aggs[modifiedKey].terms = new AggTerms();
            queryWrapper.aggs[modifiedKey].aggs[modifiedKey].terms.field = key;
            queryWrapper.aggs[modifiedKey].filter = {};
            // next, add the filtering clauses
            if (count === 1) {
                queryWrapper.aggs[modifiedKey].filter.terms = t;
            }
            else if (count > 1) {
                queryWrapper.aggs[modifiedKey].filter = boolFilter;
            }
        });
        this.buckets.clear();
        var query = JSON.stringify(queryWrapper, null, 2);
        console.log(query);
        this.onEnter(query);
    };
    SearchComponent.prototype.resetFilters = function () {
        this.filters.clear();
        this.onEnter(this.initialQuery);
    };
    SearchComponent.prototype.sendToolInfo = function (tool) {
        this.communicatorService.setTool(tool);
    };
    SearchComponent.prototype.onKey = function (value) {
        this.values = value;
        this.onClick(null, null);
    };
    return SearchComponent;
}());
SearchComponent = __decorate([
    core_1.Component({
        selector: 'app-search',
        templateUrl: './search.component.html',
        styleUrls: ['./search.component.css']
    })
], SearchComponent);
exports.SearchComponent = SearchComponent;
var Match = (function () {
    function Match() {
    }
    return Match;
}());
exports.Match = Match;
var Query = (function () {
    function Query() {
        this.match_all = new Match();
    }
    return Query;
}());
exports.Query = Query;
var AggTerms = (function () {
    function AggTerms() {
        this.size = 10000;
    }
    return AggTerms;
}());
exports.AggTerms = AggTerms;
var SingleFilter = (function () {
    function SingleFilter() {
        this.terms = [];
    }
    return SingleFilter;
}());
exports.SingleFilter = SingleFilter;
var BoolFilter = (function () {
    function BoolFilter() {
        this.bool = {};
    }
    return BoolFilter;
}());
exports.BoolFilter = BoolFilter;
var QueryWrapper = (function () {
    function QueryWrapper() {
    }
    return QueryWrapper;
}());
exports.QueryWrapper = QueryWrapper;
