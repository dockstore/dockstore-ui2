--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.11
-- Dumped by pg_dump version 9.5.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

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
-- Name: container_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE container_id_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE databasechangelog OWNER TO postgres;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE databasechangeloglock OWNER TO postgres;

--
-- Name: enduser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE enduser (
    id bigint NOT NULL,
    avatarurl character varying(255),
    bio character varying(255),
    company character varying(255),
    email character varying(255),
    isadmin boolean,
    location character varying(255),
    username character varying(255) NOT NULL
);


ALTER TABLE enduser OWNER TO postgres;

--
-- Name: enduser_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE enduser_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE enduser_id_seq OWNER TO postgres;

--
-- Name: enduser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE enduser_id_seq OWNED BY enduser.id;


--
-- Name: endusergroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE endusergroup (
    groupid bigint NOT NULL,
    userid bigint NOT NULL
);


ALTER TABLE endusergroup OWNER TO postgres;

--
-- Name: entry_label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE entry_label (
    entryid bigint NOT NULL,
    labelid bigint NOT NULL
);


ALTER TABLE entry_label OWNER TO postgres;

--
-- Name: label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE label (
    id bigint NOT NULL,
    value character varying(255)
);


ALTER TABLE label OWNER TO postgres;

--
-- Name: label_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE label_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE label_id_seq OWNER TO postgres;

--
-- Name: label_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE label_id_seq OWNED BY label.id;


--
-- Name: sourcefile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE sourcefile (
    id bigint NOT NULL,
    content text,
    path character varying(255) NOT NULL,
    type character varying(255)
);


ALTER TABLE sourcefile OWNER TO postgres;

--
-- Name: sourcefile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sourcefile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sourcefile_id_seq OWNER TO postgres;

--
-- Name: sourcefile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sourcefile_id_seq OWNED BY sourcefile.id;


--
-- Name: starred; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE starred (
    userid bigint NOT NULL,
    entryid bigint NOT NULL
);


ALTER TABLE starred OWNER TO postgres;

--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE tag (
    id bigint NOT NULL,
    dirtybit boolean DEFAULT false,
    hidden boolean,
    lastmodified timestamp without time zone,
    name character varying(255),
    reference character varying(255),
    valid boolean,
    verified boolean DEFAULT false,
    verifiedsource character varying(255),
    automated boolean,
    cwlpath text NOT NULL,
    dockerfilepath text NOT NULL,
    imageid character varying(255),
    size bigint,
    wdlpath text DEFAULT '/Dockstore.wdl'::text NOT NULL,
    doistatus text DEFAULT 'NOT_REQUESTED'::text NOT NULL,
    doiurl character varying(255)
);


ALTER TABLE tag OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tag_id_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tag_id_seq OWNER TO postgres;

--
-- Name: token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE token (
    id bigint NOT NULL,
    content character varying(255) NOT NULL,
    refreshtoken character varying(255),
    tokensource character varying(255) NOT NULL,
    userid bigint,
    username character varying(255) NOT NULL
);


ALTER TABLE token OWNER TO postgres;

--
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE token_id_seq OWNER TO postgres;

--
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE token_id_seq OWNED BY token.id;


--
-- Name: tool; Type: TABLE; Schema: public; Owner: postgres
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
    defaultdockerfilepath text NOT NULL,
    defaulttestcwlparameterfile text,
    defaulttestwdlparameterfile text,
    defaultwdlpath text DEFAULT '/Dockstore.wdl'::text,
    lastbuild timestamp without time zone,
    mode text DEFAULT 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS'::text NOT NULL,
    name character varying(255) NOT NULL,
    namespace character varying(255),
    privateaccess boolean DEFAULT false,
    registry character varying(255) NOT NULL,
    toolmaintaineremail character varying(255),
    toolname text NOT NULL,
    customdockerregistrypath text
);


ALTER TABLE tool OWNER TO postgres;

--
-- Name: tool_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE tool_tag (
    toolid bigint NOT NULL,
    tagid bigint NOT NULL
);


ALTER TABLE tool_tag OWNER TO postgres;

--
-- Name: user_entry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE user_entry (
    userid bigint NOT NULL,
    entryid bigint NOT NULL
);


ALTER TABLE user_entry OWNER TO postgres;

--
-- Name: usergroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE usergroup (
    id bigint NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE usergroup OWNER TO postgres;

--
-- Name: usergroup_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE usergroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE usergroup_id_seq OWNER TO postgres;

--
-- Name: usergroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE usergroup_id_seq OWNED BY usergroup.id;


--
-- Name: version_sourcefile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE version_sourcefile (
    versionid bigint NOT NULL,
    sourcefileid bigint NOT NULL
);


ALTER TABLE version_sourcefile OWNER TO postgres;

--
-- Name: workflow; Type: TABLE; Schema: public; Owner: postgres
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
    defaulttestparameterfilepath text,
    defaultworkflowpath text,
    descriptortype character varying(255) NOT NULL,
    mode text DEFAULT 'STUB'::text NOT NULL,
    organization character varying(255) NOT NULL,
    repository character varying(255) NOT NULL,
    workflowname text,
    sourcecontrol text NOT NULL,
    CONSTRAINT workflow_workflowname_notempty CHECK ((workflowname <> ''::text))
);


ALTER TABLE workflow OWNER TO postgres;

--
-- Name: workflow_workflowversion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE workflow_workflowversion (
    workflowid bigint NOT NULL,
    workflowversionid bigint NOT NULL
);


ALTER TABLE workflow_workflowversion OWNER TO postgres;

--
-- Name: workflowversion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE workflowversion (
    id bigint NOT NULL,
    dirtybit boolean DEFAULT false,
    hidden boolean,
    lastmodified timestamp without time zone,
    name character varying(255),
    reference character varying(255),
    valid boolean,
    verified boolean DEFAULT false,
    verifiedsource character varying(255),
    workflowpath text NOT NULL,
    doistatus text DEFAULT 'NOT_REQUESTED'::text NOT NULL,
    doiurl character varying(255)
);


