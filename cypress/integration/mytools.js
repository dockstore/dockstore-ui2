describe('Dockstore my tools', function() {
    require('./helper.js')

    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/my-tools")
    });

    function goToB1() {
      cy.wait(5000)
        cy.contains('quay.io/A2')
            .parentsUntil('accordion-group')
            .contains('Unpublished')
            .should('be.visible')
            .click()
        cy.contains('quay.io/A2')
            .parentsUntil('accordion-group')
            .contains('div .no-wrap', /\bb1\b/)
            .should('be.visible').click()
    }

    describe('Should contain extended DockstoreTool properties', function() {
        it('visit another page then come back', function() {
            cy.get('a#home-nav-button').click()
            cy.contains('Browse Tools')
            cy.get('a#my-tools-nav-button').click()
            cy.contains('github.com')
            // Apparently you need to click the accordion in order for the other components inside
            // to become click-able
            goToB1();
            cy.contains('GitHub')
            cy.contains('https://github.com/A2/b1')
            cy.contains('Quay.io')
            cy.contains('quay.io/A2/b1')
            cy.contains('Last Build')
            cy.contains('Last Updated')
            cy.contains('Build Mode')
            cy.contains('Fully-Automated')
        });
    });

    describe('publish a tool', function() {
        it("publish and unpublish", function() {
            goToB1();
            cy
                .get('#publishToolButton')
                .should('contain', 'Publish')
                .click()
                .should('contain', 'Unpublish')
                .click()
                .should('contain', 'Publish')
        });
    });

    describe('Publish an existing Amazon ECR tool', function() {
        it('publish', function() {
          cy.visit(String(global.baseUrl) + "/my-tools/amazon.dkr.ecr.test.amazonaws.com/A/a")
            cy
                .get('#publishToolButton')
                .click()
        });
    });

    describe('manually register an Amazon ECR tool', function() {
        it("register tool", function() {
            cy
                .server()
                .route({
                    method: "GET",
                    url: /refresh/,
                    response: { "id": 40000, "author": null, "description": null, "labels": [], "users": [{ "id": 1, "username": "user_A", "isAdmin": false, "name": "user_A" }], "email": null, "defaultVersion": null, "lastUpdated": 1482334377743, "gitUrl": "git@github.com:testnamespace/testname.git", "mode": "MANUAL_IMAGE_PATH", "name": "testname", "toolname": "", "namespace": "testnamespace", "registry": "AMAZON_ECR", "lastBuild": null, "tags": [], "is_published": false, "last_modified": null, "default_dockerfile_path": "/Dockerfile", "defaultCWLTestParameterFile": "/test.cwl.json", "defaultWDLTestParameterFile": "/test.cwl.json", "default_cwl_path": "/Dockstore.cwl", "default_wdl_path": "/Dockstore.wdl", "tool_maintainer_email": "test@email.com", "private_access": true, "path": "amazon.dkr.ecr.test.amazonaws.com/testnamespace/testname", "tool_path": "amazon.dkr.ecr.test.amazonaws.com/testnamespace/testname", "custom_docker_registry_path": "amazon.dkr.ecr.test.amazonaws.com" }

                })
                .route({
                    method: "GET",
                    url: /dockerfile/,
                    response: { "content": "FROM ubuntu:16.10" }
                })
                .route({
                    method: "GET",
                    url: /cwl/,
                    response: { "content": "#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n", "path": "/Dockstore.cwl" }
                })
            // Make sure page is loaded first
            cy.get('#tool-path').should('be.visible')
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
            cy
                .contains('Amazon ECR')
                .click()

            cy
                .get('#dockerRegistryPathInput')
                .type('amazon.dkr.ecr.test.amazonaws.com')

            cy
                .get('#toolMaintainerEmailInput')
                .type('test@email.com')

            cy
                .get('#imageRegistryInput')
                .type('testnamespace/testname')

            cy
                .get('#submitButton')
                .click()

            cy
                .get('#tool-path')
                .should('contain', 'amazon.dkr.ecr.test.amazonaws.com/testnamespace/testname')

            cy
                .contains('Versions')
                .click()

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
                .get('#addVersionTagButton')
                .click()

            cy
                .get('#deregisterButton')
                .click()
            cy
                .get('#deregisterConfirmButton')
                .click()

            // This is deactivated because:
            // Registering a tool also refreshes it.  
            // Refresh results in an error so it is mocked.
            // The mocked results has an id that is not correct
            // The deregister uses this mocked id to deregister but since the id is incorrect, it can't deregister
            // cy
            // .get('#tool-path')
            // .should('not.contain', 'amazon.dkr.ecr.test.amazonaws.com/testnamespace/testname')
        });

    });
});
