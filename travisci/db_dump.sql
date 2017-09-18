--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: container_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE container_id_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.container_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: enduser; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE enduser (
    id bigint NOT NULL,
    isadmin boolean,
    username character varying(255) NOT NULL
);


ALTER TABLE public.enduser OWNER TO postgres;

--
-- Name: enduser_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE enduser_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enduser_id_seq OWNER TO postgres;

--
-- Name: enduser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE enduser_id_seq OWNED BY enduser.id;


--
-- Name: endusergroup; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE endusergroup (
    groupid bigint NOT NULL,
    userid bigint NOT NULL
);


ALTER TABLE public.endusergroup OWNER TO postgres;

--
-- Name: entry_label; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE entry_label (
    entryid bigint NOT NULL,
    labelid bigint NOT NULL
);


ALTER TABLE public.entry_label OWNER TO postgres;

--
-- Name: label; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE label (
    id bigint NOT NULL,
    value character varying(255)
);


ALTER TABLE public.label OWNER TO postgres;

--
-- Name: label_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE label_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.label_id_seq OWNER TO postgres;

--
-- Name: label_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE label_id_seq OWNED BY label.id;


--
-- Name: sourcefile; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE sourcefile (
    id bigint NOT NULL,
    content text,
    path character varying(255) NOT NULL,
    type character varying(255)
);


ALTER TABLE public.sourcefile OWNER TO postgres;

--
-- Name: sourcefile_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE sourcefile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sourcefile_id_seq OWNER TO postgres;

