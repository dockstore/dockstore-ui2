import * as ace from '../../../../node_modules/ace-builds/src-min-noconflict/ace.js'
'use strict';

// CWL Grammar
ace.define("ace/mode/cwl_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/yaml_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var YamlHighlightRules = require("./yaml_highlight_rules").YamlHighlightRules;

var CWLHighlightRules = function() {
    // NOTE: To update CWL highlighting, replace this.$rules = ... with the new highlighting rules
    this.$rules = {
        start: [{
            token: "string.quoted.single.cwl",
            regex: /'/,
            push: [{
                token: "string.quoted.single.cwl",
                regex: /'/,
                next: "pop"
            }, {
                token: "constant.character.escape.cwl",
                regex: /\./
            }, {
                defaultToken: "string.quoted.single.cwl"
            }]
        }, {
            token: "string.quoted.double.cwl",
            regex: /"/,
            push: [{
                token: "string.quoted.double.cwl",
                regex: /"/,
                next: "pop"
            }, {
                token: "constant.character.escape.cwl",
                regex: /\./
            }, {
                defaultToken: "string.quoted.double.cwl"
            }]
        }, {
            token: "keyword.control.cwl",
            regex: /\b(?:inputs|outputs|steps|id|requirements|hints|label|doc|secondaryFiles|streamable|outputBinding|format|outputSource|linkMerge|type|glob|loadContents|outputEval|merge_nested|merge_flattened|location|path|basename|dirname|nameroot|nameext|checksum|size|format|contents|listing|fields|symbols|items|in|out|run|scatter|scatterMethod|source|default|valueFrom|expressionLib|types|linkMerge|inputBinding|position|prefix|separate|itemSeparator|valueFrom|shellQuote|packages|package|version|specs|entry|entryname|writable|baseCommand|arguments|stdin|stderr|stdout|successCodes|temporaryFailCodes|permanentFailCodes|dockerLoad|dockerFile|dockerImport|dockerImageId|dockerOutputDirectory|envDef|envName|envValue|coresMin|coresMax|ramMin|ramMax|tmpdirMin|tmpdirMax|outdirMin|outdirMax)(?=:)/
        }, {
            token: "cwlVersion.keyword.control.cwl",
            regex: /cwlVersion:/,
            push: [{
                token: "cwlVersion.definition.string.end.cwl",
                regex: /$/,
                next: "pop"
            }, {
                token: "storage.constant.cwl",
                regex: /\b(?:draft-2|draft-3.dev1|draft3-dev2|draft3-dev3|draft3-dev4|draft3-dev5|draft3|draft4.dev1|draft4.dev2|draft4.dev3|v1.0.dev4|v1.0)\b/
            }, {
                defaultToken: "cwlVersion.cwl"
            }]
        }, {
            token: "dockerPull.keyword.control.cwl",
            regex: /dockerPull:/,
            push: [{
                token: "dockerPull.definition.string.end.cwl",
                regex: /$/,
                next: "pop"
            }, {
                token: "storage.variable.cwl",
                regex: /\b.*$/
            }, {
                defaultToken: "dockerPull.cwl"
            }]
        }, {
            token: "class.keyword.control.cwl",
            regex: /class:/,
            push: [{
                token: "class.definition.string.end.cwl",
                regex: /$/,
                next: "pop"
            }, {
                token: "support.type.cwl",
                regex: /\b(?:CommandLineTool|ExpressionTool|Workflow|InlineJavascriptRequirement|SchemaDefRequirement|DockerRequirement|SoftwareRequirement|InitialWorkDirRequirement|EnvVarRequirement|ShellCommandRequirement|ResourceRequirement)\b/
            }, {
                defaultToken: "class.cwl"
            }]
        }, {
            token: "storage.type.cwl",
            regex: /:\s+(?:null|boolean|int|long|float|double|string|File|Directory)\b/
        }, {
            token: "comment.line.number-sign.cwl",
            regex: /#.*$/
        }]
    }

    this.normalizeRules();
};

CWLHighlightRules.metaData = {
    fileTypes: ["cwl"],
    name: "CWL",
    scopeName: "source.cwl"
}

oop.inherits(CWLHighlightRules, YamlHighlightRules);

exports.CWLHighlightRules = CWLHighlightRules;
});

ace.define('ace/mode/cwl',["require","exports","module","ace/lib/oop","ace/mode/yaml_highlight_rules"], function(require, exports, module) {

  var oop = require("../lib/oop");
  var YamlHighlightRules = require("./yaml_highlight_rules").YamlHighlightRules;
  var TextMode = require("./text").Mode;

var CWLHighlightRules = require("ace/mode/cwl_highlight_rules").CWLHighlightRules;

var Mode = function() {
    this.HighlightRules = CWLHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    // Extra logic goes here. (see below)
}).call(Mode.prototype);

exports.Mode = Mode;
});

