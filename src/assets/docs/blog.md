# News and Events

## September 20, 2017 - Dockstore 1.2.9

We're hard at work on the next major version of Dockstore. 

In the meantime, our hotfix release includes fixes for the following:
* fixes for file provisioning with the [GA4GH/DREAM challenge](https://www.synapse.org/#!Synapse:syn8507133/wiki/415976) series of workflows
* spelling and verbiage fixes, some contributed from our users
* fixes for display of test files and registry locations
* fixes for consistency with the GA4GH Tool Registry Schema

Plus the following small features
* browsing tools and workflows defaults to popularity order (starring), allowing popular tools and workflows to rise to the top
* new documentation sections highlighting posters that mention Dockstore and software projects that use or integrate with Dockstore

## August, 2017 - DNAstack Integration 

For those not following Twitter, we're pleased (and excited!) to announce our first integration with a cloud-based genomics software platform. 

Go to [Introducing Workflows, the new standard in cloud bioinformatics](https://blog.dnastack.com/introducing-workflows-the-new-standard-in-cloud-bioinformatics-787a59b1d5c6) to read more about how DNAstack makes it easier to launch and manage WDL-based workflows from both the Dockstore UI and from DNAstack directly.  

## July 11, 2017 - Dockstore 1.2.5 

Visit our [new forum](https://discuss.dockstore.org/). Discuss tools, tooling, bioinformatics cloud computing, etc. This will replace both the private OICR-based mailing list and the Disqus integration that we've been using to provide discussion and commenting on tools respectively.

Additionally, our hotfix release (with a few hidden features to be formally released later) includes fixes for the following:
 
* File provisioning changes to support GA4GH-DREAM workflows including whole directory provision 
* Fixes for workflow parameter json creation and CWL download
* Several file provisioning fixes based on user feedback
* Issues saving workflow test json files

### Breaking Changes

* We needed to clear out unpublished workflows to do some clean-up. Let us know if you had anything important stored in unpublished as opposed to published workflows.
* Potentially breaking, if a destination is not specified for a particular file, by default we will provision it to the current working directory after a warning

See more details on [GitHub](https://github.com/ga4gh/dockstore/milestone/12).

## May 5, 2017 - Upcoming Features

To give you a taste of what we're working on for the next major version of Dockstore, we're looking at features in the following main areas:

* Searching!
  * As Dockstore grows, we've noticed that our current solution for searching tools (go to [Tools](/search-containers) or [Workflows](/search-workflows) and type in the search box) is becoming less useful. Look for more useful ways to search and filter tools and workflows in the next version
* More ways to launch tools and workflows
  * We're working with partners to promote new ways to run CWL and WDL tools and workflows
* UI rewrite
  * We're currently migrating our UI from AngularJS to Angular (2), watch for performance improvements and usability improvements in this area
* Write API Web Service and Client!
  * With just a CWL descriptor and Dockerfile, this allows you to programmatically create GitHub and Quay.io repositories and then register and publish the tool on Dockstore in just 2 commands.  Publishing tools on Dockstore has gotten a lot easier.  See [GitHub](https://github.com/dockstore/write_api_service/) for more info on how to use the Write API.  See [For Developers](/docs/developers#different-ways-to-register) for information on different ways to register tools on Dockstore and when to use this Write API.

As usual, we're open to suggestions. If you have one or if you spot a bug, drop us a line on [GitHub](https://github.com/ga4gh/dockstore/issues)

## April 19, 2017 - Dockstore 1.2 Release

The latest Dockstore major release includes a large number of new features and fixes.
A subset of highlighted new features follows.

### Highlighted New Features

* Support for private tools
  * users can register tools where users will need to ask the original author for access
* Support for [private](https://dockstore.org/docs/docker_registries) Docker images hosted in GitLab and Amazon ECR
* Allow users to star tools and workflows
* Stargazers page to show all users who have starred a particular tool or workflow
* Support for [file provisioning plugins](https://github.com/ga4gh/dockstore/tree/develop/dockstore-file-plugin-parent)
* Better error messaging passed along from a newer cwltool version
* Compatibility with a Write API service for programmatically adding tools

### Breaking Changes

* The default Dockstore install no longer includes S3 support. Instead, S3 support is provided by a plugin that can be installed via `dockstore plugin download`
* The command `dockstore tool launch` used to use `--local-entry` as a flag to indicate that `--entry` was pointing at a local file. Now, it replaces `--entry`. i.e. use `dockstore tool launch --local-entry <your local file>` rather than `dockstore tool launch --local-entry --entry <your local file>`
* Update your cwltool install, details in the onboarding wizard

## February 27, 2017 - Dockstore Paper

A Dockstore paper has been published and indexed as [The Dockstore: enabling modular, community-focused sharing of Docker-based genomics tools and workflows.](https://doi.org/10.12688/f1000research.10137.1)!

## November 25, 2016 - Dockstore 1.1 Release


### Highlighted New Features and Fixes

* Greatly upgraded workflow views for CWL and WDL
* Support for GitLab as a source code repository
* Updating naive launch of WDL workflows to Cromwell 0.21 and WDL parsing code to WDL4S 0.6
* Support for multiple test json/yaml files for a tool or workflow
* Updates to common-vfs to support file provisioning from ICGC portal
* Support for administrators to verify versions of tools and workflows
* CWL generation of parameter files now supports YAML as well as JSON
* Documentation updates and tooltips!


## November 24, 2016 - Updated Tutorial Video

A new tutorial video has been published which walks through our getting started tutorial and answers some common questions.
See it [here](https://youtu.be/sInP-ByF9xU)!

## September 14, 2016 - Dockstore 1.0 Release

This date marks the launch of [Dockstore 1.0](https://github.com/ga4gh/dockstore/releases/tag/1.0). This release combines the release of several Pan-cancer workflows, tested as standardized [CWL 1.0](http://www.commonwl.org/) CommandLineTools along with several new features including support for CWL 1.0 in Dockstore itself and preliminary support for the GA4GH [tool-registry-schema](https://github.com/ga4gh/tool-registry-schemas).

### New Content

Three new workflows used to generate the [ICGC PanCancer Analysis of Whole Genomes (PCAWG)](https://dcc.icgc.org/icgc-in-the-cloud/aws) dataset have been released and validated with CWL 1.0.

These are:
* [DELLY](https://dockstore.org/containers/quay.io/pancancer/pcawg_delly_workflow) structural variation
* [Sanger](https://dockstore.org/containers/quay.io/pancancer/pcawg-sanger-cgp-workflow) somatic calling
* [DKFZ](https://dockstore.org/containers/quay.io/pancancer/pcawg-dkfz-workflow) SNVs, indels, copy number

These workflows join the first workflow used to generate this dataset, [BWA-mem](https://dockstore.org/containers/quay.io/pancancer/pcawg-bwa-mem-workflow).

### Highlighted New Features

* Support for the preliminary GA4GH [tool-registry-schema 1.0](https://github.com/ga4gh/tool-registry-schemas) will allow Dockstore to share and exchange tools with other similar projects around the world
* Upgraded support for CWL 1.0 (previously draft-3) allows Dockstore to display and launch tools
* Dockstore launcher (which allows you to run tools locally on one host) supports file provisioning based on [CWL secondary files](http://www.commonwl.org/v1.0/CommandLineTool.html#CommandInputParameter). See [Sanger](https://github.com/ICGC-TCGA-PanCancer/CGP-Somatic-Docker/blob/develop/Dockstore.cwl) for an example
* Default branch/tag support allows tool developers to pin a particular version of their tool to display to their users


## September 13, 2016 - Genome Canada Grant

The Government of Canada via Genome Canada [announces a grant for Dockstore](http://www.genomecanada.ca/en/news-and-events/news-releases/government-canada-invests-new-genomics-big-data-research-projects)!

> Parliamentary Secretary to the Minister of International Development, Karina Gould, on behalf of the Minister of Science, Kirsty Duncan, today announced an investment of $4 million in 16 new bioinformatics and computational (B/CB) biology research projects to be conducted at academic institutions across Canada. These projects will strengthen the development of new tools to help provide maximum value from research investments in genomics and related fields – areas that produce a massive and ongoing influx of data.

Also see OICR's focused [news release](https://news.oicr.on.ca/2016/09/canadian-government-makes-big-investment-in-big-data-research/)

> An unintended consequence of the development of genomics has been the proliferation of massive datasets, making analysis increasingly difficult. A further problem is the lack of standardization in how analysis tools are packaged, described and executed across computer environments. Drs. Vincent Ferretti and Lincoln Stein of the Ontario Institute for Cancer Research, in collaboration with Dr. Brian O’Connor of the University of California, Santa Cruz, have developed a web application called the Dockstore, which addresses the challenge of encapsulating and sharing bioinformatics tools so that they can be moved from environment to environment.

> Now the researchers are adding key features to the Dockstore to continue to enhance and evolve the platform. They will also integrate bioinformatics tools and workflows from the Global Alliance for Genomics and Health (GA4GH) for redistribution to the larger research community and will work with collaborators to facilitate the registration of their high-quality tools into the Dockstore. Finally, the researchers will work with other projects to enable sharing of tools across genomic repositories. These activities will drive increased usage of the Dockstore, thereby increasing tool sharing among scientists in fields as diverse as agriculture, energy and human health.


## July 9, 2016 - ISMB Tutorial

As described at [ISMB](http://www.iscb.org/cms_addon/conferences/ismb2016/akes.php)

> Dr. O’Connor will begin by discussing the ICGC PCAWG project and the insights he's gained from rapidly analyzing thousands of whole cancer genomes. Attendees will learn about how his team has used Docker as a key component to their workflow, best practices for creating shareable tools, as well as the motivation behind the creation of Dockstore (dockstore.org), a platform for sharing Docker­based tools described with the Common Workflow Language. Attendees will learn how to create custom Docker containers and push them to Dockstore to share with the community.

View the [slides](https://docs.google.com/presentation/d/1UzpqElUmF-LDs8gVzPJAi0tAtHLJJC8kQGkQzH7aEYc/edit?usp=sharing) and [youtube tutorial](https://www.youtube.com/watch?v=-JuKsSQja3g).

## November 18, 2015 - First Workflow from the PCAWG Project released

ICGC on the cloud goes live and is described on the AWS Blog at [New AWS Public Data Sets – TCGA and ICGC](https://aws.amazon.com/blogs/aws/new-aws-public-data-sets-tcga-and-icgc/) and can be visualized at [ICGC on the Amazon Cloud](https://dcc.icgc.org/icgc-in-the-cloud/aws)

The first workflow used to generate this dataset, BWA, is posted on Dockstore as a [CWL tool](https://dockstore.org/containers/quay.io/pancancer/pcawg-bwa-mem-workflow).
