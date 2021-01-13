#!/usr/bin/env cwl-runner

cwlVersion: v1.0
id: "YOUR_WORKFLOW"
label: "YOUR_WORKFLOW's Label"
class: Workflow
doc: |
    This is sample CWL Workflow code.
    For more information, see "Getting Started with CWL" and "CWL Best Practices" in the Dockstore Docs.
inputs:
  bamfile:
    type: File
    doc: "The BAM file used as input."
    format: "http://edamontology.org/format_2572"
  bedfile:
    type: File
  bamqc_pl:
    type: File
  flagstat2json:
    type: File

outputs:
  bamqc_json:
    type: File
    outputSource: bamqc/outjson
  flagstatjson:
    type: File
    outputSource: flagstat_json/flagstat_json

steps:
  flagstat:
    run: flagstat.cwl
    in:
      bamfile: bamfile
    out: [flagstat_file]

  flagstat_json:
    run: flagstat2json.cwl
    in:
      flagstat_file: flagstat/flagstat_file
      flagstat2json: flagstat2json
    out: [flagstat_json]

  bamqc:
    run: bamqc.cwl
    in:
      bamfile: bamfile
      bedfile: bedfile
      bamqc_pl: bamqc_pl
      xtra_json: flagstat_json/flagstat_json
    out: [ outjson ]

s:author:
  - class: s:Person
    s:email: YOUR_EMAIL_HERE
    s:name: YOUR_NAME_HERE