// WDL Grammar
ace.define("ace/mode/wdl_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/yaml_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var YamlHighlightRules = require("./yaml_highlight_rules").YamlHighlightRules;

var WDLHighlightRules = function() {
    // NOTE: To update WDL highlighting, replace this.$rules = ... with the new highlighting rules
    this.$rules = {
        start: [{
            token: "keyword.operator.assignment.wdl",
            regex: /\=/
        }, {
            token: "keyword.operator.comparison.wdl",
            regex: /<\=|>\=|\=\=|<|>|\!\=/
        }, {
            token: "keyword.operator.assignment.augmented.wdl",
            regex: /\+\=|-\=|\*\=|\/\=|\/\/\=|%\=|&\=|\|\=|\^\=|>>\=|<<\=|\*\*\=/
        }, {
            token: "keyword.operator.arithmetic.wdl",
            regex: /\+|\-|\*|\*\*|\/|\/\/|%|<<|>>|&|\||\^|~/
        }, {
            token: "constant.language.wdl",
            regex: /\b(?:true|false)\b/
        }, {
            include: "#builtin_types"
        }, {
            include: "#comments"
        }, {
            include: "#input_output"
        }, {
            include: "#keywords"
        }, {
            include: "#string_quoted_single"
        }, {
            include: "#string_quoted_double"
        }, {
            include: "#command_block"
        }],
        "#builtin_types": [{
            token: "support.type.wdl",
            regex: "(?:[^A-Za-z0-9_\.])(?:Array|Boolean|File|Float|Int|Map|Object|String|Pair)\\b",
        }],
        "#command_block": [{
            token: [
                "keyword.other.wdl",
                "command.block.wdl",
                "command.block.wdl"
            ],
            regex: /(command)(\s*\{)((?:$|\s)*)/,
            push: [{
                token: "command.block.wdl",
                regex: /(?:^|\s+)\}/,
                next: "pop"
            }, {
                defaultToken: "command.block.wdl"
            }],
            comment: "command {}"
        }, {
            token: [
                "keyword.other.wdl",
                "command.block.wdl",
                "command.block.wdl"
            ],
            regex: /(command)(\s*<{3})((?:$|\s)*)/,
            push: [{
                token: "command.block.wdl",
                regex: /(?:^|\s+)>{3}/,
                next: "pop"
            }, {
                defaultToken: "command.block.wdl"
            }],
            comment: "command <<< >>>"
        }],
        "#comments": [{
            token: [
                "punctuation.definition.comment.wdl",
                "comment.line.number-sign.wdl"
            ],
            regex: /(#)(.*$)/
        }],
        "#constant_placeholder": [{
            token: "constant.other.placeholder.wdl",
            regex: /%(?:\([a-z_]+\))?#?0?\-?[ ]?\+?(?:[0-9]*|\*)(?:\.(?:[0-9]*|\*))?[hL]?[a-z%]/,
            caseInsensitive: true
        }],
        "#escaped_char": [{
            token: [
                "constant.character.escape.hex.wdl",
                "constant.character.escape.octal.wdl",
                "constant.character.escape.newline.wdl",
                "constant.character.escape.backlash.wdl",
                "constant.character.escape.double-quote.wdl",
                "constant.character.escape.single-quote.wdl",
                "constant.character.escape.bell.wdl",
                "constant.character.escape.backspace.wdl",
                "constant.character.escape.formfeed.wdl",
                "constant.character.escape.linefeed.wdl",
                "constant.character.escape.return.wdl",
                "constant.character.escape.tab.wdl",
                "constant.character.escape.vertical-tab.wdl"
            ],
            regex: /(\\x[0-9a-fA-F]{2})|(\\[0-7]{3})|(\\$)|(\\\\)|(\\\")|(\\')|(\\a)|(\\b)|(\\f)|(\\n)|(\\r)|(\\t)|(\\v)/
        }],
        "#escaped_unicode_char": [{
            token: [
                "constant.character.escape.unicode.16-bit-hex.wdl",
                "constant.character.escape.unicode.32-bit-hex.wdl",
                "constant.character.escape.unicode.name.wdl"
            ],
            regex: /(\\U[0-9A-Fa-f]{8})|(\\u[0-9A-Fa-f]{4})|(\\N\{[a-zA-Z0-9\, ]+\})/
        }],
        "#keywords": [{
            token: "keyword.other.wdl",
            regex: /(?:^|\s)(?:call|runtime|task|workflow|if|then|else|import|as|input|output|meta|parameter_meta|scatter)[^A-Za-z_]/
        }],
        "#string_quoted_double": [{
            token: "punctuation.definition.string.begin.wdl",
            regex: /"/,
            push: [{
                token: "punctuation.definition.string.end.wdl",
                regex: /"/,
                next: "pop"
            }, {
                include: "#constant_placeholder"
            }, {
                include: "#escaped_char"
            }, {
                defaultToken: "string.quoted.double.single-line.wdl"
            }],
            comment: "double quoted string"
        }],
        "#string_quoted_single": [{
            token: "punctuation.definition.string.begin.wdl",
            regex: /'/,
            push: [{
                token: "punctuation.definition.string.end.wdl",
                regex: /'/,
                next: "pop"
            }, {
                include: "#constant_placeholder"
            }, {
                include: "#escaped_char"
            }, {
                defaultToken: "string.quoted.single.single-line.wdl"
            }],
            comment: "single quoted string"
        }]
    }

    this.normalizeRules();
};

WDLHighlightRules.metaData = {
    author: "Andrew Teixeira <teixeira@broadinstitute.org>",
    fileTypes: ["wdl"],
    name: "WDL",
    scopeName: "source.wdl"
}

oop.inherits(WDLHighlightRules, YamlHighlightRules);

exports.WDLHighlightRules = WDLHighlightRules;
});
ace.define('ace/mode/wdl',["require","exports","module","ace/lib/oop","ace/mode/yaml_highlight_rules"], function(require, exports, module) {

  var oop = require("../lib/oop");
  var YamlHighlightRules = require("./yaml_highlight_rules").YamlHighlightRules;
  var TextMode = require("./text").Mode;

var WDLHighlightRules = require("ace/mode/wdl_highlight_rules").WDLHighlightRules;

var Mode = function() {
    this.HighlightRules = WDLHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    // Extra logic goes here. (see below)
}).call(Mode.prototype);

exports.Mode = Mode;
});

