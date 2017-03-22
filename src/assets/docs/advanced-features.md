# Advanced Features

## File Provisioning

As a convenience, the dockstore command-line can perform file provisioning for inputs and outputs.

For example, for this [tool](https://dockstore.org/containers/quay.io/collaboratory/dockstore-tool-bamstats) we provide a couple of parameter files that can be used to parameterize a run of bamstats.

In the following JSON file, this file indicates for a CWL run that the input file should be present and readable at `/tmp/NA12878.chrom20.ILLUMINA.bwa.CEU.low_coverage.20121211.bam`. The output file will be copied to `/tmp/bamstats_report.zip` (which should be writeable).

```
{
  "bam_input": {
        "class": "File",
        "path": "/tmp/NA12878.chrom20.ILLUMINA.bwa.CEU.low_coverage.20121211.bam"
    },
    "bamstats_report": {
        "class": "File",
        "path": "/tmp/bamstats_report.zip"
    }
}
```

The Dockstore command-line allows you to specify that the input file can be at a http(s) location, an ftp location, an AWS S3 location, a [synapse id](http://python-docs.synapse.org/#accessing-data), or an [ICGC storage id](http://docs.icgc.org/cloud/guide/#cloud-guide) in place of that path. For example the following indicates that the input file will be downloaded under http.

```
{
  "bam_input": {
        "class": "File",
        "path": "https://s3.amazonaws.com/oconnor-test-bucket/sample-data/NA12878.chrom20.ILLUMINA.bwa.CEU.low_coverage.20121211.bam"
    },
    "bamstats_report": {
        "class": "File",
        "path": "/tmp/bamstats_report.zip"
    }
}
```

Provisioning for output files works in the same way and has been tested with S3 output locations.

For some file provisioning methods, additional configuration may be required.

### AWS S3

For AWS S3, create a `~/.aws/credentials` file and a `~/.aws/config` file as documented at the following [location](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files).

### ICGC Storage

For ICGC Storage, configure the location of the client using the configuration key `dcc_storage.client` in `~/.dockstore/config`. Then configure the ICGC storage client as documented [here](http://docs.icgc.org/cloud/guide/#configuration).

### Synapse

For Synapse, you can add `synapse-api-key` and `synapse-user-name` to `~/.dockstore/config`.


## Input File Cache

When developing or debugging tools, it can be time consuming (and space-consuming) to repeatedly download input files for your tools. A feature of the Dockstore CLI is the ability to cache input files locally so that they can be quickly re-used for multiple attempts at launching a tool.

This feature relies upon Linux [hard-linking](https://en.wikipedia.org/wiki/Hard_link) so when enabling this feature, it is important to ensure that the location of the cache directory (by default, at `~/.dockstore/cache/`) is on the same filesystem as the working directory where you intend on running your tools.

There are two configuration file keys that can be used to activate input file caching and to configure the location of the cache.  These are added (or changed) inside your configuration file at `~/.dockstore/config`.

```
use-cache = true
cache-dir =
```

The former is false by default and can be set to true in order to activate the cache.
The latter is `~/.dockstore/cache/` by default and can be set to any directory location.

## Running CWL-runner with extra tags

When running a CWL tool, you may want to add additional parameters/flags to the cwl-runner command. You can do this by updating your dockstore config file (~/.dockstore/config).

As an example, adding the following line to your config file will stop cwl-runner from cleaning up, make it run in debug mode, and set the outdir to '/new/outputdir'

```
cwltool-extra-parameters: --debug, --leave-container, --leave-tmpdir, --outdir /new/outputdir
```
