#!/usr/bin/env nextflow

bamFile = file(params.bam_input)

process bamstats {
    input:
    file bam_input from bamFile
    val mem_gb from params.mem_gb

    output:
    file 'bamstats_report.zip'

    """
    bash /usr/local/bin/bamstats $mem_gb $bam_input
    """
}