// NFL Grammar
ace.define("ace/mode/nfl_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules","ace/mode/groovy_highlight_rules"], function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var GroovyHighlightRules = require("./groovy_highlight_rules").GroovyHighlightRules;

  var NextflowHighlightRules = function(options) {
      var ruless =[{
              token: [
                  "process.nextflow",
                  "keyword.nextflow",
                  "process.nextflow",
                  "function.nextflow",
                  "process.nextflow"
              ],
              regex: /^(\s*)(process)(\s+)(\w+|"[^"]+"|'[^']+')(\s*)/,
              push: [{
                  token: "process.nextflow",
                  regex: /}/,
                  next: "pop"
              }, {
                  include: "#process-body"
              }, {
                  defaultToken: "process.nextflow"
              }]
          },
          {
              token: "process.body.nextflow",
              regex: /{/,
              push: [{
                  token: "process.body.nextflow",
                  regex: /(?=})/,
                  next: "pop"
              }, {
                  token: "process.directive.type.nextflow",
                  regex: /(?:afterScript|beforeScript|cache|container|cpus|clusterOptions|disk|echo|errorStrategy|executor|ext|maxErrors|maxForks|maxRetries|memory|module|penv|publishDir|queue|scratch|storeDir|stageInMode|stageOutMode|tag|time|validExitStatus)\b/
              }, {
                  token: "constant.block.nextflow",
                  regex: /(?:input|output|script|shell|exec):/
              }, {
                  defaultToken: "process.body.nextflow"
              }]
          },{
              token: "code.block.nextflow",
              regex: /{/,
              push: [{
                  token: "code.block.nextflow",
                  regex: /}/,
                  next: "pop"
              }, {
                  include: "#nfl-rules"
              }, {
                  defaultToken: "code.block.nextflow"
              }]
          }]

      var GroovyRules = new GroovyHighlightRules().getRules();

      GroovyRules.start = ruless.concat(GroovyRules.start);
      this.$rules = GroovyRules;
  };

  oop.inherits(NextflowHighlightRules, GroovyHighlightRules);

  exports.NextflowHighlightRules = NextflowHighlightRules;
  });
  ace.define('ace/mode/nfl',["require","exports","module","ace/lib/oop","ace/mode/nfl_highlight_rules","ace/mode/groovy_highlight_rules"], function(require, exports, module) {

    var oop = require("../lib/oop");
    // var TextHighlightRules = require("./nfl_highlight_rules").TextHighlightRules;
    var GroovyHighlightRules = require("./groovy_highlight_rules").GroovyHighlightRules;
    var TextMode = require("./text").Mode;

  var NextflowHighlightRules = require("ace/mode/nfl_highlight_rules").NextflowHighlightRules;

  var Mode = function() {
      this.HighlightRules = NextflowHighlightRules;
  };
  oop.inherits(Mode, TextMode);

  (function() {
      // Extra logic goes here. (see below)
  }).call(Mode.prototype);

  exports.Mode = Mode;
  });

(function() {
    ace.require(["ace/mode/wdl","ace/mode/cwl","ace/mode/nfl"], function(m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();

// Exported ace now has custom modes for CWL and WDL
export { ace };
