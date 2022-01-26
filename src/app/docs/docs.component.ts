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

import { Component, OnInit } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';

interface DocObject {
  existingPath: string;
  newPath: string;
}

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
})
export class DocsComponent implements OnInit {
  // Array of doc objects, where existingPath is the path on Dockstore, and newPath is the new path on the docs page
  private docMapping: DocObject[] = [
    { existingPath: '/docs/faq', newPath: '/faq' },
    { existingPath: '/docs/getting-started-with-docker', newPath: '/getting-started/getting-started-with-docker' },
    { existingPath: '/docs/getting-started-with-cwl', newPath: '/getting-started/getting-started-with-cwl' },
    { existingPath: '/docs/search', newPath: '/docs/end-user-topics/faceted-search' },
    { existingPath: '/docs/launch', newPath: '/docs/end-user-topics/launch' },
    { existingPath: '/docs/advanced-features', newPath: '/docs/advanced-topics/advanced-topics/' },
    { existingPath: '/docs/aws-batch-tutorial', newPath: '/docs/advanced-topics/aws-batch' },
    { existingPath: '/docs/azure-batch-tutorial', newPath: '/docs/advanced-topics/azure-batch' },
    { existingPath: '/docs/user-created', newPath: '/user-created' },
  ];

  public redirectLink = this.getLink();

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      window.location.href = this.getLink();
    }, 5000);
  }

  // Generate redirect link based on path
  getLink() {
    const currentPath = window.location.pathname;
    const redirectBase = Dockstore.DOCUMENTATION_URL;

    // Fallback path for docs that don't match existing paths
    let redirectPath = '/';

    // Remove trailing slash (/)
    const filteredPath = currentPath.replace(/\/$/, '');

    // Iterate over each docMapping
    const matchingDoc = this.docMapping.find(this.findDoc(filteredPath));
    if (matchingDoc != null) {
      redirectPath = matchingDoc.newPath;
    }
    return redirectBase + redirectPath + '.html';
  }

  // Returns a function to test elements of an array against a path
  findDoc(filteredPath: string) {
    return function (element: DocObject) {
      return element.existingPath === filteredPath;
    };
  }

  // Return a link with no HTTP(S)://
  getPrettyLink() {
    return this.redirectLink.replace(/(^\w+:|^)\/\//, '');
  }
}