ALTER TABLE workflowversion OWNER TO postgres;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY enduser ALTER COLUMN id SET DEFAULT nextval('enduser_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY label ALTER COLUMN id SET DEFAULT nextval('label_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sourcefile ALTER COLUMN id SET DEFAULT nextval('sourcefile_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY token ALTER COLUMN id SET DEFAULT nextval('token_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY usergroup ALTER COLUMN id SET DEFAULT nextval('usergroup_id_seq'::regclass);


--
-- Name: container_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('container_id_seq', 101, true);


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-1', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.894584', 1, 'EXECUTED', '7:45eddb8745751992c52a60a4837da953', 'createSequence sequenceName=container_id_seq', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-2', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.914276', 2, 'EXECUTED', '7:cf8318665e9225d32fd3aac343ef329e', 'createSequence sequenceName=tag_id_seq', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-3', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.947451', 3, 'EXECUTED', '7:4e88a3a005e06c39586e9b9cb841f9c4', 'createTable tableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-4', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.95828', 4, 'EXECUTED', '7:857c5c872f1dd7d5e40f5fdad75b36c2', 'createTable tableName=endusergroup', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-5', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.971068', 5, 'EXECUTED', '7:2077be1344f33e3e60c6728f0e1948bc', 'createTable tableName=entry_label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-6', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.993357', 6, 'EXECUTED', '7:acda3ed025cca7431c507ec5c24efc80', 'createTable tableName=label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-7', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.024609', 7, 'EXECUTED', '7:0a1fd7e5df8286dd18889cfa9824d74e', 'createTable tableName=sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-8', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.041809', 8, 'EXECUTED', '7:39f7133dc4e636d91ed03e90f6e466d1', 'createTable tableName=starred', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-9', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.0648', 9, 'EXECUTED', '7:de62b75c40bed7906f0a2a07fcfe798a', 'createTable tableName=tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-10', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.101411', 10, 'EXECUTED', '7:34123af99b249b83326a030f09289361', 'createTable tableName=token', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-11', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.124831', 11, 'EXECUTED', '7:59558bfce3acb7c2c8a37de2d78b3cff', 'createTable tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-12', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.141314', 12, 'EXECUTED', '7:4fa35dd2f319c47cc572ac3ef9db9e01', 'createTable tableName=tool_tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-13', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.15083', 13, 'EXECUTED', '7:550fe0f4db75f0385176a18350674cc2', 'createTable tableName=user_entry', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-14', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.171975', 14, 'EXECUTED', '7:940ac305506d20beaf1e7a7ba1d5c823', 'createTable tableName=usergroup', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-15', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.184509', 15, 'EXECUTED', '7:3232bf9686b9a2351fddcc9f99718b82', 'createTable tableName=version_sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-16', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.212966', 16, 'EXECUTED', '7:55c3cd8734c4e60616017dd4dc3984ac', 'createTable tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-17', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.22254', 17, 'EXECUTED', '7:d2a41c88e8854a65a830ff5bbb38a2f1', 'createTable tableName=workflow_workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-18', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.244385', 18, 'EXECUTED', '7:c7f7fd98188f9b5d29cafd992cc87e78', 'createTable tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-19', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.264563', 19, 'EXECUTED', '7:127d247cb20a76c99d356cc7618017e3', 'addPrimaryKey constraintName=endusergroup_pkey, tableName=endusergroup', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-20', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.284108', 20, 'EXECUTED', '7:86a7318e76a64872c5b763a3aaa46de3', 'addPrimaryKey constraintName=entry_label_pkey, tableName=entry_label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-21', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.303926', 21, 'EXECUTED', '7:6a2dd4c27116dc6c1f31875bbfb9507c', 'addPrimaryKey constraintName=starred_pkey, tableName=starred', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-22', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.324215', 22, 'EXECUTED', '7:f7fed41b485e3ccf42a788806021690d', 'addPrimaryKey constraintName=tag_pkey, tableName=tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-23', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.349086', 23, 'EXECUTED', '7:5eb5cd32f40dd0599195075e121a60e8', 'addPrimaryKey constraintName=tool_pkey, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-24', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.368474', 24, 'EXECUTED', '7:76fa5d53a4f9fff8f107af89e36ba6fb', 'addPrimaryKey constraintName=tool_tag_pkey, tableName=tool_tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-25', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.387882', 25, 'EXECUTED', '7:f0af74b60138b0c95bbe9a7f9a72d8cf', 'addPrimaryKey constraintName=user_entry_pkey, tableName=user_entry', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-26', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.407307', 26, 'EXECUTED', '7:d54d0357d7259be4ef17e7388e22edc1', 'addPrimaryKey constraintName=version_sourcefile_pkey, tableName=version_sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-27', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.427266', 27, 'EXECUTED', '7:e5b8415233c835299adf2e27b156111f', 'addPrimaryKey constraintName=workflow_pkey, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-28', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.446986', 28, 'EXECUTED', '7:2190163d7e905b4bfb466d45a6dd04c7', 'addPrimaryKey constraintName=workflow_workflowversion_pkey, tableName=workflow_workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-29', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.466597', 29, 'EXECUTED', '7:681c290ba322c816d89ac5d27c6c8ed0', 'addPrimaryKey constraintName=workflowversion_pkey, tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-30', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.487882', 30, 'EXECUTED', '7:18962c12c14f2d23d3dc3fb8fe56aa5e', 'addUniqueConstraint constraintName=uk_9vcoeu4nuu2ql7fh05mn20ydd, tableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-31', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.507283', 31, 'EXECUTED', '7:59b6bd3c5e90087868e9a5338e06f7cf', 'addUniqueConstraint constraintName=uk_9xhsn1bsea2csoy3l0gtq41vv, tableName=label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-32', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.526678', 32, 'EXECUTED', '7:d70e892c49df4198946af35f061eb526', 'addUniqueConstraint constraintName=uk_e2j71kjdot9b8l5qmjw2ve38o, tableName=version_sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-33', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.545829', 33, 'EXECUTED', '7:ecb3169946e4abde6e7db3b7b90320e3', 'addUniqueConstraint constraintName=uk_encl8hnebnkcaxj9tlugr9cxh, tableName=workflow_workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-34', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.56573', 34, 'EXECUTED', '7:f8af27a12385a1e0b9dc9bb328dded15', 'addUniqueConstraint constraintName=uk_jdgfioq44aqox39xrs1wceow1, tableName=tool_tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-35', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.584902', 35, 'EXECUTED', '7:ead6ee106e254c3e02aebc4a1c41d825', 'addUniqueConstraint constraintName=ukbq5vy17y4ocaist3d3r3imcus, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-36', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.60399', 36, 'EXECUTED', '7:b9f1f2a6e1a96d75938e8827a7dd559d', 'addUniqueConstraint constraintName=ukkprrtg54h6rjca5l1navospm8, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511391708947-37', 'dyuen (generated)-edited', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.624468', 37, 'EXECUTED', '7:c5e97c896ebc74e8b1aa39b406015c6d', 'createIndex indexName=full_tool_name, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511391708947-38', 'dyuen (generated)-edited', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.644936', 38, 'EXECUTED', '7:1f5307dbadad2ccff5a663422137dd71', 'createIndex indexName=full_workflow_name, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511391708947-39', 'dyuen (generated)-edited', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.664768', 39, 'EXECUTED', '7:310ec5a6dacbe61af9d19013512ffd83', 'createIndex indexName=partial_tool_name, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511391708947-40', 'dyuen (generated)-edited', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.68334', 40, 'EXECUTED', '7:cf8d1c10cd33f299b42ac2240c728e4d', 'createIndex indexName=partial_workflow_name, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-41', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.696176', 41, 'EXECUTED', '7:0c7ce6a127a9012aed693363dac772d5', 'addForeignKeyConstraint baseTableName=starred, constraintName=fkdcfqiy0arvxmmh5e68ix75gwo, referencedTableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-42', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.706865', 42, 'EXECUTED', '7:6b9100d7e34bb424f76158d403a3c0b8', 'addForeignKeyConstraint baseTableName=user_entry, constraintName=fkhdtovkjeuj2u4adc073nh02w, referencedTableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-43', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.717102', 43, 'EXECUTED', '7:a60712d9bf2d992fa02f898683b8243c', 'addForeignKeyConstraint baseTableName=workflow_workflowversion, constraintName=fkibmeux3552ua8dwnqdb8w6991, referencedTableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-44', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.729006', 44, 'EXECUTED', '7:f734d3e7053aaff7c596cdfe6563c316', 'addForeignKeyConstraint baseTableName=tool_tag, constraintName=fkjkn6qubuvn25bun52eqjleyl6, referencedTableName=tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-45', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.739748', 45, 'EXECUTED', '7:4ff9f7720b66915d552d0c219cfd9750', 'addForeignKeyConstraint baseTableName=tool_tag, constraintName=fkjtsjg6jdnwxoeicd27ujmeeaj, referencedTableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-46', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.749921', 46, 'EXECUTED', '7:0d16cb7474dee760b2a3c474a193d8d3', 'addForeignKeyConstraint baseTableName=workflow_workflowversion, constraintName=fkl8yg13ahjhtn0notrlf3amwwi, referencedTableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-47', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.762168', 47, 'EXECUTED', '7:e7a65a95719d4640ac9140b392c17b88', 'addForeignKeyConstraint baseTableName=endusergroup, constraintName=fkm0exig2r3dsxqafwaraf7rnr3, referencedTableName=usergroup', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-48', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.772623', 48, 'EXECUTED', '7:ce3c42746474158bdd5058658709e3c5', 'addForeignKeyConstraint baseTableName=version_sourcefile, constraintName=fkmby5o476bdwrx07ax2keoyttn, referencedTableName=sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-49', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.783349', 49, 'EXECUTED', '7:148319c1373ed2e5ae8105df4a593e8d', 'addForeignKeyConstraint baseTableName=endusergroup, constraintName=fkrxn6hh2max4sk4ceehyv7mt2e, referencedTableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-50', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.793651', 50, 'EXECUTED', '7:77453359c92cf134f8aec571ea785714', 'addForeignKeyConstraint baseTableName=entry_label, constraintName=fks71c9mk0f98015eqgtyvs0ewp, referencedTableName=label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflowWorkflownameConvertEmptyStringToNull', 'gluu', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.584697', 51, 'EXECUTED', '7:fefcc071200d5dadf0907bd192dc88da', 'update tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('addWorkflowWorkflownameNotEmptyConstraint', 'gluu', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.598251', 52, 'EXECUTED', '7:3e6ef47c3241d3027c8198dad0ce3260', 'sql', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('74274923472389478923', 'agduncan', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.650556', 53, 'EXECUTED', '7:32495c4abfe9554bea994fd12ad08272', 'addColumn tableName=workflow; sql; sql; sql; sql; sql; sql; addNotNullConstraint columnName=sourcecontrol, tableName=workflow; sql; sql; sql; sql; sql; sql', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('custom_tool_sequence1', 'dyuen', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.661272', 54, 'EXECUTED', '7:ffea8875af6c3a7152e257cb080494bd', 'sql', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('custom_tag_sequence2', 'dyuen', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.672744', 55, 'EXECUTED', '7:d6953fc6a3408ee815050f0dd762cf03', 'sql', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflowWorkflownameConvertEmptyStringToNull', 'gluu', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:38:55.122412', 1, 'EXECUTED', '7:fefcc071200d5dadf0907bd192dc88da', 'update tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775135109');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('addWorkflowWorkflownameNotEmptyConstraint', 'gluu', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:38:55.137851', 2, 'EXECUTED', '7:3e6ef47c3241d3027c8198dad0ce3260', 'sql', '', NULL, '3.5.3', NULL, NULL, '5775135109');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('addCustomDockerRegistryPath', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.014385', 56, 'EXECUTED', '7:be0c4b6e5be6b34bef2459aa61a6fbd6', 'addColumn tableName=tool', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('updateAmazonCustomDockerRegistryPath', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.043835', 57, 'EXECUTED', '7:abfaad1c15020be7c1ac1d07408034db', 'sql', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('dropWorkflowPath', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.070145', 58, 'EXECUTED', '7:319cd9e44b15d6760d6cc5acad01f4cc', 'dropColumn columnName=path, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('dropToolPath', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.095693', 59, 'EXECUTED', '7:a1a29cd690ef5ef4c75cc3a23312f0b8', 'dropColumn columnName=path, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-1', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.204314', 60, 'EXECUTED', '7:d8d8a4d446e1c3a4fe0bb622eb141221', 'addColumn tableName=tag', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-2', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.302286', 61, 'EXECUTED', '7:9dd05a2ade4a535bd3a3911950a2b084', 'addColumn tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-3', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.325685', 62, 'EXECUTED', '7:59ac9ed5e01b10c07ef316723271fd01', 'addColumn tableName=tag', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-4', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.349088', 63, 'EXECUTED', '7:c4107502953ffeb230d9470f04e20c1e', 'addColumn tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516220040864-6', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.373742', 64, 'EXECUTED', '7:c2e8572dacac26a58d8290df8a9bb15b', 'addNotNullConstraint columnName=doistatus, tableName=tag', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516220040864-7', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.398913', 65, 'EXECUTED', '7:b0138c55c539c1421b9e5791a228dff3', 'addNotNullConstraint columnName=doistatus, tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '8640795994');


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO databasechangeloglock (id, locked, lockgranted, lockedby) VALUES (1, false, NULL, NULL);


--
-- Data for Name: enduser; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO enduser (id, avatarurl, bio, company, email, isadmin, location, username) VALUES (1, NULL, NULL, NULL, NULL, false, NULL, 'user_A');


--
-- Name: enduser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('enduser_id_seq', 2, true);


--
-- Data for Name: endusergroup; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: entry_label; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: label; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: label_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('label_id_seq', 1, false);


--
-- Data for Name: sourcefile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO sourcefile (id, content, path, type) VALUES (1, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile (id, content, path, type) VALUES (2, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (3, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile (id, content, path, type) VALUES (4, 'task hello {
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
INSERT INTO sourcefile (id, content, path, type) VALUES (5, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (6, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile (id, content, path, type) VALUES (7, 'task hello {
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
INSERT INTO sourcefile (id, content, path, type) VALUES (8, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (9, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile (id, content, path, type) VALUES (10, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (11, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile (id, content, path, type) VALUES (12, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (13, 'task hello {
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
INSERT INTO sourcefile (id, content, path, type) VALUES (14, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (15, 'task hello {
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
INSERT INTO sourcefile (id, content, path, type) VALUES (16, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (17, 'class: s:SoftwareSourceCode
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
INSERT INTO sourcefile (id, content, path, type) VALUES (18, 'class: EnvVarRequirement
envDef:
  - envName: "PATH"
    envValue: "/usr/local/bin/:/usr/bin:/bin"
', 'envvar-global.yml', 'DOCKSTORE_CWL');
INSERT INTO sourcefile (id, content, path, type) VALUES (19, 'class: DockerRequirement
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
INSERT INTO sourcefile (id, content, path, type) VALUES (28, 'cwlVersion: v1.0
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
INSERT INTO sourcefile (id, content, path, type) VALUES (29, '#!/usr/bin/env cwl-runner
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
INSERT INTO sourcefile (id, content, path, type) VALUES (30, '#!/usr/bin/env cwl-runner
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
INSERT INTO sourcefile (id, content, path, type) VALUES (20, '#!/usr/bin/env cwl-runner

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
INSERT INTO sourcefile (id, content, path, type) VALUES (21, 'FROM ubuntu:12.04
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (22, 'class: s:SoftwareSourceCode
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
INSERT INTO sourcefile (id, content, path, type) VALUES (23, 'class: EnvVarRequirement
envDef:
  - envName: "PATH"
    envValue: "/usr/local/bin/:/usr/bin:/bin"
', 'envvar-global.yml', 'DOCKSTORE_CWL');
INSERT INTO sourcefile (id, content, path, type) VALUES (24, 'class: DockerRequirement
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
INSERT INTO sourcefile (id, content, path, type) VALUES (25, '#!/usr/bin/env cwl-runner

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
INSERT INTO sourcefile (id, content, path, type) VALUES (26, 'FROM ubuntu:12.04
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (27, 'class: Workflow
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
INSERT INTO sourcefile (id, content, path, type) VALUES (31, 'cwlVersion: v1.0
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
INSERT INTO sourcefile (id, content, path, type) VALUES (32, 'cwlVersion: v1.0
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
INSERT INTO sourcefile (id, content, path, type) VALUES (35, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/testDir/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (36, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/testDir/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (39, '#!/usr/bin/env cwl-runner

class: CommandLineTool

id: "cgpmap"

label: "CGP BWA-mem mapping flow"

cwlVersion: v1.0

#doc:
#  $include: includes/doc.yml

doc: |
  ![build_status](https://quay.io/repository/wtsicgp/dockstore-cgpmap/status)
  A Docker container for PCAP-core. See the [dockstore-cgpmap](https://github.com/cancerit/dockstore-cgpmap) website for more information.

  Parameters for a CWL definition are generally described in a json file, but parameters can be provided on the command line.

  To see the parameters descriptions please run: cwltool --tool-help path_to.cwl

#requirements:
#  - $mixin: mixins/requirements.yml

requirements:
  - class: DockerRequirement
    dockerPull: "quay.io/wtsicgp/dockstore-cgpmap:3.0.0-rc8"

#hints:
#  - $mixin: mixins/hints.yml

hints:
  - class: ResourceRequirement
    coresMin: 1 # works but long, 8 recommended
    ramMin: 15000 # good for WGS human ~30-60x
    outdirMin: 5000000 # unlikely any BAM processing would be possible in less

inputs:
  reference:
    type: File
    doc: "The core reference (fa, fai, dict) as tar.gz"
    inputBinding:
      prefix: -reference
      position: 1
      separate: true

  bwa_idx:
    type: File
    doc: "The BWA indexes in tar.gz"
    inputBinding:
      prefix: -bwa_idx
      position: 2
      separate: true

  sample:
    type: string
    doc: "Sample name to be included in output [B|CR]AM header, also used to name final file"
    inputBinding:
      prefix: -sample
      position: 3
      separate: true

  scramble:
    type: string?
    doc: "Options to pass to scramble when generating CRAM output, see scramble docs"
    default: ''''
    inputBinding:
      prefix: -scramble
      position: 4
      separate: true
      shellQuote: true

  bwa:
    type: string?
    default: '' -Y -K 100000000''
    doc: "Mapping and output parameters to pass to BWA-mem, see BWA docs, default '' -Y -K 100000000''"
    inputBinding:
      prefix: -bwa
      position: 5
      separate: true
      shellQuote: true

  groupinfo:
    type: File?
    doc: "Readgroup metadata file for FASTQ inputs"
    inputBinding:
      prefix: -groupinfo
      position: 6
      separate: true

  mmqc:
    type: boolean
    doc: "Apply mismatch QC to reads following duplicate marking."
    inputBinding:
      prefix: -qc
      position: 7

  mmqcfrac:
    type: float?
    default: 0.05
    doc: "Mismatch fraction to set as max before failing a read [0.05]"
    inputBinding:
      prefix: -qcf
      position: 8
      separate: true

  bams_in:
    type:
    - ''null''
    - type: array
      items: File
    doc: "Can be BAM, CRAM, fastq (paired or interleaved), BAM/CRAM can be mixed together but not FASTQ."
    inputBinding:
      position: 9

outputs:
  out_cram:
    type: File
    outputBinding:
      glob: $(inputs.sample).cram
    secondaryFiles:
      - .crai
      - .bas
      - .md5
      - .met
      - .maptime

baseCommand: ["/opt/wtsi-cgp/bin/ds-cgpmap.pl", "-cram"]

$schemas:
  - http://schema.org/docs/schema_org_rdfa.html

$namespaces:
  s: http://schema.org/

s:codeRepository: https://github.com/cancerit/dockstore-biobambam2
s:license: https://spdx.org/licenses/GPL-3.0

s:author:
  - class: s:Person
    s:identifier: https://orcid.org/0000-0002-5634-1539
    s:email: mailto:keiranmraine@gmail.com
    s:name: Keiran Raine

dct:creator:
  "@id": "keiranmraine@gmail.com"
  foaf:name: Keiran Raine
  foaf:mbox: "keiranmraine@gmail.com"
', '/cwls/cgpmap-cramOut.cwl', 'DOCKSTORE_CWL');
INSERT INTO sourcefile (id, content, path, type) VALUES (40, 'FROM  ubuntu:16.04 as builder

USER  root

RUN apt-get -yq update
RUN apt-get install -yq --no-install-recommends\
  apt-transport-https\
  locales\
  curl\
  ca-certificates\
  libperlio-gzip-perl\
  make\
  bzip2\
  gcc\
  psmisc\
  time\
  zlib1g-dev\
  libbz2-dev\
  liblzma-dev\
  libcurl4-gnutls-dev\
  libncurses5-dev

RUN locale-gen en_US.UTF-8
RUN update-locale LANG=en_US.UTF-8

ENV OPT /opt/wtsi-cgp
ENV PATH $OPT/bin:$PATH
ENV PERL5LIB $OPT/lib/perl5
ENV LD_LIBRARY_PATH $OPT/lib
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

RUN mkdir -p $OPT/bin

ADD build/opt-build.sh build/
RUN bash build/opt-build.sh $OPT

FROM  ubuntu:16.04

MAINTAINER  keiranmraine@gmail.com

LABEL vendor="Cancer Genome Project, Wellcome Trust Sanger Institute"
LABEL uk.ac.sanger.cgp.description="PCAP-core for dockstore.org"
LABEL uk.ac.sanger.cgp.version="3.0.0-rc8"

RUN apt-get -yq update
RUN apt-get install -yq --no-install-recommends\
  apt-transport-https\
  locales\
  curl\
  ca-certificates\
  libperlio-gzip-perl\
  bzip2\
  psmisc\
  time\
  zlib1g\
  liblzma5\
  libncurses5

RUN locale-gen en_US.UTF-8
RUN update-locale LANG=en_US.UTF-8

ENV OPT /opt/wtsi-cgp
ENV PATH $OPT/bin:$PATH
ENV PERL5LIB $OPT/lib/perl5
ENV LD_LIBRARY_PATH $OPT/lib
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

RUN mkdir -p $OPT
COPY --from=builder $OPT $OPT

ADD scripts/mapping.sh $OPT/bin/mapping.sh
ADD scripts/ds-cgpmap.pl $OPT/bin/ds-cgpmap.pl
RUN chmod a+x $OPT/bin/mapping.sh $OPT/bin/ds-cgpmap.pl

## USER CONFIGURATION
RUN adduser --disabled-password --gecos '''' ubuntu && chsh -s /bin/bash && mkdir -p /home/ubuntu

USER    ubuntu
WORKDIR /home/ubuntu

CMD ["/bin/bash"]
', '/Dockerfile', 'DOCKERFILE');
INSERT INTO sourcefile (id, content, path, type) VALUES (41, '{
  "reference": {
    "path": "ftp://ftp.sanger.ac.uk/pub/cancer/dockstore/human/core_ref_GRCh37d5.tar.gz",
    "class": "File"
  },
  "bwa_idx": {
    "path": "ftp://ftp.sanger.ac.uk/pub/cancer/dockstore/human/bwa_idx_GRCh37d5.tar.gz",
    "class": "File"
  },
  "bams_in": [
    {"class": "File",
     "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_10658_i.fq.gz"},
    {"class": "File",
     "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_10659_i.fq.gz"},
    {"class": "File",
     "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_10660_i.fq.gz"},
    {"class": "File",
     "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_10661_i.fq.gz"},
    {"class": "File",
     "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_10662_i.fq.gz"},
    {"class": "File",
     "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_10663_i.fq.gz"},
    {"class": "File",
     "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_10664_i.fq.gz"},
    {"class": "File",
     "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_10665_i.fq.gz"},
  ],
  "groupinfo": {
    "path": "ftp://ngs.sanger.ac.uk/production/cancer/dockstore/cgpmap/insilico_21_fq.yaml",
    "class": "File"
  },
  "sample": "test",
  "scramble": "''-e''",
  "mmqc": false,
  "mmqcfrag": 0.05,
  "out_cram": {
    "path": "/tmp/mapped.cram",
    "class": "File",
    "secondaryFiles": [
      ".crai",
      ".bas",
      ".md5",
      ".met",
      ".maptime"
    ]
  }
}
', '/examples/cgpmap/cramOut/fastq_gz_input.json', 'CWL_TEST_JSON');


--
-- Name: sourcefile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('sourcefile_id_seq', 41, true);


--
-- Data for Name: starred; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (1, false, false, '2016-02-04 16:44:00', 'test', 'feature/test', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '84fc64995896cd90f9b9732e28d4115e82dd471c40925b0ba34c9a419fbe2fa8', 108608297, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (2, false, false, '2016-02-16 17:06:55', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'e919f2df4a7b01f3be3dc74483544cd9ee8396714dfdbb2e41679039de7cc3e1', 108608275, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (3, false, false, '2016-02-16 17:06:56', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'e919f2df4a7b01f3be3dc74483544cd9ee8396714dfdbb2e41679039de7cc3e1', 108608275, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (4, false, false, '2016-03-15 15:41:00', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '2cf0cccd32556daf9a0137277938d6f033b7a7c5d65628b582b2ed9afdde40f5', 108722095, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (5, false, false, '2016-03-15 15:41:03', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '2cf0cccd32556daf9a0137277938d6f033b7a7c5d65628b582b2ed9afdde40f5', 108722095, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (8, false, false, '2016-03-15 15:42:04', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'f92aa8edcc265e4d5faabf7f89157008d52d514f8f6d7c1b833024f58f126e9d', 108722128, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (9, false, false, '2016-03-15 15:42:05', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'f92aa8edcc265e4d5faabf7f89157008d52d514f8f6d7c1b833024f58f126e9d', 108722128, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (10, false, false, '2016-06-08 14:08:08', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '9227b87c1304b9ce746d06d0eb8144ec17a253f5b8e00a3922d86b538c8296c0', 44363874, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (11, false, false, '2016-06-08 14:08:08', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '9227b87c1304b9ce746d06d0eb8144ec17a253f5b8e00a3922d86b538c8296c0', 44363874, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (6, false, false, '2016-03-15 15:39:17', 'master', 'master', false, false, NULL, true, '/Dockstore.cwl', '/testDir/Dockerfile', '8079f14d756280940d56957f0e1ddb14b8d3124a8d1d195f4a51f2a051d84726', 108722088, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (7, false, false, '2016-03-15 15:39:19', 'latest', 'master', false, false, NULL, true, '/Dockstore.cwl', '/testDir/Dockerfile', '8079f14d756280940d56957f0e1ddb14b8d3124a8d1d195f4a51f2a051d84726', 108722088, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);
INSERT INTO tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl) VALUES (52, false, false, '2018-02-12 15:49:28', '3.0.0-rc8', '3.0.0-rc8', true, false, NULL, true, '/cwls/cgpmap-cramOut.cwl', '/Dockerfile', 'c387f22e65f066c42ccaf11392fdbd640aa2b7627eb40ac06a0dbaca2ca323cb', 138844180, '/Dockstore.wdl', 'NOT_REQUESTED', NULL);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tag_id_seq', 101, true);


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO token (id, content, refreshtoken, tokensource, userid, username) VALUES (1, 'imamafakedockstoretoken', NULL, 'dockstore', 1, 'user_A');
INSERT INTO token (id, content, refreshtoken, tokensource, userid, username) VALUES (2, 'imamafakegithubtoken', NULL, 'github.com', 1, 'user_A');
INSERT INTO token (id, content, refreshtoken, tokensource, userid, username) VALUES (4, 'imamafakequaytoken', NULL, 'quay.io', 1, 'user_A');


--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('token_id_seq', 10, true);


--
-- Data for Name: tool; Type: TABLE DATA; Schema: public; Owner: postgres
--
qINSERT INTO tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, customdockerregistrypath) VALUES (2, 'testuser2', NULL, 'Whalesay deep quotes', NULL, 'git@github.com:A2/b1.git', false, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-03-15 15:35:29', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b1', 'A2', false, 'QUAY_IO', '', '', NULL);
INSERT INTO tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, customdockerregistrypath) VALUES (5, NULL, NULL, '', NULL, 'git@github.com:A2/a.git', true, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-06-08 14:06:36', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'a', 'A2', false, 'QUAY_IO', '', '', NULL);
INSERT INTO tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, customdockerregistrypath) VALUES (4, NULL, NULL, NULL, NULL, 'git@github.com:A2/b3.git', true, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-03-15 15:36:22', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b3', 'A2', false, 'QUAY_IO', '', '', NULL);
INSERT INTO tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, customdockerregistrypath) VALUES (3, NULL, NULL, NULL, NULL, 'git@github.com:A2/b2.git', false, NULL, '2016-11-28 15:02:48.557', '/Dockstore.cwl', '/testDir/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-03-15 15:35:57', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b2', 'A2', false, 'QUAY_IO', '', '', NULL);
INSERT INTO tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, customdockerregistrypath) VALUES (52, NULL, NULL, NULL, NULL, 'git@github.com:garyluu/dockstore-cgpmap.git', true, NULL, '2018-02-12 15:55:42.691', '/cwls/cgpmap-cramOut.cwl', '/Dockerfile', '/examples/cgpmap/cramOut/fastq_gz_input.json', '/test.wdl.json', '/Dockstore.wdl', '2018-02-12 15:40:19', 'MANUAL_IMAGE_PATH', 'dockstore-cgpmap', 'garyluu', false, 'QUAY_IO', '', 'cgpmap-cramOut', NULL);
INSERT INTO tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, customdockerregistrypath) VALUES (1, 'testuser', NULL, 'Whalesay deep quotes', NULL, 'git@github.com:A/a.git', false, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-02-16 17:04:59', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'a', 'A', true, 'AMAZON_ECR', 'test@email.com', '', 'test.dkr.ecr.test.amazonaws.com');


--
-- Data for Name: tool_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO tool_tag (toolid, tagid) VALUES (1, 1);
INSERT INTO tool_tag (toolid, tagid) VALUES (1, 2);
INSERT INTO tool_tag (toolid, tagid) VALUES (1, 3);
INSERT INTO tool_tag (toolid, tagid) VALUES (2, 4);
INSERT INTO tool_tag (toolid, tagid) VALUES (2, 5);
INSERT INTO tool_tag (toolid, tagid) VALUES (3, 6);
INSERT INTO tool_tag (toolid, tagid) VALUES (3, 7);
INSERT INTO tool_tag (toolid, tagid) VALUES (4, 8);
INSERT INTO tool_tag (toolid, tagid) VALUES (4, 9);
INSERT INTO tool_tag (toolid, tagid) VALUES (5, 10);
INSERT INTO tool_tag (toolid, tagid) VALUES (5, 11);
INSERT INTO tool_tag (toolid, tagid) VALUES (52, 52);


--
-- Data for Name: user_entry; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO user_entry (userid, entryid) VALUES (1, 1);
INSERT INTO user_entry (userid, entryid) VALUES (1, 2);
INSERT INTO user_entry (userid, entryid) VALUES (1, 3);
INSERT INTO user_entry (userid, entryid) VALUES (1, 4);
INSERT INTO user_entry (userid, entryid) VALUES (1, 5);
INSERT INTO user_entry (userid, entryid) VALUES (1, 6);
INSERT INTO user_entry (userid, entryid) VALUES (1, 7);
INSERT INTO user_entry (userid, entryid) VALUES (1, 8);
INSERT INTO user_entry (userid, entryid) VALUES (1, 9);
INSERT INTO user_entry (userid, entryid) VALUES (1, 10);
INSERT INTO user_entry (userid, entryid) VALUES (1, 11);
INSERT INTO user_entry (userid, entryid) VALUES (1, 12);
INSERT INTO user_entry (userid, entryid) VALUES (1, 13);
INSERT INTO user_entry (userid, entryid) VALUES (1, 14);
INSERT INTO user_entry (userid, entryid) VALUES (1, 16);
INSERT INTO user_entry (userid, entryid) VALUES (1, 17);
INSERT INTO user_entry (userid, entryid) VALUES (1, 18);
INSERT INTO user_entry (userid, entryid) VALUES (1, 19);
INSERT INTO user_entry (userid, entryid) VALUES (1, 20);
INSERT INTO user_entry (userid, entryid) VALUES (2, 52);


--
-- Data for Name: usergroup; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: usergroup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('usergroup_id_seq', 1, false);


--
-- Data for Name: version_sourcefile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (1, 2);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (1, 1);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (2, 4);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (2, 3);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (2, 5);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (3, 8);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (3, 6);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (3, 7);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (4, 10);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (4, 9);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (5, 12);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (5, 11);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (8, 13);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (8, 14);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (9, 16);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (9, 15);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (10, 17);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (10, 19);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (10, 20);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (10, 18);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (10, 21);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (11, 26);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (11, 23);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (11, 22);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (11, 24);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (11, 25);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (13, 27);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (13, 28);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (13, 30);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (13, 32);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (13, 29);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (13, 31);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (6, 35);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (7, 36);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (52, 39);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (52, 40);
INSERT INTO version_sourcefile (versionid, sourcefileid) VALUES (52, 41);


--
-- Data for Name: workflow; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (6, NULL, NULL, NULL, NULL, 'git@bitbucket.org:a/a.git', false, NULL, '2016-11-28 15:00:57.148', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'a', 'a', NULL, 'BITBUCKET');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (7, NULL, NULL, NULL, NULL, 'git@github.com:A/c.git', false, NULL, '2016-11-28 15:00:57.315', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'c', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (8, NULL, NULL, NULL, NULL, 'git@github.com:A/f.git', false, NULL, '2016-11-28 15:00:57.419', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'f', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (9, NULL, NULL, NULL, NULL, 'git@github.com:A/k.git', false, NULL, '2016-11-28 15:00:57.482', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'k', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (10, NULL, NULL, NULL, NULL, 'git@github.com:A/e.git', false, NULL, '2016-11-28 15:00:57.593', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'e', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (12, NULL, NULL, NULL, NULL, 'git@github.com:A/g.git', false, NULL, '2016-11-28 15:00:57.788', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'g', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (13, NULL, NULL, NULL, NULL, 'git@github.com:A/j.git', false, NULL, '2016-11-28 15:00:57.792', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'j', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (14, NULL, NULL, NULL, NULL, 'git@github.com:A/m.git', false, NULL, '2016-11-28 15:00:57.859', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'm', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (16, NULL, NULL, NULL, NULL, 'git@github.com:A/d.git', false, NULL, '2016-11-28 15:00:58.068', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'd', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (17, NULL, NULL, NULL, NULL, 'git@github.com:A/i.git', false, NULL, '2016-11-28 15:00:58.073', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'i', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (18, NULL, NULL, NULL, NULL, 'git@github.com:A/b.git', false, NULL, '2016-11-28 15:00:58.153', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'b', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (19, NULL, NULL, NULL, NULL, 'git@github.com:A/h.git', false, NULL, '2016-11-28 15:00:58.157', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'h', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (20, NULL, NULL, NULL, NULL, 'git@github.com:A/a.git', false, NULL, '2016-11-28 15:00:57.948', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'a', NULL, 'GITHUB');
INSERT INTO workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol) VALUES (11, NULL, NULL, NULL, NULL, 'git@github.com:A/l.git', true, NULL, '2016-11-28 15:00:57.688', NULL, '/1st-workflow.cwl', 'cwl', 'FULL', 'A', 'l', NULL, 'GITHUB');


--
-- Data for Name: workflow_workflowversion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO workflow_workflowversion (workflowid, workflowversionid) VALUES (11, 13);


--
-- Data for Name: workflowversion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO workflowversion (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, workflowpath, doistatus, doiurl) VALUES (13, false, false, '2016-11-28 15:01:57.003', 'master', 'master', true, false, NULL, '/1st-workflow.cwl', 'NOT_REQUESTED', NULL);


--
-- Name: enduser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY enduser
    ADD CONSTRAINT enduser_pkey PRIMARY KEY (id);


--
-- Name: endusergroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY endusergroup
    ADD CONSTRAINT endusergroup_pkey PRIMARY KEY (userid, groupid);


--
-- Name: entry_label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entry_label
    ADD CONSTRAINT entry_label_pkey PRIMARY KEY (entryid, labelid);


--
-- Name: label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY label
    ADD CONSTRAINT label_pkey PRIMARY KEY (id);


--
-- Name: pk_databasechangeloglock; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY databasechangeloglock
    ADD CONSTRAINT pk_databasechangeloglock PRIMARY KEY (id);


--
-- Name: sourcefile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sourcefile
    ADD CONSTRAINT sourcefile_pkey PRIMARY KEY (id);


--
-- Name: starred_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY starred
    ADD CONSTRAINT starred_pkey PRIMARY KEY (entryid, userid);


--
-- Name: tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: tool_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tool
    ADD CONSTRAINT tool_pkey PRIMARY KEY (id);


--
-- Name: tool_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tool_tag
    ADD CONSTRAINT tool_tag_pkey PRIMARY KEY (toolid, tagid);


--
-- Name: uk_9vcoeu4nuu2ql7fh05mn20ydd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY enduser
    ADD CONSTRAINT uk_9vcoeu4nuu2ql7fh05mn20ydd UNIQUE (username);


--
-- Name: uk_9xhsn1bsea2csoy3l0gtq41vv; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY label
    ADD CONSTRAINT uk_9xhsn1bsea2csoy3l0gtq41vv UNIQUE (value);


--
-- Name: uk_e2j71kjdot9b8l5qmjw2ve38o; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY version_sourcefile
    ADD CONSTRAINT uk_e2j71kjdot9b8l5qmjw2ve38o UNIQUE (sourcefileid);


--
-- Name: uk_encl8hnebnkcaxj9tlugr9cxh; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workflow_workflowversion
    ADD CONSTRAINT uk_encl8hnebnkcaxj9tlugr9cxh UNIQUE (workflowversionid);


--
-- Name: uk_jdgfioq44aqox39xrs1wceow1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tool_tag
    ADD CONSTRAINT uk_jdgfioq44aqox39xrs1wceow1 UNIQUE (tagid);


--
-- Name: ukbq5vy17y4ocaist3d3r3imcus; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tool
    ADD CONSTRAINT ukbq5vy17y4ocaist3d3r3imcus UNIQUE (registry, namespace, name, toolname);


--
-- Name: uknlbos7i98icbaql5cyt5bhhy2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workflow
    ADD CONSTRAINT uknlbos7i98icbaql5cyt5bhhy2 UNIQUE (sourcecontrol, organization, repository, workflowname);


--
-- Name: user_entry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_entry
    ADD CONSTRAINT user_entry_pkey PRIMARY KEY (entryid, userid);


--
-- Name: usergroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY usergroup
    ADD CONSTRAINT usergroup_pkey PRIMARY KEY (id);


--
-- Name: version_sourcefile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY version_sourcefile
    ADD CONSTRAINT version_sourcefile_pkey PRIMARY KEY (versionid, sourcefileid);


--
-- Name: workflow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workflow
    ADD CONSTRAINT workflow_pkey PRIMARY KEY (id);


--
-- Name: workflow_workflowversion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workflow_workflowversion
    ADD CONSTRAINT workflow_workflowversion_pkey PRIMARY KEY (workflowid, workflowversionid);


--
-- Name: workflowversion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workflowversion
    ADD CONSTRAINT workflowversion_pkey PRIMARY KEY (id);


--
-- Name: full_tool_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX full_tool_name ON tool USING btree (registry, namespace, name, toolname) WHERE (toolname IS NOT NULL);


--
-- Name: full_workflow_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX full_workflow_name ON workflow USING btree (sourcecontrol, organization, repository, workflowname) WHERE (workflowname IS NOT NULL);


--
-- Name: partial_tool_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX partial_tool_name ON tool USING btree (registry, namespace, name) WHERE (toolname IS NULL);


--
-- Name: partial_workflow_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX partial_workflow_name ON workflow USING btree (sourcecontrol, organization, repository) WHERE (workflowname IS NULL);


--
-- Name: fkdcfqiy0arvxmmh5e68ix75gwo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY starred
    ADD CONSTRAINT fkdcfqiy0arvxmmh5e68ix75gwo FOREIGN KEY (userid) REFERENCES enduser(id);


--
-- Name: fkibmeux3552ua8dwnqdb8w6991; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workflow_workflowversion
    ADD CONSTRAINT fkibmeux3552ua8dwnqdb8w6991 FOREIGN KEY (workflowversionid) REFERENCES workflowversion(id);


--
-- Name: fkjkn6qubuvn25bun52eqjleyl6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tool_tag
    ADD CONSTRAINT fkjkn6qubuvn25bun52eqjleyl6 FOREIGN KEY (tagid) REFERENCES tag(id);


--
-- Name: fkjtsjg6jdnwxoeicd27ujmeeaj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tool_tag
    ADD CONSTRAINT fkjtsjg6jdnwxoeicd27ujmeeaj FOREIGN KEY (toolid) REFERENCES tool(id);


--
-- Name: fkl8yg13ahjhtn0notrlf3amwwi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workflow_workflowversion
    ADD CONSTRAINT fkl8yg13ahjhtn0notrlf3amwwi FOREIGN KEY (workflowid) REFERENCES workflow(id);


--
-- Name: fkm0exig2r3dsxqafwaraf7rnr3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY endusergroup
    ADD CONSTRAINT fkm0exig2r3dsxqafwaraf7rnr3 FOREIGN KEY (groupid) REFERENCES usergroup(id);


--
-- Name: fkmby5o476bdwrx07ax2keoyttn; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY version_sourcefile
    ADD CONSTRAINT fkmby5o476bdwrx07ax2keoyttn FOREIGN KEY (sourcefileid) REFERENCES sourcefile(id);


--
-- Name: fkrxn6hh2max4sk4ceehyv7mt2e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY endusergroup
    ADD CONSTRAINT fkrxn6hh2max4sk4ceehyv7mt2e FOREIGN KEY (userid) REFERENCES enduser(id);


--
-- Name: fks71c9mk0f98015eqgtyvs0ewp; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entry_label
    ADD CONSTRAINT fks71c9mk0f98015eqgtyvs0ewp FOREIGN KEY (labelid) REFERENCES label(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--
