/*
 * Copyright 2026 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

-- AI-curated EDAM-style categories covering each of the six subontology prefixes.
-- Entries used:
--   tool id=52     quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut  (published)
--   workflow id=11 github.com/A/l                                    (published)
-- Both have entry_metadata rows inserted by the 1.20.0 Liquibase migration.

INSERT INTO collection (name, displayname, topic, organizationid, dtype, deleted, dbcreatedate, dbupdatedate, metadata)
VALUES
  ('operation-sort',           'Sort',            'Sorting of sequences',            (SELECT id FROM organization WHERE name = 'dockstoreai'), 'Category', false, LOCALTIMESTAMP, LOCALTIMESTAMP, '{"source":"http://edamontology.org/operation_3802"}'),
  ('topic-genomics',           'Genomics',        'Genomics and genome biology',     (SELECT id FROM organization WHERE name = 'dockstoreai'), 'Category', false, LOCALTIMESTAMP, LOCALTIMESTAMP, '{"source":"http://edamontology.org/topic_0622"}'),
  ('input-format-bam',         'BAM',             'BAM sequence alignment format',   (SELECT id FROM organization WHERE name = 'dockstoreai'), 'Category', false, LOCALTIMESTAMP, LOCALTIMESTAMP, '{"source":"http://edamontology.org/format_2572"}'),
  ('input-data-sequence-reads','Sequence reads',  'Sequencing read data',            (SELECT id FROM organization WHERE name = 'dockstoreai'), 'Category', false, LOCALTIMESTAMP, LOCALTIMESTAMP, '{"source":"http://edamontology.org/data_0848"}'),
  ('output-format-vcf',        'VCF',             'VCF variant call format',         (SELECT id FROM organization WHERE name = 'dockstoreai'), 'Category', false, LOCALTIMESTAMP, LOCALTIMESTAMP, '{"source":"http://edamontology.org/format_3016"}'),
  ('output-data-variants',     'Variants',        'Genomic variant data',            (SELECT id FROM organization WHERE name = 'dockstoreai'), 'Category', false, LOCALTIMESTAMP, LOCALTIMESTAMP, '{"source":"http://edamontology.org/data_3498"}');

-- Add tool (cgpmap-cramOut) to operation, topic, and both input subontologies.
INSERT INTO collection_entry_version (collection_id, entry_id, curator, dbcreatedate, dbupdatedate)
SELECT id, 52, 'AI', LOCALTIMESTAMP, LOCALTIMESTAMP
FROM collection
WHERE name IN ('operation-sort', 'topic-genomics', 'input-format-bam', 'input-data-sequence-reads')
  AND organizationid = (SELECT id FROM organization WHERE name = 'dockstoreai');

-- Add workflow (github.com/A/l) to operation, topic, and both output subontologies.
INSERT INTO collection_entry_version (collection_id, entry_id, curator, dbcreatedate, dbupdatedate)
SELECT id, 11, 'AI', LOCALTIMESTAMP, LOCALTIMESTAMP
FROM collection
WHERE name IN ('operation-sort', 'topic-genomics', 'output-format-vcf', 'output-data-variants')
  AND organizationid = (SELECT id FROM organization WHERE name = 'dockstoreai');
