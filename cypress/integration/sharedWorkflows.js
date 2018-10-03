describe('Shared with me workflow test from my-workflows', function() {
  require('./helper.js')

  beforeEach(function() {
      // Mock the shared with me workflows and permissions
      // TODO: There is probably a better approach to this which would allow for deeper testing of shared workflows
      cy
      .server()

      cy
      .route({
        method: "GET",
        url: /readertest\/actions/,
        response: ["READ"]
      }).as('readerActions')

      cy
      .route({
        method: "GET",
        url: /writertest\/actions/,
        response: ["READ", "WRITE"]
      }).as('writerActions')

      cy
      .route({
        method: "GET",
        url: /ownertest\/actions/,
        response: ["READ", "WRITE", "SHARE", "DELETE"]
      }).as('ownerActions')

      let readerWorkflow = createHostedWorkflow('readertest', 200)
      let writerWorkflow = createHostedWorkflow('writertest', 201);
      let ownerWorkflow = createHostedWorkflow('ownertest', 202);
      cy
      .route({
        method: "GET",
        url: "*shared*",
        response: [{ "role": "READER", workflows: [ readerWorkflow ] },
                  { "role": "WRITER", workflows: [ writerWorkflow ] },
                  { "role": "OWNER", workflows: [ ownerWorkflow ] }]
      }).as('getSharedWorkflows')

      cy
      .route({
        method: "GET",
        url: "*workflows/200*",
        response: readerWorkflow
      }).as('getReaderWorkflow')

      cy
      .route({
        method: "GET",
        url: "*workflows/201*",
        response: writerWorkflow
      }).as('getWriterWorkflow')

      cy
      .route({
        method: "GET",
        url: "*workflows/202*",
        response: ownerWorkflow
      }).as('getOwnerWorkflow')

      // Visit my-worklfows page
      cy.visit(String(global.baseUrl) + "/my-workflows")
  });

  function createHostedWorkflow(name, id) {
    return {"aliases":null,"author":null,"checker_id":null,"dbCreateDate":1530729459942,"dbUpdateDate":1530729459942,"defaultTestParameterFilePath":"/test.json","defaultVersion":null,"description":null,"descriptorType":"wdl","email":null,"full_workflow_path":"dockstore.org/user_B/" + name,"gitUrl":"","has_checker":false,"id":id,"input_file_formats":[],"is_checker":false,"is_published":false,"labels":[],"lastUpdated":1530729459933,"last_modified":null,"last_modified_date":null,"mode":"HOSTED","organization":"user_B","output_file_formats":[],"parent_id":null,"path":"dockstore.org/user_B/" + name,"repository":name,"sourceControl":"dockstore.org","source_control_provider":"DOCKSTORE","starredUsers":[],"users":[{"avatarUrl":"","curator":false,"id":2,"isAdmin":false,"name":"user_B","userProfiles":null,"username":"user_B"}],"workflowName":null,"workflowVersions":[{"commitID":null,"dirtyBit":false,"doiStatus":"NOT_REQUESTED","doiURL":null,"hidden":false,"id":1,"input_file_formats":[],"last_modified":1530729511472,"name":"1","output_file_formats":[],"reference":null,"referenceType":"TAG","sourceFiles":[{"content":"task hello {\n  String pattern\n  File in\n\n  command {\n    egrep '${pattern}' '${in}'\n  }\n\n  runtime {\n    docker: \"broadinstitute/my_image\"\n  }\n\n  output {\n    Array[String] matches = read_lines(stdout())\n  }\n}\n\nworkflow wf {\n  call hello\n}","id":1,"path":"/Dockstore.wdl","type":"DOCKSTORE_WDL","verifiedBySource":{}}],"valid":true,"verified":false,"verifiedSource":null,"versionEditor":{"avatarUrl":"","curator":false,"id":2,"isAdmin":false,"name":"user_B","userProfiles":null,"username":"user_B"},"workflow_path":"/Dockstore.wdl","workingDirectory":""},{"commitID":null,"dirtyBit":false,"doiStatus":"NOT_REQUESTED","doiURL":null,"hidden":false,"id":2,"input_file_formats":[],"last_modified":1530729532618,"name":"2","output_file_formats":[],"reference":null,"referenceType":"TAG","sourceFiles":[{"content":"task hello {\n  String pattern\n  File in\n\n  command {\n    egrep '${pattern}' '${in}'\n  }\n\n  runtime {\n    docker: \"broadinstitute/my_image\"\n  }\n\n  output {\n    Array[String] varmatches = read_lines(stdout())\n  }\n}\n\nworkflow wf {\n  call hello\n}","id":2,"path":"/Dockstore.wdl","type":"DOCKSTORE_WDL","verifiedBySource":{}}],"valid":true,"verified":false,"verifiedSource":null,"versionEditor":{"avatarUrl":"","curator":false,"id":2,"isAdmin":false,"name":"user_B","userProfiles":null,"username":"user_B"},"workflow_path":"/Dockstore.wdl","workingDirectory":""}],"workflow_path":"/Dockstore.cwl"};
  }

  function getReadOnlyWorkflow() {
    cy.contains('dockstore.org/user_B')
      .parent()
      .parent()
      .parent()
      .contains('div .no-wrap', /readertest/)
      .should('not.be.visible')
    cy.contains('dockstore.org/user_B')
      .click()
    // Can't seem to select the mat-expansion-panel for some reason without triple parent
    cy.contains('dockstore.org/user_B')
      .parent()
      .parent()
      .parent()
      .contains('div .no-wrap', /readertest/)
      .should('be.visible').click()
  }

  function getWriteOnlyWorkflow() {
    cy.contains('dockstore.org/user_B')
      .click()
    cy.contains('dockstore.org/user_B')
      .parentsUntil('accordion-group')
      .contains('div .no-wrap', /writertest/)
      .should('be.visible').click()
  }

  function getOwnerWorkflow() {
    cy.contains('dockstore.org/user_B')
      .click()
    cy.contains('dockstore.org/user_B')
      .parentsUntil('accordion-group')
      .contains('div .no-wrap', /ownertest/)
      .should('be.visible').click()
  }

  describe('Should be able to perform operations on shared with me workflows based on permissions', function() {
      it('select a workflow you are a READER of and try to perform actions', function() {
        cy.wait('@getSharedWorkflows')
        getReadOnlyWorkflow();
        cy.wait('@getReaderWorkflow')
        cy.get('#publishButton').should('be.disabled')

        cy.goToTab('Versions')
        cy.contains("View").should('be.visible')
        cy.contains("Edit").should('not.be.visible')
        cy.contains("Delete").should('not.be.visible')

        cy.goToTab('Files')
        cy.contains('Edit Files').should('not.be.visible')
      });

      it('select a workflow you are a WRITER of and try to perform actions', function() {
        cy.wait('@getSharedWorkflows')
        getWriteOnlyWorkflow();
        cy.wait('@getWriterWorkflow')
        cy.get('#publishButton').should('be.disabled')

        cy.goToTab('Versions')
        cy.contains("View").should('not.be.visible')
        cy.contains("Edit").should('be.visible')
        cy.contains("Delete").should('be.visible')

        cy.goToTab('Files')
        cy.contains('Edit Files').should('be.visible')
      });

      it('select a workflow you are an OWNER of and try to perform actions', function() {
        cy.wait('@getSharedWorkflows')
        getOwnerWorkflow();
        cy.wait('@getOwnerWorkflow')
        cy.get('#publishButton').should('not.be.disabled')

        cy.goToTab('Versions')
        cy.contains("View").should('not.be.visible')
        cy.contains("Edit").should('be.visible')
        cy.contains("Delete").should('be.visible')

        cy.goToTab('Files')
        cy.contains('Edit Files').should('be.visible')
      });
  });
});
