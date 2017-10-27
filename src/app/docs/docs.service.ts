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

import {Doc} from './doc.model';

export class DocsService {
  private docs: Doc[] = [
    new Doc('getting-started-with-docker',
                      'This tutorial walks through how to create a Docker image',
                      'Getting Started with Docker'),
    new Doc('getting-started-with-cwl',
                      'This tutorial walks through how to describe a Docker image with CWL',
                      'Getting Started with CWL'),
    new Doc('getting-started-with-dockstore',
                       'This tutorial walks through how to register at Dockstore and then share simple tools',
                       'Getting Started with Dockstore'),
    new Doc('docker_registries',
                      `This page talks about the various Docker registries supported by Dockstore,
                      and the best practices for using these registries.`,
                      'Docker Registries') ,
    new Doc('public_private_tools',
                      'This page talks about the difference between public and private Dockstore tools.',
                      'Public and Private Tools'),
    new Doc('about',
                       'This document gives background on Dockstore and what we are trying to accomplish',
                       'About Dockstore'),
    new Doc('workflows',
                      'This tutorial walks through how to register and share more complex workflows',
                      'Workflows'),
    new Doc('launch',
                      'This tutorial walks through how to launch tools and workflows hosted at Dockstore',
                      'Launching Tools and Workflows'),
    new Doc('blog',
                      'Dockstore news and events',
                      'News and Events'),
    new Doc('advanced-features',
                      `This page covers our recommended best practices for CWL-based tools and workflows`,
                      'Advanced Features'),
    new Doc('best-practices',
      `This page introduces advanced features of Dockstore that may make using
                      or developing Dockstore tools more convenient`,
      'Best Practices '),
    new Doc('faq',
      'This page gathers tools and tips on using Dockstore along with tips on creating tools with Docker and CWL 1.0',
      'FAQ'),
    new Doc('user-created',
      'This page gathers user-created code and documentation for how to work with Dockstore formatted tools in various contexts',
      'User Created Projects'),
    new Doc('developers',
      'This page is for developers working with Dockstore',
      'For Developers'),
    new Doc('aws-batch-tutorial',
      'This page is for users of AWS, specifically AWS Batch',
      'AWS Batch'),
    new Doc('azure-batch-tutorial',
      'This page is for users of Azure, specifically Azure Batch',
      'Azure Batch'),
    new Doc('search',
      'This page is for information on facited search.',
      'Facited Search')
  ];

  getDocs(): Doc[] {
    return this.docs;
  }

  getDoc(slug: string): Doc {
    return this.docs.find(x => x.getSlug() === slug);
  }
}
