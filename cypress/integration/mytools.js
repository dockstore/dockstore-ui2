describe('Dockstore my tools', function() {
  require('./helper.js')

	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/my-containers")
  });

  describe('publish a tool', function() {
    it("publish and unpublish", function() {
      cy
        .get('.panel-group')
          .children(':nth-child(2)')
          .click()
          .children(':nth-child(2)')
          .find('a')
          .first()
          .click()
          .get('#publishToolButton')
          .should('contain', 'Unpublish')
          .click()
          .should('contain', 'Publish')
          .click()
          .should('contain', 'Unpublish')
    });
  });

  describe('Publish an existing Amazon ECR tool', function() {
    it('publish', function() {
      cy
        .get('#publishToolButton')
        .click()
    });
  });

  describe('manually register an Amazon ECR tool', function() {
    it("register tool", function() {
      cy
        .get('#register_tool_button')
        .click()

      cy
        .get('#sourceCodeRepositoryInput')
        .type("testnamespace/testname")
        .wait(1000)

      cy
        .get('#imageRegistrySpinner')
        .click()
        .get('#imageRegistrySpinner_AMAZON_ECR')
        .click()

      cy
        .get('#dockerRegistryPathInput')
        .type('amazon.ecr.registry')

      cy
        .get('#toolMaintainerEmailInput')
        .type('test@email.com')

      cy
        .get('#submitButton')
        .click()

      cy
        .get('#tool-path')
        .should('contain', 'amazon.ecr.registry/testnamespace/testname')

      cy
        .get('#addTagButton')
        .click()

      cy
        .get('#versionTagInput')
        .type('master')
      cy
        .get('#gitReferenceInput')
        .type('master')

      cy
        .server()
        .route({
            method: "GET",
            url: /refresh/,
            response: {"id": 40000, "author":null,"description":null,"labels":[],"users":[{"id":1,"username":"user_A","isAdmin":false,"name":"user_A"}],"email":null,"defaultVersion":null,"lastUpdated":1482334377743,"gitUrl":"git@github.com:testnamespace/testname.git","mode":"MANUAL_IMAGE_PATH","name":"testname","toolname":"","namespace":"testnamespace","registry":"AMAZON_ECR","lastBuild":null,"tags":[{"id":2081,"reference":"master","sourceFiles":[{"id":488852,"type":"DOCKERFILE","content":"FROM ubuntu:16.10","path":"/Dockerfile"},{"id":488802,"type":"DOCKSTORE_CWL","content":"#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n","path":"/Dockstore.cwl"}],"hidden":false,"valid":true,"name":"master","dirtyBit":false,"verified":false,"verifiedSource":null,"size":81167820,"automated":false,"last_modified":1473944697000,"image_id":"ee441450617432aa4e67fd88b9049cd7d021752dfcaab13ca4cf3d7bf6617362","dockerfile_path":"/Dockerfile","cwl_path":"/Dockstore.cwl","wdl_path":"/Dockstore.wdl"    }],"is_published":false,"last_modified":null,"default_dockerfile_path":"/Dockerfile","default_cwl_path":"/Dockstore.cwl","default_wdl_path":"/Dockstore.wdl","tool_maintainer_email":"test@email.com","private_access":true,"path":"amazon.ecr.registry/testnamespace/testname","tool_path":"amazon.ecr.registry/testnamespace/testname"}

          })
        .route({
            method: "GET",
            url: /dockerfile/,
            response: {"content":"FROM ubuntu:16.10"}
          })
        .route({
            method: "GET",
            url: /cwl/,
            response: {"content":"#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n","path":"/Dockstore.cwl"}
          })

      cy
        .get('#addVersionTagButton')
        .click()

      cy
        .get('#deregisterButton')
        .click()
    });
  });
});
