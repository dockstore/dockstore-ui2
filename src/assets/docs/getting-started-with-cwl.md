# Getting Started with CWL

## Describe Your Tool in CWL

Now that you have a git repository that includes a `Dockerfile`, you have tested it, and are satisfied that your tool works in Docker, the next step is to create a [CWL tool definition file](http://www.commonwl.org/). This YAML (Or JSON) file describes the inputs, outputs, and Docker image dependencies for your tool.

It is recommended that you have the following minimum fields:

    doc: <description>
    id: <id>
    label: <label>

    cwlVersion: v1.0

    dct:creator:
      foaf:name: <name>

Again, we provide an example from the [dockstore-tool-bamstats](https://github.com/CancerCollaboratory/dockstore-tool-bamstats) repository:

    #!/usr/bin/env cwl-runner

    class: CommandLineTool
    id: "BAMStats"
    label: "BAMStats tool"
    cwlVersion: v1.0
    doc: |
        ![build_status](https://quay.io/repository/collaboratory/dockstore-tool-bamstats/status)
        A Docker container for the BAMStats command. See the [BAMStats](http://bamstats.sourceforge.net/) website for more information.

    dct:creator:
      "@id": "http://orcid.org/0000-0002-7681-6415"
      foaf:name: Brian O'Connor
      foaf:mbox: "mailto:briandoconnor@gmail.com"

    requirements:
      - class: DockerRequirement
        dockerPull: "quay.io/collaboratory/dockstore-tool-bamstats:1.25-6"

    hints:
      - class: ResourceRequirement
        coresMin: 1
        ramMin: 4092 #"the process requires at least 4G of RAM
        outdirMin: 512000

    inputs:
      mem_gb:
        type: int
        default: 4
        doc: "The memory, in GB, for the reporting tool"
        inputBinding:
          position: 1

      bam_input:
        type: File
        doc: "The BAM file used as input, it must be sorted."
        format: "http://edamontology.org/format_2572"
        inputBinding:
          position: 2

    outputs:
      bamstats_report:
        type: File
        format: "http://edamontology.org/format_3615"
        outputBinding:
          glob: bamstats_report.zip
        doc: "A zip file that contains the HTML report and various graphics."


    baseCommand: ["bash", "/usr/local/bin/bamstats"]

You can see this tool takes two inputs, a parameter to control memory usage and a BAM file (binary sequence alignment file).  It produces one output, a zip file, that contains various HTML reports that BamStats creates.

There's a lot going on here.  Let's break it down.  The CWL is actually recognized and parsed by Dockstore (when we register this later). By default it recognizes `Dockstore.cwl` but you can customize this if you need to.  One of the most important items below is the [CWL version](http://www.commonwl.org/v1.0/CommandLineTool.html#CWLVersion), you should label your CWL with the version you are using so CWL tools that cannot run this version can error out appropriately. Our tools have been tested with draft-3 and v1.0 (we recommend the latter).

```
class: CommandLineTool
id: "BAMStats"
label: "BAMStats tool"
cwlVersion: v1.0
doc: |
        ![build_status](https://quay.io/repository/collaboratory/dockstore-tool-bamstats/status)
        A Docker container for the BAMStats command. See the [BAMStats](http://bamstats.sourceforge.net/) website for more information.
```

These items are recommended and the doc (description) is actually parsed and displayed in the Dockstore page. Here's an example:

![Entry](docs/entry.png)

In the code above you can see how to have an extended doc (description) which is quite useful.

```
dct:creator:
  "@id": "http://orcid.org/0000-0002-7681-6415"
  foaf:name: Brian O'Connor
  foaf:mbox: "mailto:briandoconnor@gmail.com"
```

This section includes the tool author referenced by Dockstore. It is open to your interpretation whether that is the person that registers the tool, the person who made the Docker image, or the developer of the original tool.  I'm biased towards the person that registers the tool since that is likely to be the primary contact when asking questions about how the tool was setup.

You can register for an [ORCID](http://orcid.org/) (a digital identifer for researchers) or use an email address for your id.

```
requirements:
  - class: DockerRequirement
    dockerPull: "quay.io/collaboratory/dockstore-tool-bamstats:1.25-3"
```

This section links the Docker image used to this CWL.  Notice it's exactly the same as the `-t` you used when building your image.

```
hints:
  - class: ResourceRequirement
    coresMin: 1
    ramMin: 4092 # the process requires at least 4G of RAM
    outdirMin: 512000
```

This may or may not be honoured by the tool calling this CWL but at least it gives you a place to declare computational requirements.

    inputs:
      mem_gb:
        type: int
        default: 4
        doc: "The memory, in GB, for the reporting tool"
        inputBinding:
          position: 1

      bam_input:
        type: File
        doc: "The BAM file used as input, it must be sorted."
        format: "http://edamontology.org/format_2572"
        inputBinding:
          position: 2

This is one of the items from the inputs section.  Notice a few things, first, the `bam_input:` matches with `bam_input` in the sample parameterization JSON (shown in the next section as `sample_configs.local.json`). Also, you can control the position of the variable, it can have a type (int or File here), and, for tools that require a prefix (`--prefix`) before a parameter you can use the `prefix: key` in the inputBindings section.

Also, I'm using the `format` field to specify a file format via the [EDAM](http://bioportal.bioontology.org/ontologies/EDAM) ontology.

    outputs:
      bamstats_report:
        type: File
        format: "http://edamontology.org/format_3615"
        outputBinding:
          glob: bamstats_report.zip
        doc: "A zip file that contains the HTML report and various graphics."

Finally, the outputs section defines the output files.  In this case it says in the current working directory there will be a file called `bamstats_report.zip`.  When running this tool with CWL tools the file will be copied out of the container to a location you specify in your parameter JSON file.  We'll walk though an example in the next section.

Finally, the `baseCommand` is the actual command that will be executed, in this case it's the wrapper script I wrote for bamstats.

```
baseCommand: ["bash", "/usr/local/bin/bamstats"]
```

The [CWL standard](http://www.commonwl.org/) is continuing to evolve and hopefully we will see new features, like support for [EDAM ontology](http://edamontology.org/page) terms, in future releases.  In the mean time the [Gitter chat](https://gitter.im/common-workflow-language/common-workflow-language) is an active community to help drive the development of CWL in positive directions and we recommend tool authors make their voices heard.

## Testing Locally

So at this point you've created a Docker-based tool and have described how to call that tool using CWL.  Let's test running the BAMStats using the Dockstore command line and descriptor rather than just directly calling it via Docker.  This will test that the CWL correctly describes how to run your tool.

First thing I'll do is create a completely local dataset and JSON parameterization file:

```
$> wget ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/data/NA12878/alignment/NA12878.chrom20.ILLUMINA.bwa.CEU.low_coverage.20121211.bam
# alternative location if the above URL doesn't work
$> wget https://s3.amazonaws.com/oconnor-test-bucket/sample-data/NA12878.chrom20.ILLUMINA.bwa.CEU.low_coverage.20121211.bam
$> mv NA12878.chrom20.ILLUMINA.bwa.CEU.low_coverage.20121211.bam /tmp/
```

This downloads to my current directory and then moves to `/tmp`.  I could choose another location, it really doesn't matter, but we need the full path when dealing with the parameter JSON file.  I'm using a sample I checked in already: `sample_configs.local.json`.

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

**Tip:** the Dockstore CLI can handle inputs at HTTPS, FTP, and S3 URLs but that's beyond the scope of this tutorial.

You can see in the above I give the full path to the input under `bam_input` and full path to the output `bamstats_report`.

At this point, let's run the tool with our local inputs and outputs via the JSON config file:

```
$> dockstore tool launch --entry Dockstore.cwl --local-entry --json sample_configs.local.json
Creating directories for run of Dockstore launcher at: ./datastore//launcher-1e43745b-3127-4c56-8204-1e56abb81df2
Provisioning your input files to your local machine
Downloading: #bam_input from /tmp/NA12878.chrom20.ILLUMINA.bwa.CEU.low_coverage.20121211.bam into directory: /home/ubuntu/gitroot/dockstore-tool-bamstats/./datastore/launcher-1e43745b-3127-4c56-8204-1e56abb81df2/inputs/91155c9c-fd3b-4edf-871d-b31019ffa0f2
[##################################################] 100%
Calling out to cwltool to run your tool
Executing: cwltool --enable-dev --non-strict --enable-net --outdir /home/dyuen/dockstore-tool-bamstats/./datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/outputs/ --tmpdir-prefix /home/dyuen/dockst
ore-tool-bamstats/./datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/working/ /home/dyuen/dockstore-tool-bamstats/Dockstore.cwl /home/dyuen/dockstore-tool-bamstats/./datastore/launcher-77a75bfe-8b8
8-49b2-9b81-94292b00e299/workflow_params.json
cwltool stdout:
        {
            "bamstats_report": {
                "format": "http://edamontology.org/format_3615",
                "checksum": "sha1$ae31df74f0c0f49f06dc2564a019659073d79335",
                "basename": "bamstats_report.zip",
                "location": "file:///home/dyuen/dockstore-tool-bamstats/./datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/outputs/bamstats_report.zip",
                "path": "/home/dyuen/dockstore-tool-bamstats/./datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/outputs/bamstats_report.zip",
                "class": "File",
                "size": 31975
            }
        }

cwltool stderr:
        /usr/local/bin/cwltool 1.0.20160712154127
        [job Dockstore.cwl] /tmp/tmpLXA80l$ docker \
            run \
            -i \
            --volume=/home/dyuen/dockstore-tool-bamstats/./datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/inputs/d1dd351a-436e-4411-b8c0-57f7df57ff74/bam_input:/var/lib/cwl/stg29cb92e4-5231-4468$
8976-8e72fe01e1c2/bam_input:ro \
            --volume=/tmp/tmpLXA80l:/var/spool/cwl:rw \
            --volume=/home/dyuen/dockstore-tool-bamstats/datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/working8HUvKn:/tmp:rw \
            --workdir=/var/spool/cwl \
            --read-only=true \
            --user=1000 \
            --rm \
            --env=TMPDIR=/tmp \
            --env=HOME=/var/spool/cwl \
            quay.io/collaboratory/dockstore-tool-bamstats:1.25-6 \
            bash \
            /usr/local/bin/bamstats \
            4 \
            /var/lib/cwl/stg29cb92e4-5231-4468-8976-8e72fe01e1c2/bam_input
        Total time: 12 seconds
          adding: bamstats_report.html (deflated 52%)
          adding: bamstats_report.html.data/ (stored 0%)
          adding: bamstats_report.html.data/Coverage_boxAndWhisker.png (deflated 1%)
          adding: bamstats_report.html.data/20_Coverage_histogram.png (deflated 13%)
          adding: bamstats_report.html.data/20_Coverage.html (deflated 60%)
          adding: bamstats_report.html.data/20_Coverage_cumulativeHistogram.png (deflated 14%)
          adding: bamstats_report.html.data/20_Coverage_boxAndWhisker.png (deflated 12%)
        Final process status is success

Saving copy of cwltool stdout to: /home/dyuen/dockstore-tool-bamstats/./datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/outputs/cwltool.stdout.txt
Saving copy of cwltool stderr to: /home/dyuen/dockstore-tool-bamstats/./datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/outputs/cwltool.stderr.txt

Provisioning your output files to their final destinations
Uploading: #bamstats_report from /home/dyuen/dockstore-tool-bamstats/./datastore/launcher-77a75bfe-8b88-49b2-9b81-94292b00e299/outputs/bamstats_report.zip to : /tmp/bamstats_report.zip
[##################################################] 100%
```

So that's a lot of information but you can see the process was a success.  We get output from the command we ran and also see the file being moved to the correct output location:

```
$> ls -lth /tmp/bamstats_report.zip
-rw-rw-r-- 1 ubuntu ubuntu 32K Jun 16 02:14 /tmp/bamstats_report.zip
```

The output looks fine, just what we'd expect.

So what's going on here?  What's the Dockstore CLI doing?  It can best be summed up with this image:

![Lifecycle](docs/dockstore_lifecycle.png)

The command line first provisions file.  In our case, the files were local so no provisioning was needed.  But as the Tip above mentioned, these can be various URLs.  After provisioning the docker image is pulled and ran via the `cwltool` command line. This uses the `Dockerfile.cwl` and parameterization JSON file (`sample_configs.local.json`) to construct the underlying `docker run` command.  Finally, the Dockstore CLI provisions files back.  In this case it's just a file copy to `/tmp/bamstats_report.zip` but it could copy the result to a destination in S3 for example.

**Tip:** you can use `--debug` to get much more information during this run, including the actual call to cwltool (which can be super helpful in debugging):

```
cwltool --non-strict --enable-net --outdir /home/ubuntu/gitroot/dockstore-tool-bamstats/./datastore/launcher-08852137-71c1-4b75-b2fc-16ab7ca3243b/outputs/ /home/ubuntu/gitroot/dockstore-tool-bamstats/Dockstore.cwl /home/ubuntu/gitroot/dockstore-tool-bamstats/./datastore/launcher-08852137-71c1-4b75-b2fc-16ab7ca3243b/workflow_params.json
```

**Tip:** the `dockstore` CLI automatically create a `datastore` directory in the current working directory where you execute the command and uses it for inputs/outputs.  It can get quite large depending on the tool/inputs/outputs being used.  Plan accordingly e.g. execute the dockstore CLI in a directory located on a partition with sufficient storage.

## Adding a Test Parameter File
We are able register the above input parameterization of the tool into Dockstore so that users can see and test an example with our tool. Users can manually add test parameter files for a given tool tag or workflow version through both the command line and the versions tab in the UI.

**Tip:** Make sure that any required input files are given as URLs so that a user can run the example successfully.

## Releasing on GitHub

At this point we've successfully created our tool in Docker, tested it, written a CWL that describes how to run it, and tested running this via the Dockstore command line.  All of this work has been done locally, so if we encounter problems along the way its fast to perform debug cycles, fixing problems as we go.  At this point we're confident that the tool is ready to share with others and bug free.  It's time to release `1.25-3`

Releasing will tag your GitHub repository with a version tag so you always can get back to this particular release.  I'm going to use the tag `1.25-3` which you can see referenced in my Docker image tag and also my CWL file.  GitHub makes it very easy to release:

![Release](docs/release.png)

I click on "releases" in my GitHub project [page](https://github.com/CancerCollaboratory/dockstore-tool-bamstats) and then follow the directions to create a new release. Simple as that!

**Tip:** [HubFlow](https://datasift.github.io/gitflow/) is an excellent way to manage the lifecycle of releases on GitHub.  Take a look!

# Building on Quay.io

Now that you've perfected the `Dockerfile`, have built the image on your local host, and have tested running the Docker container and tool packaged inside and have released this version on GitHub, it's time to push the image to a place where others can use it.  For this you can use DockerHub or GitLab but we prefer [Quay.io](http://quay.io) since it integrates really nicely with Dockstore.

You can manually `docker push` the image you have already built but the most reliable and transparent thing you can do is link your GitHub repository (and the Dockerfile contained within) to Quay.  This will cause Quay to automatically build the Docker image every time there is a change.

Log onto Quay now and setup a new repository (click the "+" icon).

![New Quay Repo](docs/quay_new_repo.png)

You must match the name to what I was using previously, so in this case it's `CancerCollaboratory/dockstore-tool-bamstats`.  Also, Dockstore will only work with `Public` repositories currently. Notice I'm selecting "Link to a GitHub Repository Push", this is because we want Quay to automatically build our Docker image every time we update the repository on GitHub.  Very slick!

![Build Trigger](docs/build_all.png)

It will automatically prompt you to setup a "build trigger" after GitHub authenticates you.  Here I select the GitHub repo for `CancerCollaboratory/dockstore-tool-bamstats`.

![Build Trigger](docs/build_trigger.png)

It will then ask if there are particular branches you want to build, I typically just let it build everything:

So every time you do a commit to your GitHub repo Quay automatially builds and tags a Docker image.  If this is overkill for you, consider setting up particular build trigger regular expressions at this step.

![Build Trigger](docs/run_trigger.png)

It will then ask you where your Dockerfile is located.  Since the Dockerfile is in the root directory of this GitHub repo you can just click next:

![Build Trigger](docs/dockerfile.png)

At this point you can confirm your settings and "Create Trigger" followed by "Run Trigger Now" to actually perform the build of the Docker images.

Build it for `1.25-3` and any or all other branches.  Typically, I build for each release and develop aka latest is built next time I check-in on that branch.

In my example I should see a `1.25-3` listed in the "tags" for this Quay Docker repository:

![Build Tags](docs/build_tags.png)

And I do, so this Docker image has been built successfully by Quay and is ready for sharing with the community.


## Describe Your Tool in WDL

It is also possible to describe tools via the [WDL language](https://github.com/broadinstitute/wdl). A tool can either be described in CWL-only or can be described with both WDL and CWL.

In WDL, a tool can also be described as a one task WDL workflow.

We provide a hello world example as follows:

    task hello {
      String name

      command {
        echo 'hello ${name}!'
      }
      output {
        File response = stdout()
      }
    }

    workflow test {
      call hello
    }

We are currently monitoring WDL to see how metadata like that provided for CWL will be integrated into WDL.

## Next Steps

Follow the [next tutorial](docs/getting-started-with-dockstore) to register your tool on Dockstore.