--
-- Name: sourcefile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE sourcefile_id_seq OWNED BY sourcefile.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE tag (
    id bigint NOT NULL,
    dirtybit boolean,
    hidden boolean,
    lastmodified timestamp without time zone,
    name character varying(255),
    reference character varying(255),
    valid boolean,
    verified boolean,
    verifiedsource character varying(255),
    automated boolean,
    cwlpath text NOT NULL,
    dockerfilepath text NOT NULL,
    imageid character varying(255),
    size bigint,
    wdlpath text NOT NULL
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE tag_id_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO postgres;

--
-- Name: token; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE token (
    id bigint NOT NULL,
    content character varying(255) NOT NULL,
    refreshtoken character varying(255),
    tokensource character varying(255) NOT NULL,
    userid bigint,
    username character varying(255) NOT NULL
);


ALTER TABLE public.token OWNER TO postgres;

--
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.token_id_seq OWNER TO postgres;

--
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE token_id_seq OWNED BY token.id;


--
-- Name: tool; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE tool (
    id bigint NOT NULL,
    author character varying(255),
    defaultversion character varying(255),
    description text,
    email character varying(255),
    giturl character varying(255),
    ispublished boolean,
    lastmodified integer,
    lastupdated timestamp without time zone,
    defaultcwlpath text,
    defaultdockerfilepath text,
    defaultwdlpath text,
    lastbuild timestamp without time zone,
    mode text DEFAULT 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS'::text NOT NULL,
    name character varying(255) NOT NULL,
    namespace character varying(255),
    path character varying(255),
    registry character varying(255) NOT NULL,
    toolname character varying(255) NOT NULL,
    toolmaintaineremail character varying(255),
    privateaccess boolean
);


ALTER TABLE public.tool OWNER TO postgres;

--
-- Name: tool_tag; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE tool_tag (
    toolid bigint NOT NULL,
    tagid bigint NOT NULL
);


ALTER TABLE public.tool_tag OWNER TO postgres;

--
-- Name: user_entry; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE user_entry (
    userid bigint NOT NULL,
    entryid bigint NOT NULL
);


ALTER TABLE public.user_entry OWNER TO postgres;

--
-- Name: usergroup; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE usergroup (
    id bigint NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.usergroup OWNER TO postgres;

--
-- Name: usergroup_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE usergroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usergroup_id_seq OWNER TO postgres;

--
-- Name: usergroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE usergroup_id_seq OWNED BY usergroup.id;


--
-- Name: version_sourcefile; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE version_sourcefile (
    versionid bigint NOT NULL,
    sourcefileid bigint NOT NULL
);


ALTER TABLE public.version_sourcefile OWNER TO postgres;

--
-- Name: workflow; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE workflow (
    id bigint NOT NULL,
    author character varying(255),
    defaultversion character varying(255),
    description text,
    email character varying(255),
    giturl character varying(255),
    ispublished boolean,
    lastmodified integer,
    lastupdated timestamp without time zone,
    defaultworkflowpath text,
    descriptortype character varying(255) NOT NULL,
    mode text DEFAULT 'STUB'::text NOT NULL,
    organization character varying(255) NOT NULL,
    path character varying(255),
    repository character varying(255) NOT NULL,
    workflowname text
);


ALTER TABLE public.workflow OWNER TO postgres;

--
-- Name: workflow_workflowversion; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE workflow_workflowversion (
    workflowid bigint NOT NULL,
    workflowversionid bigint NOT NULL
);


ALTER TABLE public.workflow_workflowversion OWNER TO postgres;

--
-- Name: workflowversion; Type: TABLE; Schema: public; Owner: dockstore; Tablespace:
--

CREATE TABLE workflowversion (
    id bigint NOT NULL,
    dirtybit boolean,
    hidden boolean,
    lastmodified timestamp without time zone,
    name character varying(255),
    reference character varying(255),
    valid boolean,
    verified boolean,
    verifiedsource character varying(255),
    workflowpath text NOT NULL
);


ALTER TABLE public.workflowversion OWNER TO postgres;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY enduser ALTER COLUMN id SET DEFAULT nextval('enduser_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY label ALTER COLUMN id SET DEFAULT nextval('label_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY sourcefile ALTER COLUMN id SET DEFAULT nextval('sourcefile_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY token ALTER COLUMN id SET DEFAULT nextval('token_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY usergroup ALTER COLUMN id SET DEFAULT nextval('usergroup_id_seq'::regclass);


--
-- Name: container_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('container_id_seq', 51, true);


--
-- Data for Name: enduser; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO enduser VALUES (1, false, 'user_A');


--
-- Name: enduser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('enduser_id_seq', 1, true);


--
-- Data for Name: endusergroup; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Data for Name: entry_label; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Data for Name: label; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Name: label_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('label_id_seq', 1, false);


--
-- Data for Name: sourcefile; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO sourcefile VALUES (1, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (2, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (3, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (4, 'task hello {
  String name

  command {
    echo ''hello ${name}!''
  }
  output {
    File response = stdout()
  }
}

workflow test {
  call hello
}
', '/Dockstore.wdl', 'DOCKSTORE_WDL');
INSERT INTO sourcefile VALUES (5, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (6, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (7, 'task hello {
  String name

  command {
    echo ''hello ${name}!''
  }
  output {
    File response = stdout()
  }
}

workflow test {
  call hello
}
', '/Dockstore.wdl', 'DOCKSTORE_WDL');
INSERT INTO sourcefile VALUES (8, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (9, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (10, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (11, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (12, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (13, 'task hello {
  String name

  command {
    echo ''hello ${name}!''
  }
  output {
    File response = stdout()
  }
}

workflow test {
  call hello
}
', '/Dockstore.wdl', 'DOCKSTORE_WDL');
INSERT INTO sourcefile VALUES (14, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (15, 'task hello {
  String name

  command {
    echo ''hello ${name}!''
  }
  output {
    File response = stdout()
  }
}

workflow test {
  call hello
}
', '/Dockstore.wdl', 'DOCKSTORE_WDL');
INSERT INTO sourcefile VALUES (16, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (17, 'class: s:SoftwareSourceCode
s:name: "alea"
s:about: >
  ALEA is a computational toolbox for allele-specific (AS) epigenomics analysis, which incorporates allelic variation data within existing
  resources, allowing for the identification of significant associations between epigenetic modifications and specific allelic variants
  in human and mouse cells. ALEA provides a customizable pipeline of command line tools for AS analysis of next-generation sequencing data
  (ChIP-seq, RNA-seq, etc.) that takes the raw sequencing data and produces separate allelic tracks ready to be viewed on genome browsers.
  ALEA takes advantage of the available genomic resources for human (The 1000 Genomes Project Consortium) and mouse (The Mouse Genome Project)
  to reconstruct diploid in silico genomes for human samples or hybrid mouse samples under study. Then, for each accompanying ChIP-seq or
  RNA-seq dataset, ALEA generates two wig files from short reads aligned differentially to each haplotype.
  This pipeline has been validated using human and hybrid mouse ChIP-seq and RNA-seq data (See Test Data section).

s:targetProduct:
  class: s:SoftwareApplication
  s:downloadUrl: ftp://ftp.bcgsc.ca/supplementary/ALEA/files/alea.1.2.2.tar.gz
  s:softwareVersion: "1.2.2"
  s:applicationCategory: "command line tool"

s:url: http://www.bcgsc.ca/platform/bioinfo/software/alea
s:license: https://opensource.org/licenses/AFL-3.0
s:programmingLanguage: "JAVA"

s:publication:
  - id: http://dx.doi.org/10.1093/bioinformatics/btt744

s:author:
- class: s:Person
  id: mailto:mkarimi@bcgsc.ca
  s:name: "Mohammad Karimi"
  s:email: mailto:mkarimi@bcgsc.ca
  s:url: http://www.bcgsc.ca/author/mkarimi
  s:worksFor:
  - class: s:Organization
    s:name: "Canada''s Michael Smith Genome Sciences Centre, BC Cancer Agency, Vancouver, British Columbia, V5Z 4S6, Canada"
  - class: s:Organization
    s:name: "Department of Medical Genetics, Life Sciences Institute, The University of British Columbia, Vancouver, British Columbia, V6T 1Z3, Canada"

', 'alea-metadata.yaml', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (18, 'class: EnvVarRequirement
envDef:
  - envName: "PATH"
    envValue: "/usr/local/bin/:/usr/bin:/bin"
', 'envvar-global.yml', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (19, 'class: DockerRequirement
dockerPull: scidap/alea:v1.2.2
#dockerImageId: scidap/alea:v1.2.2 #not yet ready
dockerFile: |
  #################################################################
  # Dockerfile
  #
  # Software:         Alea
  # Software Version: 1.2.2
  # Description:      Alea image for SciDAP
  # Website:          http://scidap.com/
  # Provides:         alea|bwa|Plink|vcftools|bedGraphToBigWig|shapeit2
  # Base Image:       scidap/scidap:v0.0.1
  # Build Cmd:        docker build --rm -t scidap/alea:v1.2.2 .
  # Pull Cmd:         docker pull scidap/alea:v1.2.2
  # Run Cmd:          docker run --rm scidap/alea:v1.2.2 alea
  #################################################################

  ### Base Image
  FROM scidap/scidap:v0.0.1
  MAINTAINER Andrey V Kartashov "porter@porter.st"
  ENV DEBIAN_FRONTEND noninteractive

  ################## BEGIN INSTALLATION ######################

  WORKDIR /tmp

  ### Install required packages (samtools)

  RUN apt-get clean all &&\
      apt-get update &&\
      apt-get install -y  \
        libncurses5-dev && \
      apt-get clean && \
      apt-get purge && \
      rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*


  ### Installing BWA

  ENV VERSION 0.7.12
  ENV NAME bwa
  ENV URL "https://github.com/lh3/bwa/archive/${VERSION}.tar.gz"

  RUN wget -q -O - $URL | tar -zxv && \
      cd ${NAME}-${VERSION} && \
      make -j 4 && \
      cd .. && \
      cp ./${NAME}-${VERSION}/${NAME} /usr/local/bin/ && \
      strip /usr/local/bin/${NAME}; true && \
      rm -rf ./${NAME}-${VERSION}/


  #  ### Installing bowtie
  #
  #  ENV VERSION 1.1.2
  #  ENV NAME bowtie
  #  ENV URL "https://github.com/BenLangmead/bowtie/archive/v${VERSION}.tar.gz"
  #
  #  RUN wget -q -O - $URL | tar -zxv && \
  #    cd ${NAME}-${VERSION} && \
  #    make -j 4 && \
  #    cd .. && \
  #    cp ./${NAME}-${VERSION}/${NAME} /usr/local/bin/ && \
  #    cp ./${NAME}-${VERSION}/${NAME}-* /usr/local/bin/ && \
  #    strip /usr/local/bin/*; true && \
  #    rm -rf ./${NAME}-${VERSION}/


  ### Installing samtools/htslib/tabix/bgzip

  ENV VERSIONH 1.2.1
  ENV NAMEH htslib
  ENV URLH "https://github.com/samtools/htslib/archive/${VERSIONH}.tar.gz"

  ENV VERSION "1.2"
  ENV NAME "samtools"
  ENV URL "https://github.com/samtools/samtools/archive/${VERSION}.tar.gz"

  RUN wget -q -O - $URLH | tar -zxv && \
      cd ${NAMEH}-${VERSIONH} && \
      make -j 4 && \
      cd .. && \
      cp ./${NAMEH}-${VERSIONH}/tabix /usr/local/bin/ && \
      cp ./${NAMEH}-${VERSIONH}/bgzip /usr/local/bin/ && \
      cp ./${NAMEH}-${VERSIONH}/htsfile /usr/local/bin/ && \
      strip /usr/local/bin/tabix; true && \
      strip /usr/local/bin/bgzip; true && \
      strip /usr/local/bin/htsfile; true && \
      ln -s ./${NAMEH}-${VERSIONH}/ ./${NAMEH} && \
      wget -q -O - $URL | tar -zxv && \
      cd ${NAME}-${VERSION} && \
      make -j 4 && \
      cd .. && \
      cp ./${NAME}-${VERSION}/${NAME} /usr/local/bin/ && \
      strip /usr/local/bin/${NAME}; true && \
      rm -rf ./${NAMEH}-${VERSIONH}/ && \
      rm -rf ./${NAME}-${VERSION}/


  ### Installing bedGraphToBigWig

  RUN  wget -q -O /usr/local/bin/bedGraphToBigWig  http://hgdownload.soe.ucsc.edu/admin/exe/linux.x86_64/bedGraphToBigWig && \
  chmod a+x /usr/local/bin/bedGraphToBigWig


  ### Installing VCFTools

  ENV VERSION 0.1.14
  ENV NAME vcftools
  ENV URL "https://github.com/vcftools/vcftools/releases/download/v${VERSION}/${NAME}-${VERSION}.tar.gz"

  RUN wget -q -O - $URL | tar -zxv && \
      cd ${NAME}-${VERSION} && \
      ./configure --prefix=/usr/local && \
      make -j 4 install && \
      cd .. && \
      rm -rf ./${NAME}-${VERSION}/


  ### Installing SHAPEIT2

  RUN wget -q -O - https://mathgen.stats.ox.ac.uk/genetics_software/shapeit/shapeit.v2.r837.GLIBCv2.20.Linux.static.tgz|tar -zxv -C /usr/local bin/shapeit && \
      chmod a+x /usr/local/bin/shapeit


  ### Installing plink

  RUN wget -q -O plink-1.07-x86_64.zip http://pngu.mgh.harvard.edu/~purcell/plink/dist/plink-1.07-x86_64.zip && \
      unzip plink-1.07-x86_64.zip && \
      cp plink-1.07-x86_64/* /usr/local/bin && \
      rm -rf plink-1.07-x86_64 && \
      rm -f plink-1.07-x86_64.zip


  ### Installing alea

  RUN wget -q -O - ftp://ftp.bcgsc.ca/supplementary/ALEA/files/alea.1.2.2.tar.gz | tar -zxv -C /usr/local --strip-components=1 && \
      cd /usr/local/bin/ && \
      printf ''144c144\n<                 --output-fasta="$VAR_GENOME1_SNPS"\n---\n>                 --output-fasta="$VAR_GENOME2_SNPS"\n''| patch createGenome.sh && \
      sed -i.bak s/^AL_BWA_ALN_PARAMS/#AL_BWA_ALN_PARAMS/g alea.config && \
      sed -i.bak s/^AL_USE_CONCATENATED_GENOME/#AL_USE_CONCATENATED_GENOME/g alea.config && \
      rm -f alea.config.bak
', 'alea-docker.yml', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (28, 'cwlVersion: v1.0
class: Workflow
inputs:
  inp: File
  ex: string

outputs:
  classout:
    type: File
    outputSource: compile/classfile

steps:
  untar:
    run: tar-param.cwl
    in:
      tarfile: inp
      extractfile: ex
    out: [example_out]

  compile:
    run: arguments.cwl
    in:
      src: untar/example_out
    out: [classfile]

  wrkflow:
    run: grep-and-count.cwl
    in:
      infiles: inp
      pattern: "hello"
    out: [outfile]
', '/1st-workflow.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (29, '#!/usr/bin/env cwl-runner
class: CommandLineTool
cwlVersion: v1.0

inputs:
  pattern:
    type: string
    inputBinding: {position: 0}
  infile:
    type: File
    inputBinding: {position: 1}

outputs:
  outfile:
    type: stdout

baseCommand: grep
', 'grep.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (30, '#!/usr/bin/env cwl-runner
class: CommandLineTool
cwlVersion: v1.0

inputs:
  infiles:
    type: File[]
    inputBinding: {position: 1}

outputs:
  outfile:
    type: stdout

baseCommand: [wc, -l]
', 'wc.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (20, '#!/usr/bin/env cwl-runner

cwlVersion: "cwl:draft-3"

class: CommandLineTool

requirements:
  - $import: envvar-global.yml
  - $import: alea-docker.yml
  - class: InlineJavascriptRequirement

inputs:
  - id: "#hapsDir"
    type: File
    description: |
      path to the directory containing the .haps files
    inputBinding:
      position: 2

  - id: "#unphased"
    type: File
    description: |
      path to the vcf file containing unphased SNPs and Indels
    inputBinding:
      position: 3

  - id: "#outputPrefix"
    type: string
    description: |
      output file prefix including the path but not the extension
    inputBinding:
      position: 3

outputs:
  - id: "#phasevcf"
    type: File
    description: "Creates the file outputPrefix.vcf.gz"
    outputBinding:
      glob: $(inputs.outputPrefix+".vcf.gz")

baseCommand: ["alea", "phaseVCF"]

$namespaces:
  s: http://schema.org/

$schemas:
- https://sparql-test.commonwl.org/schema.rdf

s:mainEntity:
  $import: alea-metadata.yaml

s:downloadUrl: https://github.com/common-workflow-language/workflows/blob/master/tools/alea-phaseVCF.cwl
s:codeRepository: https://github.com/common-workflow-language/workflows
s:license: http://www.apache.org/licenses/LICENSE-2.0
s:isPartOf:
  class: s:CreativeWork
  s:name: "Common Workflow Language"
  s:url: http://commonwl.org/

s:author:
  class: s:Person
  s:name: "Andrey Kartashov"
  s:email: mailto:Andrey.Kartashov@cchmc.org
  s:sameAs:
  - id: http://orcid.org/0000-0001-9102-5681
  s:worksFor:
  - class: s:Organization
    s:name: "Cincinnati Children''s Hospital Medical Center"
    s:location: "3333 Burnet Ave, Cincinnati, OH 45229-3026"
    s:department:
    - class: s:Organization
      s:name: "Barski Lab"
', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (21, 'FROM ubuntu:12.04
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (22, 'class: s:SoftwareSourceCode
s:name: "alea"
s:about: >
  ALEA is a computational toolbox for allele-specific (AS) epigenomics analysis, which incorporates allelic variation data within existing
  resources, allowing for the identification of significant associations between epigenetic modifications and specific allelic variants
  in human and mouse cells. ALEA provides a customizable pipeline of command line tools for AS analysis of next-generation sequencing data
  (ChIP-seq, RNA-seq, etc.) that takes the raw sequencing data and produces separate allelic tracks ready to be viewed on genome browsers.
  ALEA takes advantage of the available genomic resources for human (The 1000 Genomes Project Consortium) and mouse (The Mouse Genome Project)
  to reconstruct diploid in silico genomes for human samples or hybrid mouse samples under study. Then, for each accompanying ChIP-seq or
  RNA-seq dataset, ALEA generates two wig files from short reads aligned differentially to each haplotype.
  This pipeline has been validated using human and hybrid mouse ChIP-seq and RNA-seq data (See Test Data section).

s:targetProduct:
  class: s:SoftwareApplication
  s:downloadUrl: ftp://ftp.bcgsc.ca/supplementary/ALEA/files/alea.1.2.2.tar.gz
  s:softwareVersion: "1.2.2"
  s:applicationCategory: "command line tool"

s:url: http://www.bcgsc.ca/platform/bioinfo/software/alea
s:license: https://opensource.org/licenses/AFL-3.0
s:programmingLanguage: "JAVA"

s:publication:
  - id: http://dx.doi.org/10.1093/bioinformatics/btt744

s:author:
- class: s:Person
  id: mailto:mkarimi@bcgsc.ca
  s:name: "Mohammad Karimi"
  s:email: mailto:mkarimi@bcgsc.ca
  s:url: http://www.bcgsc.ca/author/mkarimi
  s:worksFor:
  - class: s:Organization
    s:name: "Canada''s Michael Smith Genome Sciences Centre, BC Cancer Agency, Vancouver, British Columbia, V5Z 4S6, Canada"
  - class: s:Organization
    s:name: "Department of Medical Genetics, Life Sciences Institute, The University of British Columbia, Vancouver, British Columbia, V6T 1Z3, Canada"

', 'alea-metadata.yaml', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (23, 'class: EnvVarRequirement
envDef:
  - envName: "PATH"
    envValue: "/usr/local/bin/:/usr/bin:/bin"
', 'envvar-global.yml', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (24, 'class: DockerRequirement
dockerPull: scidap/alea:v1.2.2
#dockerImageId: scidap/alea:v1.2.2 #not yet ready
dockerFile: |
  #################################################################
  # Dockerfile
  #
  # Software:         Alea
  # Software Version: 1.2.2
  # Description:      Alea image for SciDAP
  # Website:          http://scidap.com/
  # Provides:         alea|bwa|Plink|vcftools|bedGraphToBigWig|shapeit2
  # Base Image:       scidap/scidap:v0.0.1
  # Build Cmd:        docker build --rm -t scidap/alea:v1.2.2 .
  # Pull Cmd:         docker pull scidap/alea:v1.2.2
  # Run Cmd:          docker run --rm scidap/alea:v1.2.2 alea
  #################################################################

  ### Base Image
  FROM scidap/scidap:v0.0.1
  MAINTAINER Andrey V Kartashov "porter@porter.st"
  ENV DEBIAN_FRONTEND noninteractive

  ################## BEGIN INSTALLATION ######################

  WORKDIR /tmp

  ### Install required packages (samtools)

  RUN apt-get clean all &&\
      apt-get update &&\
      apt-get install -y  \
        libncurses5-dev && \
      apt-get clean && \
      apt-get purge && \
      rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*


  ### Installing BWA

  ENV VERSION 0.7.12
  ENV NAME bwa
  ENV URL "https://github.com/lh3/bwa/archive/${VERSION}.tar.gz"

  RUN wget -q -O - $URL | tar -zxv && \
      cd ${NAME}-${VERSION} && \
      make -j 4 && \
      cd .. && \
      cp ./${NAME}-${VERSION}/${NAME} /usr/local/bin/ && \
      strip /usr/local/bin/${NAME}; true && \
      rm -rf ./${NAME}-${VERSION}/


  #  ### Installing bowtie
  #
  #  ENV VERSION 1.1.2
  #  ENV NAME bowtie
  #  ENV URL "https://github.com/BenLangmead/bowtie/archive/v${VERSION}.tar.gz"
  #
  #  RUN wget -q -O - $URL | tar -zxv && \
  #    cd ${NAME}-${VERSION} && \
  #    make -j 4 && \
  #    cd .. && \
  #    cp ./${NAME}-${VERSION}/${NAME} /usr/local/bin/ && \
  #    cp ./${NAME}-${VERSION}/${NAME}-* /usr/local/bin/ && \
  #    strip /usr/local/bin/*; true && \
  #    rm -rf ./${NAME}-${VERSION}/


  ### Installing samtools/htslib/tabix/bgzip

  ENV VERSIONH 1.2.1
  ENV NAMEH htslib
  ENV URLH "https://github.com/samtools/htslib/archive/${VERSIONH}.tar.gz"

  ENV VERSION "1.2"
  ENV NAME "samtools"
  ENV URL "https://github.com/samtools/samtools/archive/${VERSION}.tar.gz"

  RUN wget -q -O - $URLH | tar -zxv && \
      cd ${NAMEH}-${VERSIONH} && \
      make -j 4 && \
      cd .. && \
      cp ./${NAMEH}-${VERSIONH}/tabix /usr/local/bin/ && \
      cp ./${NAMEH}-${VERSIONH}/bgzip /usr/local/bin/ && \
      cp ./${NAMEH}-${VERSIONH}/htsfile /usr/local/bin/ && \
      strip /usr/local/bin/tabix; true && \
      strip /usr/local/bin/bgzip; true && \
      strip /usr/local/bin/htsfile; true && \
      ln -s ./${NAMEH}-${VERSIONH}/ ./${NAMEH} && \
      wget -q -O - $URL | tar -zxv && \
      cd ${NAME}-${VERSION} && \
      make -j 4 && \
      cd .. && \
      cp ./${NAME}-${VERSION}/${NAME} /usr/local/bin/ && \
      strip /usr/local/bin/${NAME}; true && \
      rm -rf ./${NAMEH}-${VERSIONH}/ && \
      rm -rf ./${NAME}-${VERSION}/


  ### Installing bedGraphToBigWig

  RUN  wget -q -O /usr/local/bin/bedGraphToBigWig  http://hgdownload.soe.ucsc.edu/admin/exe/linux.x86_64/bedGraphToBigWig && \
  chmod a+x /usr/local/bin/bedGraphToBigWig


  ### Installing VCFTools

  ENV VERSION 0.1.14
  ENV NAME vcftools
  ENV URL "https://github.com/vcftools/vcftools/releases/download/v${VERSION}/${NAME}-${VERSION}.tar.gz"

  RUN wget -q -O - $URL | tar -zxv && \
      cd ${NAME}-${VERSION} && \
      ./configure --prefix=/usr/local && \
      make -j 4 install && \
      cd .. && \
      rm -rf ./${NAME}-${VERSION}/


  ### Installing SHAPEIT2

  RUN wget -q -O - https://mathgen.stats.ox.ac.uk/genetics_software/shapeit/shapeit.v2.r837.GLIBCv2.20.Linux.static.tgz|tar -zxv -C /usr/local bin/shapeit && \
      chmod a+x /usr/local/bin/shapeit


  ### Installing plink

  RUN wget -q -O plink-1.07-x86_64.zip http://pngu.mgh.harvard.edu/~purcell/plink/dist/plink-1.07-x86_64.zip && \
      unzip plink-1.07-x86_64.zip && \
      cp plink-1.07-x86_64/* /usr/local/bin && \
      rm -rf plink-1.07-x86_64 && \
      rm -f plink-1.07-x86_64.zip


  ### Installing alea

  RUN wget -q -O - ftp://ftp.bcgsc.ca/supplementary/ALEA/files/alea.1.2.2.tar.gz | tar -zxv -C /usr/local --strip-components=1 && \
      cd /usr/local/bin/ && \
      printf ''144c144\n<                 --output-fasta="$VAR_GENOME1_SNPS"\n---\n>                 --output-fasta="$VAR_GENOME2_SNPS"\n''| patch createGenome.sh && \
      sed -i.bak s/^AL_BWA_ALN_PARAMS/#AL_BWA_ALN_PARAMS/g alea.config && \
      sed -i.bak s/^AL_USE_CONCATENATED_GENOME/#AL_USE_CONCATENATED_GENOME/g alea.config && \
      rm -f alea.config.bak
', 'alea-docker.yml', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (25, '#!/usr/bin/env cwl-runner

cwlVersion: "cwl:draft-3"

class: CommandLineTool

requirements:
  - $import: envvar-global.yml
  - $import: alea-docker.yml
  - class: InlineJavascriptRequirement

inputs:
  - id: "#hapsDir"
    type: File
    description: |
      path to the directory containing the .haps files
    inputBinding:
      position: 2

  - id: "#unphased"
    type: File
    description: |
      path to the vcf file containing unphased SNPs and Indels
    inputBinding:
      position: 3

  - id: "#outputPrefix"
    type: string
    description: |
      output file prefix including the path but not the extension
    inputBinding:
      position: 3

outputs:
  - id: "#phasevcf"
    type: File
    description: "Creates the file outputPrefix.vcf.gz"
    outputBinding:
      glob: $(inputs.outputPrefix+".vcf.gz")

baseCommand: ["alea", "phaseVCF"]

$namespaces:
  s: http://schema.org/

$schemas:
- https://sparql-test.commonwl.org/schema.rdf

s:mainEntity:
  $import: alea-metadata.yaml

s:downloadUrl: https://github.com/common-workflow-language/workflows/blob/master/tools/alea-phaseVCF.cwl
s:codeRepository: https://github.com/common-workflow-language/workflows
s:license: http://www.apache.org/licenses/LICENSE-2.0
s:isPartOf:
  class: s:CreativeWork
  s:name: "Common Workflow Language"
  s:url: http://commonwl.org/

s:author:
  class: s:Person
  s:name: "Andrey Kartashov"
  s:email: mailto:Andrey.Kartashov@cchmc.org
  s:sameAs:
  - id: http://orcid.org/0000-0001-9102-5681
  s:worksFor:
  - class: s:Organization
    s:name: "Cincinnati Children''s Hospital Medical Center"
    s:location: "3333 Burnet Ave, Cincinnati, OH 45229-3026"
    s:department:
    - class: s:Organization
      s:name: "Barski Lab"
', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (26, 'FROM ubuntu:12.04
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (27, 'class: Workflow
cwlVersion: v1.0

requirements:
 - class: ScatterFeatureRequirement
 - class: DockerRequirement
   dockerPull: java:7

inputs:
  pattern: string
  infiles: File[]

outputs:
  outfile:
    type: File
    outputSource: wc/outfile

steps:
  grep:
    run: grep.cwl
    in:
      pattern: pattern
      infile: infiles
    scatter: infile
    out: [outfile]

  wc:
    run: wc.cwl
    in:
      infiles: grep/outfile
out: [outfile]
', 'grep-and-count.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (31, 'cwlVersion: v1.0
class: CommandLineTool
label: Example trivial wrapper for Java 7 compiler
baseCommand: javac
hints:
  - DockerRequirement:
      dockerPull: java:7
baseCommand: javac
arguments: ["-d", $(runtime.outdir)]
inputs:
  src:
    type: File
    inputBinding:
      position: 1
outputs:
  classfile:
    type: File
    outputBinding:
glob: "*.class"
', 'arguments.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (32, 'cwlVersion: v1.0
class: CommandLineTool
baseCommand: [tar, xf]
inputs:
  tarfile:
    type: File
    inputBinding:
      position: 1
  extractfile:
    type: string
    inputBinding:
      position: 2
outputs:
  example_out:
    type: File
    outputBinding:
glob: $(inputs.extractfile)
', 'tar-param.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile VALUES (35, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/testDir/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile VALUES (36, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/testDir/Dockerfile', 'DOCKERFILE');


--
-- Name: sourcefile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('sourcefile_id_seq', 36, true);


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO tag VALUES (1, false, false, '2016-02-04 16:44:00', 'test', 'feature/test', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '84fc64995896cd90f9b9732e28d4115e82dd471c40925b0ba34c9a419fbe2fa8', 108608297, '/Dockstore.wdl');
INSERT INTO tag VALUES (2, false, false, '2016-02-16 17:06:55', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'e919f2df4a7b01f3be3dc74483544cd9ee8396714dfdbb2e41679039de7cc3e1', 108608275, '/Dockstore.wdl');
INSERT INTO tag VALUES (3, false, false, '2016-02-16 17:06:56', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'e919f2df4a7b01f3be3dc74483544cd9ee8396714dfdbb2e41679039de7cc3e1', 108608275, '/Dockstore.wdl');
INSERT INTO tag VALUES (4, false, false, '2016-03-15 15:41:00', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '2cf0cccd32556daf9a0137277938d6f033b7a7c5d65628b582b2ed9afdde40f5', 108722095, '/Dockstore.wdl');
INSERT INTO tag VALUES (5, false, false, '2016-03-15 15:41:03', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '2cf0cccd32556daf9a0137277938d6f033b7a7c5d65628b582b2ed9afdde40f5', 108722095, '/Dockstore.wdl');
INSERT INTO tag VALUES (8, false, false, '2016-03-15 15:42:04', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'f92aa8edcc265e4d5faabf7f89157008d52d514f8f6d7c1b833024f58f126e9d', 108722128, '/Dockstore.wdl');
INSERT INTO tag VALUES (9, false, false, '2016-03-15 15:42:05', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'f92aa8edcc265e4d5faabf7f89157008d52d514f8f6d7c1b833024f58f126e9d', 108722128, '/Dockstore.wdl');
INSERT INTO tag VALUES (10, false, false, '2016-06-08 14:08:08', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '9227b87c1304b9ce746d06d0eb8144ec17a253f5b8e00a3922d86b538c8296c0', 44363874, '/Dockstore.wdl');
INSERT INTO tag VALUES (11, false, false, '2016-06-08 14:08:08', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '9227b87c1304b9ce746d06d0eb8144ec17a253f5b8e00a3922d86b538c8296c0', 44363874, '/Dockstore.wdl');
INSERT INTO tag VALUES (6, false, false, '2016-03-15 15:39:17', 'master', 'master', false, false, NULL, true, '/Dockstore.cwl', '/testDir/Dockerfile', '8079f14d756280940d56957f0e1ddb14b8d3124a8d1d195f4a51f2a051d84726', 108722088, '/Dockstore.wdl');
INSERT INTO tag VALUES (7, false, false, '2016-03-15 15:39:19', 'latest', 'master', false, false, NULL, true, '/Dockstore.cwl', '/testDir/Dockerfile', '8079f14d756280940d56957f0e1ddb14b8d3124a8d1d195f4a51f2a051d84726', 108722088, '/Dockstore.wdl');


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('tag_id_seq', 51, true);


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO token VALUES (1, 'imamafakedockstoretoken', NULL, 'dockstore', 1, 'user_A');
INSERT INTO token VALUES (2, 'imamafakegithubtoken', NULL, 'github.com', 1, 'user_A');
INSERT INTO token VALUES (4, 'imamafakequaytoken', NULL, 'quay.io', 1, 'user_A');
--INSERT INTO token VALUES (3, 'imamafakebitbuckettoken', 'imamafakebitbuckettokenhelper', 'bitbucket.org', 1, 'user_A');


--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('token_id_seq', 4, true);


--
-- Data for Name: tool; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO tool VALUES (1, 'testuser', NULL, 'Whalesay deep quotes', NULL, 'git@github.com:A/a.git', false, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', '/Dockstore.wdl', '2016-02-16 17:04:59', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'a', 'A', 'quay.io/A/a', 'AMAZON_ECR', '', 'test@email.com', true);
INSERT INTO tool VALUES (2, 'testuser2', NULL, 'Whalesay deep quotes', NULL, 'git@github.com:A2/b1.git', false, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', '/Dockstore.wdl', '2016-03-15 15:35:29', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b1', 'A2', 'quay.io/A2/b1', 'QUAY_IO', '', '', false);
INSERT INTO tool VALUES (5, NULL, NULL, '', NULL, 'git@github.com:A2/a.git', true, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', '/Dockstore.wdl', '2016-06-08 14:06:36', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'a', 'A2', 'quay.io/A2/a', 'QUAY_IO', '', '', false);
INSERT INTO tool VALUES (4, NULL, NULL, NULL, NULL, 'git@github.com:A2/b3.git', true, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', '/Dockstore.wdl', '2016-03-15 15:36:22', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b3', 'A2', 'quay.io/A2/b3', 'QUAY_IO', '', '', false);
INSERT INTO tool VALUES (3, NULL, NULL, NULL, NULL, 'git@github.com:A2/b2.git', false, NULL, '2016-11-28 15:02:48.557', '/Dockstore.cwl', '/testDir/Dockerfile', '/Dockstore.wdl', '2016-03-15 15:35:57', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b2', 'A2', 'quay.io/A2/b2', 'QUAY_IO', '', '', false);


--
-- Data for Name: tool_tag; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO tool_tag VALUES (1, 1);
INSERT INTO tool_tag VALUES (1, 2);
INSERT INTO tool_tag VALUES (1, 3);
INSERT INTO tool_tag VALUES (2, 4);
INSERT INTO tool_tag VALUES (2, 5);
INSERT INTO tool_tag VALUES (3, 6);
INSERT INTO tool_tag VALUES (3, 7);
INSERT INTO tool_tag VALUES (4, 8);
INSERT INTO tool_tag VALUES (4, 9);
INSERT INTO tool_tag VALUES (5, 10);
INSERT INTO tool_tag VALUES (5, 11);


--
-- Data for Name: user_entry; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO user_entry VALUES (1, 1);
INSERT INTO user_entry VALUES (1, 2);
INSERT INTO user_entry VALUES (1, 3);
INSERT INTO user_entry VALUES (1, 4);
INSERT INTO user_entry VALUES (1, 5);
INSERT INTO user_entry VALUES (1, 6);
INSERT INTO user_entry VALUES (1, 7);
INSERT INTO user_entry VALUES (1, 8);
INSERT INTO user_entry VALUES (1, 9);
INSERT INTO user_entry VALUES (1, 10);
INSERT INTO user_entry VALUES (1, 11);
INSERT INTO user_entry VALUES (1, 12);
INSERT INTO user_entry VALUES (1, 13);
INSERT INTO user_entry VALUES (1, 14);
INSERT INTO user_entry VALUES (1, 16);
INSERT INTO user_entry VALUES (1, 17);
INSERT INTO user_entry VALUES (1, 18);
INSERT INTO user_entry VALUES (1, 19);
INSERT INTO user_entry VALUES (1, 20);


--
-- Data for Name: usergroup; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Name: usergroup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('usergroup_id_seq', 1, false);


--
-- Data for Name: version_sourcefile; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO version_sourcefile VALUES (1, 2);
INSERT INTO version_sourcefile VALUES (1, 1);
INSERT INTO version_sourcefile VALUES (2, 4);
INSERT INTO version_sourcefile VALUES (2, 3);
INSERT INTO version_sourcefile VALUES (2, 5);
INSERT INTO version_sourcefile VALUES (3, 8);
INSERT INTO version_sourcefile VALUES (3, 6);
INSERT INTO version_sourcefile VALUES (3, 7);
INSERT INTO version_sourcefile VALUES (4, 10);
INSERT INTO version_sourcefile VALUES (4, 9);
INSERT INTO version_sourcefile VALUES (5, 12);
INSERT INTO version_sourcefile VALUES (5, 11);
INSERT INTO version_sourcefile VALUES (8, 13);
INSERT INTO version_sourcefile VALUES (8, 14);
INSERT INTO version_sourcefile VALUES (9, 16);
INSERT INTO version_sourcefile VALUES (9, 15);
INSERT INTO version_sourcefile VALUES (10, 17);
INSERT INTO version_sourcefile VALUES (10, 19);
INSERT INTO version_sourcefile VALUES (10, 20);
INSERT INTO version_sourcefile VALUES (10, 18);
INSERT INTO version_sourcefile VALUES (10, 21);
INSERT INTO version_sourcefile VALUES (11, 26);
INSERT INTO version_sourcefile VALUES (11, 23);
INSERT INTO version_sourcefile VALUES (11, 22);
INSERT INTO version_sourcefile VALUES (11, 24);
INSERT INTO version_sourcefile VALUES (11, 25);
INSERT INTO version_sourcefile VALUES (13, 27);
INSERT INTO version_sourcefile VALUES (13, 28);
INSERT INTO version_sourcefile VALUES (13, 30);
INSERT INTO version_sourcefile VALUES (13, 32);
INSERT INTO version_sourcefile VALUES (13, 29);
INSERT INTO version_sourcefile VALUES (13, 31);
INSERT INTO version_sourcefile VALUES (6, 35);
INSERT INTO version_sourcefile VALUES (7, 36);


--
-- Data for Name: workflow; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO workflow VALUES (6, NULL, NULL, NULL, NULL, 'git@bitbucket.org:a/a.git', false, NULL, '2016-11-28 15:00:57.148', '/Dockstore.cwl', 'cwl', 'STUB', 'a', 'a/a', 'a', NULL);
INSERT INTO workflow VALUES (7, NULL, NULL, NULL, NULL, 'git@github.com:A/c.git', false, NULL, '2016-11-28 15:00:57.315', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/c', 'c', NULL);
INSERT INTO workflow VALUES (8, NULL, NULL, NULL, NULL, 'git@github.com:A/f.git', false, NULL, '2016-11-28 15:00:57.419', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/f', 'f', NULL);
INSERT INTO workflow VALUES (9, NULL, NULL, NULL, NULL, 'git@github.com:A/k.git', false, NULL, '2016-11-28 15:00:57.482', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/k', 'k', NULL);
INSERT INTO workflow VALUES (10, NULL, NULL, NULL, NULL, 'git@github.com:A/e.git', false, NULL, '2016-11-28 15:00:57.593', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/e', 'e', NULL);
INSERT INTO workflow VALUES (12, NULL, NULL, NULL, NULL, 'git@github.com:A/g.git', false, NULL, '2016-11-28 15:00:57.788', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/g', 'g', NULL);
INSERT INTO workflow VALUES (13, NULL, NULL, NULL, NULL, 'git@github.com:A/j.git', false, NULL, '2016-11-28 15:00:57.792', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/j', 'j', NULL);
INSERT INTO workflow VALUES (14, NULL, NULL, NULL, NULL, 'git@github.com:A/m.git', false, NULL, '2016-11-28 15:00:57.859', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/m', 'm', NULL);
INSERT INTO workflow VALUES (16, NULL, NULL, NULL, NULL, 'git@github.com:A/d.git', false, NULL, '2016-11-28 15:00:58.068', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/d', 'd', NULL);
INSERT INTO workflow VALUES (17, NULL, NULL, NULL, NULL, 'git@github.com:A/i.git', false, NULL, '2016-11-28 15:00:58.073', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/i', 'i', NULL);
INSERT INTO workflow VALUES (18, NULL, NULL, NULL, NULL, 'git@github.com:A/b.git', false, NULL, '2016-11-28 15:00:58.153', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/b', 'b', NULL);
INSERT INTO workflow VALUES (19, NULL, NULL, NULL, NULL, 'git@github.com:A/h.git', false, NULL, '2016-11-28 15:00:58.157', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/h', 'h', NULL);
INSERT INTO workflow VALUES (20, NULL, NULL, NULL, NULL, 'git@github.com:A/a.git', false, NULL, '2016-11-28 15:00:57.948', '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'A/a', 'a', NULL);
INSERT INTO workflow VALUES (11, NULL, NULL, NULL, NULL, 'git@github.com:A/l.git', true, NULL, '2016-11-28 15:00:57.688', '/1st-workflow.cwl', 'cwl', 'FULL', 'A', 'A/l', 'l', NULL);


--
-- Data for Name: workflow_workflowversion; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO workflow_workflowversion VALUES (11, 13);


--
-- Data for Name: workflowversion; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO workflowversion VALUES (13, false, false, '2016-11-28 15:01:57.003', 'master', 'master', true, false, NULL, '/1st-workflow.cwl');


--
-- Name: enduser_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY enduser
    ADD CONSTRAINT enduser_pkey PRIMARY KEY (id);


--
-- Name: endusergroup_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY endusergroup
    ADD CONSTRAINT endusergroup_pkey PRIMARY KEY (userid, groupid);


--
-- Name: entry_label_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY entry_label
    ADD CONSTRAINT entry_label_pkey PRIMARY KEY (entryid, labelid);


--
-- Name: label_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY label
    ADD CONSTRAINT label_pkey PRIMARY KEY (id);


--
-- Name: sourcefile_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY sourcefile
    ADD CONSTRAINT sourcefile_pkey PRIMARY KEY (id);


--
-- Name: tag_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: token_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: tool_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY tool
    ADD CONSTRAINT tool_pkey PRIMARY KEY (id);


--
-- Name: tool_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY tool_tag
    ADD CONSTRAINT tool_tag_pkey PRIMARY KEY (toolid, tagid);


--
-- Name: uk_9vcoeu4nuu2ql7fh05mn20ydd; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY enduser
    ADD CONSTRAINT uk_9vcoeu4nuu2ql7fh05mn20ydd UNIQUE (username);


--
-- Name: uk_9xhsn1bsea2csoy3l0gtq41vv; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY label
    ADD CONSTRAINT uk_9xhsn1bsea2csoy3l0gtq41vv UNIQUE (value);


--
-- Name: uk_e2j71kjdot9b8l5qmjw2ve38o; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY version_sourcefile
    ADD CONSTRAINT uk_e2j71kjdot9b8l5qmjw2ve38o UNIQUE (sourcefileid);


--
-- Name: uk_encl8hnebnkcaxj9tlugr9cxh; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY workflow_workflowversion
    ADD CONSTRAINT uk_encl8hnebnkcaxj9tlugr9cxh UNIQUE (workflowversionid);


--
-- Name: uk_jdgfioq44aqox39xrs1wceow1; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY tool_tag
    ADD CONSTRAINT uk_jdgfioq44aqox39xrs1wceow1 UNIQUE (tagid);


--
-- Name: ukbq5vy17y4ocaist3d3r3imcus; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY tool
    ADD CONSTRAINT ukbq5vy17y4ocaist3d3r3imcus UNIQUE (registry, namespace, name, toolname);


--
-- Name: ukkprrtg54h6rjca5l1navospm8; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY workflow
    ADD CONSTRAINT ukkprrtg54h6rjca5l1navospm8 UNIQUE (organization, repository, workflowname);


--
-- Name: user_entry_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY user_entry
    ADD CONSTRAINT user_entry_pkey PRIMARY KEY (entryid, userid);


--
-- Name: usergroup_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY usergroup
    ADD CONSTRAINT usergroup_pkey PRIMARY KEY (id);


--
-- Name: version_sourcefile_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY version_sourcefile
    ADD CONSTRAINT version_sourcefile_pkey PRIMARY KEY (versionid, sourcefileid);


--
-- Name: workflow_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY workflow
    ADD CONSTRAINT workflow_pkey PRIMARY KEY (id);


--
-- Name: workflow_workflowversion_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY workflow_workflowversion
    ADD CONSTRAINT workflow_workflowversion_pkey PRIMARY KEY (workflowid, workflowversionid);


--
-- Name: workflowversion_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore; Tablespace:
--

ALTER TABLE ONLY workflowversion
    ADD CONSTRAINT workflowversion_pkey PRIMARY KEY (id);


--
-- Name: fkhdtovkjeuj2u4adc073nh02w; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY user_entry
    ADD CONSTRAINT fkhdtovkjeuj2u4adc073nh02w FOREIGN KEY (userid) REFERENCES enduser(id);


--
-- Name: fkibmeux3552ua8dwnqdb8w6991; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY workflow_workflowversion
    ADD CONSTRAINT fkibmeux3552ua8dwnqdb8w6991 FOREIGN KEY (workflowversionid) REFERENCES workflowversion(id);


--
-- Name: fkjkn6qubuvn25bun52eqjleyl6; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY tool_tag
    ADD CONSTRAINT fkjkn6qubuvn25bun52eqjleyl6 FOREIGN KEY (tagid) REFERENCES tag(id);


--
-- Name: fkjtsjg6jdnwxoeicd27ujmeeaj; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY tool_tag
    ADD CONSTRAINT fkjtsjg6jdnwxoeicd27ujmeeaj FOREIGN KEY (toolid) REFERENCES tool(id);


--
-- Name: fkl8yg13ahjhtn0notrlf3amwwi; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY workflow_workflowversion
    ADD CONSTRAINT fkl8yg13ahjhtn0notrlf3amwwi FOREIGN KEY (workflowid) REFERENCES workflow(id);


--
-- Name: fkm0exig2r3dsxqafwaraf7rnr3; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY endusergroup
    ADD CONSTRAINT fkm0exig2r3dsxqafwaraf7rnr3 FOREIGN KEY (groupid) REFERENCES usergroup(id);


--
-- Name: fkmby5o476bdwrx07ax2keoyttn; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY version_sourcefile
    ADD CONSTRAINT fkmby5o476bdwrx07ax2keoyttn FOREIGN KEY (sourcefileid) REFERENCES sourcefile(id);


--
-- Name: fkrxn6hh2max4sk4ceehyv7mt2e; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY endusergroup
    ADD CONSTRAINT fkrxn6hh2max4sk4ceehyv7mt2e FOREIGN KEY (userid) REFERENCES enduser(id);


--
-- Name: fks71c9mk0f98015eqgtyvs0ewp; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY entry_label
    ADD CONSTRAINT fks71c9mk0f98015eqgtyvs0ewp FOREIGN KEY (labelid) REFERENCES label(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

