#!/usr/bin/env cwl-runner

class: CommandLineTool
id: "BAMStats"
label: "BAMStats tool"
cwlVersion: v1.1
doc: |
    This is sample CWL Tool code taken and adapted from the [dockstore-tool-bamstats](https://github.com/CancerCollaboratory/dockstore-tool-bamstats/blob/develop/Dockstore.cwl) repository.
    For more information, see "Getting Started with CWL" in the Dockstore Docs.

dct:creator:
  foaf:name: "YOUR_NAME_HERE"
  foaf:mbox: "mailto:YOUR_EMAIL_HERE"

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


$namespaces:
    dct: http://purl.org/dc/terms/
    foaf: http://xmlns.com/foaf/0.1/
