# Launching Tools and Workflows

This tutorial walks through some of our utilities for quickly launching tools and workflows in a naive way.

## Dockstore CLI

The dockstore command-line includes basic tool and workflow launching capability built on top of [cwltool](https://github.com/common-workflow-language/cwltool). The Dockstore command-line also includes support for file provisioning via [plugins](https://github.com/ga4gh/dockstore/tree/develop/dockstore-file-plugin-parent) which allow for the reading of input files and the upload of output files from remote file systems. Support for http and https is built-in. Support for AWS S3 and icgc-storage client is provided via plugins that can be easily installed.  
 
### Launch Tools

If you have followed the tutorial, you will have a tool registered on Dockstore. You may want to test it out for your own work. Alternatively, if you followed the quick start, you can use the demo tool shown below.

To do this, we already have everything we need with *two exceptions* -- we need to specify the input and output files, and we need an input file to run!  To do this,  we need to create a
JSON file containing that information.

Conveniently the required information is actually specified in the CWL description file for this task, so we can automatically generate a template like so:

```
# make a runtime JSON template and fill in desired inputs, outputs, and other parameters
$ dockstore tool convert entry2json --entry quay.io/collaboratory/dockstore-tool-bamstats:1.25-6_1.0 > Dockstore.json
```
Edit the resulting file `params.json` and replace the `path` for `bam_input` (which defaults to `/tmp/fill_me_in.txt`)

```
$ vim Dockstore.json
# note that the empty JSON config file has been filled with an input file retrieved via http
$ cat Dockstore.json
{
  "mem_gb": 4,
  "bam_input": {
    "path": "https://github.com/CancerCollaboratory/dockstore-tool-bamstats/raw/develop/rna.SRR948778.bam",
    "format": "http://edamontology.org/format_2572",
    "class": "File"
  },
  "bamstats_report": {
    "path": "/tmp/bamstats_report.zip",
    "class": "File"
  }
}
```

Note that any BAM file will work as long as it's accessible!

We also have to specify the output by changing the `bamstats_report` path, but here we get to make it anything we want (as long as it's in a valid directory). I suggest `/tmp/bamstats_report.zip`.<sup>1</sup>

```
$ dockstore tool launch --entry quay.io/collaboratory/dockstore-tool-bamstats:1.25-6_1.0 --json Dockstore.json
```

This information is also provided in the "Launch With" section of every tool. 

This command will now:
* download the CWL description for that task from the dockstore;
* pull down the docker container for that task;
* download the BAM data file to the local computer;
* execute the specified task;
* place the results in the specified location.

The results should be a zipfile - you can try `unzip -v /tmp/bamstats_report.zip` to see its contents.

<sup>1</sup> Note that you can also get input from and output to locations like AWS S3 and ICGC Storage by using file provisioning plugins documented [here](https://dockstore.org/docs/advanced-features#file-provisioning). Remember to either run `dockstore plugin download` to install default plugins or install your own plugins in this case

### Launch Workflows

A parallel set of commands is available for workflows. `convert`, `wdl`, `cwl`, and `launch` are all available under the `dockstore workflow` mode.

## cwltool

If you are working with cwltool directly, you can still launch tools without using the Dockstore CLI as long as 
your input files are available locally. The equivalent of the previous example would be:

```
$ wget https://github.com/CancerCollaboratory/dockstore-tool-bamstats/raw/develop/rna.SRR948778.bam
# make a runtime JSON template and fill in desired inputs, outputs, and other parameters
$ dockstore tool convert entry2json --entry quay.io/collaboratory/dockstore-tool-bamstats:1.25-6_1.0 > Dockstore.json
$ vim Dockstore.json
# note that the empty JSON config file has been filled with a local input file 
$ cat Dockstore.json
{
  "mem_gb": 4,
  "bam_input": {
    "path": "rna.SRR948778.bam",
    "format": "http://edamontology.org/format_2572",
    "class": "File"
  },
  "bamstats_report": {
    "path": "/tmp/bamstats_report.zip",
    "class": "File"
  }
}
# run it locally with cwltool
$ cwltool --non-strict https://www.dockstore.org:8443/api/ga4gh/v1/tools/quay.io%2Fcollaboratory%2Fdockstore-tool-bamstats/versions/1.25-6_1.0/plain-CWL/descriptor Dockstore.json
```

A similar invocation can be attempted in other CWL-compatible systems. 

You can stop here if you simply want to run tools and workflows locally. Continue onwards to learn more about possible solutions for running tools and workflows in large volumes. 

## Batch Services 

Dockstore tools and workflows can also be run through a number of online services that we're going to loosely call "commercial batch services." These services share the following characteristics: they spin up the underlying infrastructure and run commands, often in Docker containers, while freeing you from running the batch computing software yourself. While not having any understanding of CWL, these services can be used naively to run tools and workflows, and in a more sophisticated way to implement a CWL-compatible workflow engine.  

### AWS Batch

[AWS Batch](https://aws.amazon.com/batch/) is built by Amazon Web Services. Look [here](/docs/aws-batch-tutorial) for a tutorial on how to run a few sample tools via AWS. 

### Azure Batch

[Azure Batch](https://azure.microsoft.com/en-us/services/batch/) and the associated [batch-shipyard](https://github.com/Azure/batch-shipyard) is built by Microsoft. Look [here](/docs/azure-batch-tutorial) for a tutorial on how to run a few sample tools via Azure. 

### Google Pipelines 

Google Pipeline and [Google dsub](https://github.com/googlegenomics/dsub) are also worth a look. In particular, both [Google Genomics Pipelines](https://cloud.google.com/genomics/v1alpha2/pipelines) and [dsub](https://cloud.google.com/genomics/v1alpha2/dsub) provide tutorials on how to run  (Dockstore!) tools if you have some knowledge on how to construct the command-line for a tool yourself. 

## Consonance 

Consonance pre-dates Dockstore and was the framework used to run much of the data analysis for the [PCAWG](https://dcc.icgc.org/pcawg#!%2Fmutations) project by running [Seqware](https://seqware.github.io/) workflows. Documentation for this incarnation of Dockstore can be found at [Working with PanCancer Data on AWS](http://icgc.org/working-pancancer-data-aws) and [ICGC on AWS](https://aws.amazon.com/public-datasets/icgc/).

Consonance has subsequently been updated to run Dockstore tools and has also been adopted at the [UCSC Genomics Institute](https://github.com/BD2KGenomics/dcc-ops) for this purpose. Also using cwltool under-the-hood to provide CWL compatibility, Consonance provides DIY open-source support for provisioning AWS VMs and starting CWL tasks. We recommend having some knowledge of AWS EC2 before attempting this route. 

Consonance's strategy is to provision either on-demand VMs or spot priced VMs depending on cost and delegates runs of CWL tools to these provisioned VMs with one tool executing per VM. A Java-based web service and RabbitMQ provide for communication between workers and the launcher while an Ansible playbook is used to setup workers for execution.
 
### Usage
 
1. Look at the [Consonance](https://github.com/Consonance/consonance) repo and in particular, the [Docker compose based](https://github.com/Consonance/consonance/tree/develop/container-admin) setup instructions to setup the environment
2. Once logged into the client
```
$ consonance run --tool-dockstore-id quay.io/collaboratory/dockstore-tool-bamstats:1.25-6_1.0 --run-descriptor Dockstore.json --flavour <AWS instance-type>
```


## Next Steps

While launching tools and workflows locally is useful for testing, this approach is not useful for processing a large amount of data in a production environment. The next step is to take our Docker images, described by CWL/WDL and run them in an environment that supports those descriptors. For now, we can suggest taking a look at the environments that currently support and are validated with CWL at [https://ci.commonwl.org/](https://ci.commonwl.org/) and for WDL, [Cromwell](https://github.com/broadinstitute/cromwell).

For developers, you may also wish to look at general commercial solutions such as [Google dsub](https://github.com/googlegenomics/task-submission-tools) and [AWS Batch](https://aws.amazon.com/batch/). 

If you wish to learn more about Dockstore from the perspective of a tool or workflow developer, you are also welcome to pick up from [Getting Started With Docker](docs/getting-started-with-docker).
