Note:
In order to use the line number feature plug-in (highlightjs-line-numbers.js), 
we needed to embed angular2-highlight-js into our local repo. Please note that the file "highlight-js.service.js" has been modified.
More specifically, lineNumbersBlock was added after highlightBlock.
#### Original:
```javascript
hljs.highlightBlock(codeBlock);
```

#### Current, which use line number:
```javascript
hljs.highlightBlock(codeBlock);
hljs.lineNumbersBlock(codeBlock);
```
We also modified the path in "highlight-js.module.js.map", "highlight-js.service.js.map", and "highlight-js-content.directive.js.map"
in-order pointing to the correct ts files after moving the library to the local repo.

Importing this Module/Service should be like:
```javascript
import { HighlightJsService } from 'PATH/shared/angular2-highlight-js/lib/highlight-js.module';
```

The current version of this library is 5.0.1.

