# News and Events

## February 31, 2017 - Dockstore 1.2 Release

### Highlighted New Features and Fixes

* Allow users to star tools and workflows
* Stargazers page to show all users who have starred a particular tool or workflow

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
