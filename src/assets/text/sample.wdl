version 1.0
task bamstats {

    meta {
        author: "YOUR_NAME_HERE"
        email: "YOUR_EMAIL_HERE"
        description: "This is sample WDL Tool code taken and adapted from the [dockstore-tool-bamstats](https://github.com/CancerCollaboratory/dockstore-tool-bamstats/blob/develop/Dockstore.wdl) repository. For more information, see 'Getting Started with WDL' in the Dockstore Docs."
    }

    input {
        File bam_input
        Int mem_gb
    }

    command {
        bash /usr/local/bin/bamstats ${mem_gb} ${bam_input}
    }

    output {
        File bamstats_report = "bamstats_report.zip"
    }

    runtime {
        docker: "quay.io/collaboratory/dockstore-tool-bamstats:1.25-6_1.0"
        memory: mem_gb + "GB"
    }
}

workflow bamstatsWorkflow {
    input {
        File bam_input
        Int mem_gb
    }
    call bamstats { input: bam_input=bam_input, mem_gb=mem_gb }
}
