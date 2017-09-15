import { Doc } from './doc.model';

export class DocsService {
  private docs: Doc[] = [
    new Doc('getting-started',
                      'This tutorial walks through how to create your tool development environment',
                      'Getting Started'),
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
                      `This page introduces advanced features of Dockstore that may make using
                      or developing Dockstore tools more convenient`,
                      'Advanced Features'),
    new Doc('faq',
                      'This page gathers tools and tips on using Dockstore along with tips on creating tools with Docker and CWL 1.0',
                      'FAQ')
  ];

  getDocs(): Doc[] {
    return this.docs;
  }

  getDoc(slug: string): Doc {
    return this.docs.find(x => x.getSlug() === slug);
  }
}
