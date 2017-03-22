# Launching Tools and Workflows

This tutorial walks through some of our utilities for quickly launching tools and workflows in a naive way.

## Launch Tools

Now that you have a tool registered on Dockstore you may want to test it out for your own work. For now you can use the Dockstore to do several useful things:

0. create an empty JSON config file for entries in the Dockstore `dockstore tool convert`
0. launch a tool locally `dockstore tool launch`
  0. automatically copy inputs from remote URLs if HTTP, FTP, S3 or other remote URLs are specified
  0. call the `cwltool` command line to execute your tool using the CWL from the Dockstore and the JSON for inputs/outputs
  0. if outputs are specified as remote URLs, copy the results to these locations
0. download tool descriptor files `dockstore tool cwl` and `dockstore tool wdl`

Note that launching a CWL tool locally requires the cwltool to be installed. Check [onboarding](onboarding) if you have not already to ensure that your dependencies are correct.

## Launch Workflows

A parallel set of utilities is available for workflows. `Convert`, `wdl`, `cwl`, and `launch` are all available under the `dockstore workflow` mode.


## Next Steps

While launching tools and workflows locally is useful for testing, this approach is not useful for processing a large amount of data in a production environment. The next step is to take our Docker images, described by CWL/WDL and run them in an environment that supports those descriptors. For now, we can suggest taking a look at the environments that currently support and are validated with CWL at [https://ci.commonwl.org/](https://ci.commonwl.org/) and for WDL, [Cromwell](https://github.com/broadinstitute/cromwell).
