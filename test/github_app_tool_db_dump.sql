INSERT INTO public.sourcefile (id, content, type, path, dbcreatedate, dbupdatedate, absolutepath, frozen) VALUES (50, '#!/usr/bin/env cwl-runner

class: Workflow
id: Md5sum
label: Simple md5sum tool
cwlVersion: v1.0

$namespaces:
  dct: http://purl.org/dc/terms/
  foaf: http://xmlns.com/foaf/0.1/

doc: |
  aaaaa [![Docker Repository on Quay.io](https://quay.io/repository/briandoconnor/dockstore-tool-md5sum/status "Docker Repository on Quay.io")](https://quay.io/repository/briandoconnor/dockstore-tool-md5sum)
  [![Build Status](https://travis-ci.org/briandoconnor/dockstore-tool-md5sum.svg)](https://travis-ci.org/briandoconnor/dockstore-tool-md5sum)
  A very, very simple Docker container for the md5sum command. See the [README](https://github.com/briandoconnor/dockstore-tool-md5sum/blob/master/README.md) for more information.


dct:creator:
  ''@id'': http://orcid.org/0000-0002-7681-6415
  foaf:name: Brian O''Connor
  foaf:mbox: briandoconnor@gmail.com
requirements:
- class: DockerRequirement
  dockerPull: quay.io/briandoconnor/dockstore-tool-md5sum:1.0.4
- class: InlineJavascriptRequirement
hints:
- class: ResourceRequirement
  # The command really requires very little resources.
  coresMin: 1
  ramMin: 1024
  outdirMin: 1024
inputs:
  input_file:
    type: File
    inputBinding:
      position: 1
    doc: The file that will have its md5sum calculated.
outputs:
  output_file:
    type: File
    format: http://edamontology.org/data_3671
    outputBinding:
      glob: md5sum.txt
    doc: A text file that contains a single line that is the md5sum of the input file.
baseCommand: [/bin/my_md5sum]
', 'DOCKSTORE_CWL', '/tools/Dockstore.cwl', '2022-01-14 10:04:44.460000', '2022-01-14 10:04:44.460000', '/tools/Dockstore.cwl', false);

INSERT INTO public.sourcefile (id, content, type, path, dbcreatedate, dbupdatedate, absolutepath, frozen) VALUES (51, 'version: 1.2
tools:
   - subclass: cwl
     primaryDescriptorPath: /tools/Dockstore.cwl
     name: md5sum
workflows:
   - subclass: cwl
     primaryDescriptorPath: /workflows/HelloWorld.cwl
', 'DOCKSTORE_YML', '/.dockstore.yml', '2022-01-14 10:04:44.458000', '2022-01-14 10:04:44.458000', '/.dockstore.yml', false);


INSERT INTO public.sourcefile (id, content, type, path, dbcreatedate, dbupdatedate, absolutepath, frozen) VALUES (54, '#!/usr/bin/env cwl-runner

class: CommandLineTool
id: Md5sum
label: Simple md5sum tool
cwlVersion: v1.0

$namespaces:
  dct: http://purl.org/dc/terms/
  foaf: http://xmlns.com/foaf/0.1/

doc: |
  aaaaa [![Docker Repository on Quay.io](https://quay.io/repository/briandoconnor/dockstore-tool-md5sum/status "Docker Repository on Quay.io")](https://quay.io/repository/briandoconnor/dockstore-tool-md5sum)
  [![Build Status](https://travis-ci.org/briandoconnor/dockstore-tool-md5sum.svg)](https://travis-ci.org/briandoconnor/dockstore-tool-md5sum)
  A very, very simple Docker container for the md5sum command. See the [README](https://github.com/briandoconnor/dockstore-tool-md5sum/blob/master/README.md) for more information.


dct:creator:
  ''@id'': http://orcid.org/0000-0002-7681-6415
  foaf:name: Brian O''Connor
  foaf:mbox: briandoconnor@gmail.com
requirements:
- class: DockerRequirement
  dockerPull: quay.io/briandoconnor/dockstore-tool-md5sum:1.0.4
- class: InlineJavascriptRequirement
hints:
- class: ResourceRequirement
  # The command really requires very little resources.
  coresMin: 1
  ramMin: 1024
  outdirMin: 1024
inputs:
  input_file:
    type: File
    inputBinding:
      position: 1
    doc: The file that will have its md5sum calculated.
outputs:
  output_file:
    type: File
    format: http://edamontology.org/data_3671
    outputBinding:
      glob: md5sum.txt
    doc: A text file that contains a single line that is the md5sum of the input file.
baseCommand: [/bin/my_md5sum]
', 'DOCKSTORE_CWL', '/tools/Dockstore.cwl', '2022-01-14 09:13:37.403000', '2022-01-14 09:13:37.403000', '/tools/Dockstore.cwl', false);

INSERT INTO public.sourcefile (id, content, type, path, dbcreatedate, dbupdatedate, absolutepath, frozen) VALUES (55, 'version: 1.2
tools:
   - subclass: cwl
     primaryDescriptorPath: /tools/Dockstore.cwl
     name: md5sum
workflows:
   - subclass: cwl
     primaryDescriptorPath: /workflows/HelloWorld.cwl
', 'DOCKSTORE_YML', '/.dockstore.yml', '2022-01-14 10:04:44.458000', '2022-01-14 10:04:44.458000', '/.dockstore.yml', false);

INSERT INTO public.sourcefile (id, content, type, path, dbcreatedate, dbupdatedate, absolutepath, frozen) VALUES (56, '#!/usr/bin/env cwl-runner

class: CommandLineTool
id: Md5sum
label: Simple md5sum tool
cwlVersion: v1.0

$namespaces:
  dct: http://purl.org/dc/terms/
  foaf: http://xmlns.com/foaf/0.1/

doc: |
  aaaaa [![Docker Repository on Quay.io](https://quay.io/repository/briandoconnor/dockstore-tool-md5sum/status "Docker Repository on Quay.io")](https://quay.io/repository/briandoconnor/dockstore-tool-md5sum)
  [![Build Status](https://travis-ci.org/briandoconnor/dockstore-tool-md5sum.svg)](https://travis-ci.org/briandoconnor/dockstore-tool-md5sum)
  A very, very simple Docker container for the md5sum command. See the [README](https://github.com/briandoconnor/dockstore-tool-md5sum/blob/master/README.md) for more information.


dct:creator:
  ''@id'': http://orcid.org/0000-0002-7681-6415
  foaf:name: Brian O''Connor
  foaf:mbox: briandoconnor@gmail.com
requirements:
- class: DockerRequirement
  dockerPull: quay.io/briandoconnor/dockstore-tool-md5sum:1.0.4
- class: InlineJavascriptRequirement
hints:
- class: ResourceRequirement
  # The command really requires very little resources.
  coresMin: 1
  ramMin: 1024
  outdirMin: 1024
inputs:
  input_file:
    type: File
    inputBinding:
      position: 1
    doc: The file that will have its md5sum calculated.
outputs:
  output_file:
    type: File
    format: http://edamontology.org/data_3671
    outputBinding:
      glob: md5sum.txt
    doc: A text file that contains a single line that is the md5sum of the input file.
baseCommand: [/bin/my_md5sum]
', 'DOCKSTORE_CWL', '/tools/Dockstore.cwl', '2022-01-14 09:13:37.403000', '2022-01-14 09:13:37.403000', '/tools/Dockstore.cwl', false);

INSERT INTO public.sourcefile (id, content, type, path, dbcreatedate, dbupdatedate, absolutepath, frozen) VALUES (57, 'version: 1.2
tools:
   - subclass: cwl
     primaryDescriptorPath: /tools/Dockstore.cwl
     name: md5sum
workflows:
   - subclass: cwl
     primaryDescriptorPath: /workflows/HelloWorld.cwl
', 'DOCKSTORE_YML', '/.dockstore.yml', '2022-01-14 10:04:44.458000', '2022-01-14 10:04:44.458000', '/.dockstore.yml', false);

INSERT INTO public.apptool (id, author, conceptdoi, dbcreatedate, dbupdatedate, description, email, giturl, ispublished, lastmodified, lastupdated, licensename, topicid, checkerid, descriptortype, descriptortypesubclass, forumurl, mode, organization, repository, sourcecontrol, workflowname, actualdefaultversion, topicautomatic, topicmanual, topicselection) VALUES (50, null, null, '2022-01-12 14:51:23.656000', '2022-01-12 14:51:23.689000', null, null, 'git@github.com:C/github-app-tools.git', true, '2022-01-12 14:48:20.000000', '2022-01-12 14:51:22.707000', null, null, null, 'cwl', 'n/a', null, 'DOCKSTORE_YML', 'C', 'test-github-app-tools', 'github.com', 'testing', null, null, null, 'AUTOMATIC');
INSERT INTO public.apptool (id, author, conceptdoi, dbcreatedate, dbupdatedate, description, email, giturl, ispublished, lastmodified, lastupdated, licensename, topicid, checkerid, descriptortype, descriptortypesubclass, forumurl, mode, organization, repository, sourcecontrol, workflowname, actualdefaultversion, topicautomatic, topicmanual, topicselection) VALUES (51, 'testuser', null, '2022-01-12 14:45:55.370000', '2022-01-14 10:05:15.491000', 'test description...', 'testemail@gmail.com', 'git@github.com:C/github-app-tools.git', false, '2022-01-14 09:13:50.000000', '2022-01-12 14:45:54.113000', null, null, null, 'cwl', 'n/a', null, 'DOCKSTORE_YML', 'C', 'test-github-app-tools', 'github.com', 'md5sum', null, null, null, 'AUTOMATIC');

INSERT INTO public.version_metadata (doistatus, doiurl, hidden, verified, verifiedsource, id, author, description, description_source, email, dbcreatedate, dbupdatedate, publicaccessibletestparameterfile) VALUES ('NOT_REQUESTED', null, false, false, null, 30, null, null, null, null, null, null, null);
INSERT INTO public.version_metadata (doistatus, doiurl, hidden, verified, verifiedsource, id, author, description, description_source, email, dbcreatedate, dbupdatedate, publicaccessibletestparameterfile) VALUES ('NOT_REQUESTED', null, false, false, null, 31, null, null, null, null, null, null, null);
INSERT INTO public.version_metadata (doistatus, doiurl, hidden, verified, verifiedsource, id, author, description, description_source, email, dbcreatedate, dbupdatedate, publicaccessibletestparameterfile) VALUES ('NOT_REQUESTED', null, false, false, null, 33, null, null, null, null, null, null, null);

INSERT INTO public.workflowversion (id, lastmodified, reference, valid, workflowpath, name, dirtybit, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid, subclass, frozen, parentid, islegacyversion, dagjson, tooltablejson, synced) VALUES (30, '2022-01-12 14:48:20.000000', 'test', true, '/tools/Dockstore.cwl', 'test', false, '2022-01-12 14:51:23.668000', '2022-01-12 14:51:23.691000', 'BRANCH', null, '31fe36add1e3f613b649a99196e519d459b610b2', null, false, 50, false, null, null, true);
INSERT INTO public.workflowversion (id, lastmodified, reference, valid, workflowpath, name, dirtybit, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid, subclass, frozen, parentid, islegacyversion, dagjson, tooltablejson, synced) VALUES (31, '2022-01-12 14:45:20.000000', 'main', true, '/tools/Dockstore.cwl', 'main', false, '2022-01-12 14:45:55.386000', '2022-01-12 14:45:55.576000', 'BRANCH', null, 'a7bb91d678d5cb9c973289db6c962a6a238186ea', null, false, 51, false, null, null, true);
INSERT INTO public.workflowversion (id, lastmodified, reference, valid, workflowpath, name, dirtybit, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid, subclass, frozen, parentid, islegacyversion, dagjson, tooltablejson, synced) VALUES (33, '2022-01-14 09:13:50.000000', 'invalidTool', false, '/tools/Dockstore.cwl', 'invalidTool', false, '2022-01-14 10:04:44.245000', '2022-01-14 10:04:44.469000', 'BRANCH', null, '84ae40bbafed73748e7ec587f770ddd752d00bc0', null, false, 51, false, null, null, true);

INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (33, 50);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (33, 51);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (30, 54);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (30, 55);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (31, 56);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (31, 57);


INSERT INTO public.user_entry (userid, entryid) VALUES (1, 50);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 51);





