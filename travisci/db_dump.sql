--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.9
-- Dumped by pg_dump version 9.6.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
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


--
-- Name: container_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE public.container_id_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.container_id_seq OWNER TO dockstore;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.databasechangelog (
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


ALTER TABLE public.databasechangelog OWNER TO dockstore;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO dockstore;

--
-- Name: enduser; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.enduser (
    id bigint NOT NULL,
    avatarurl character varying(255),
    bio character varying(255),
    company character varying(255),
    email character varying(255),
    isadmin boolean,
    location character varying(255),
    username character varying(255) NOT NULL,
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone,
    curator boolean DEFAULT false
);


ALTER TABLE public.enduser OWNER TO dockstore;

--
-- Name: enduser_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE public.enduser_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enduser_id_seq OWNER TO dockstore;

--
-- Name: enduser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE public.enduser_id_seq OWNED BY public.enduser.id;


--
-- Name: endusergroup; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.endusergroup (
    groupid bigint NOT NULL,
    userid bigint NOT NULL
);


ALTER TABLE public.endusergroup OWNER TO dockstore;

--
-- Name: entry_label; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.entry_label (
    entryid bigint NOT NULL,
    labelid bigint NOT NULL
);


ALTER TABLE public.entry_label OWNER TO dockstore;

--
-- Name: fileformat; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.fileformat (
    id bigint NOT NULL,
    value text,
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone
);


ALTER TABLE public.fileformat OWNER TO dockstore;

--
-- Name: fileformat_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE public.fileformat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.fileformat_id_seq OWNER TO dockstore;

--
-- Name: fileformat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE public.fileformat_id_seq OWNED BY public.fileformat.id;


--
-- Name: label; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.label (
    id bigint NOT NULL,
    value character varying(255),
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone
);


ALTER TABLE public.label OWNER TO dockstore;

--
-- Name: label_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE public.label_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.label_id_seq OWNER TO dockstore;

--
-- Name: label_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE public.label_id_seq OWNED BY public.label.id;


--
-- Name: sourcefile; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.sourcefile (
    id bigint NOT NULL,
    content text,
    path character varying(255) NOT NULL,
    type character varying(255),
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone
);


ALTER TABLE public.sourcefile OWNER TO dockstore;

--
-- Name: sourcefile_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE public.sourcefile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sourcefile_id_seq OWNER TO dockstore;

--
-- Name: sourcefile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE public.sourcefile_id_seq OWNED BY public.sourcefile.id;


--
-- Name: sourcefile_verified; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.sourcefile_verified (
    id bigint NOT NULL,
    metadata text,
    verified boolean NOT NULL,
    source text NOT NULL
);


ALTER TABLE public.sourcefile_verified OWNER TO dockstore;

--
-- Name: starred; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.starred (
    userid bigint NOT NULL,
    entryid bigint NOT NULL
);


ALTER TABLE public.starred OWNER TO dockstore;

--
-- Name: tag; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.tag (
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
    doiurl character varying(255),
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone,
    referencetype text DEFAULT 'UNSET'::text NOT NULL,
    versioneditor_id bigint,
    commitid text
);


ALTER TABLE public.tag OWNER TO dockstore;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE public.tag_id_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO dockstore;

--
-- Name: token; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.token (
    id bigint NOT NULL,
    content character varying(255) NOT NULL,
    refreshtoken character varying(255),
    tokensource character varying(255) NOT NULL,
    userid bigint,
    username character varying(255) NOT NULL,
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone
);


ALTER TABLE public.token OWNER TO dockstore;

--
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE public.token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.token_id_seq OWNER TO dockstore;

--
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE public.token_id_seq OWNED BY public.token.id;


--
-- Name: tool; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.tool (
    id bigint NOT NULL,
    author character varying(255),
    defaultversion character varying(255),
    description text,
    email character varying(255),
    giturl character varying(255),
    ispublished boolean,
    lastmodified timestamp without time zone,
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
    toolname text,
    checkerid bigint,
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone,
    CONSTRAINT tool_check CHECK ((((defaultwdlpath IS NOT NULL) OR (defaultcwlpath IS NOT NULL)) AND (toolname !~~ '\_%'::text))),
    CONSTRAINT tool_toolname_notempty CHECK ((toolname <> ''::text))
);


ALTER TABLE public.tool OWNER TO dockstore;

--
-- Name: tool_tag; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.tool_tag (
    toolid bigint NOT NULL,
    tagid bigint NOT NULL
);


ALTER TABLE public.tool_tag OWNER TO dockstore;

--
-- Name: user_entry; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.user_entry (
    userid bigint NOT NULL,
    entryid bigint NOT NULL
);


ALTER TABLE public.user_entry OWNER TO dockstore;

--
-- Name: usergroup; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.usergroup (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone
);


ALTER TABLE public.usergroup OWNER TO dockstore;

--
-- Name: usergroup_id_seq; Type: SEQUENCE; Schema: public; Owner: dockstore
--

CREATE SEQUENCE public.usergroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usergroup_id_seq OWNER TO dockstore;

--
-- Name: usergroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dockstore
--

ALTER SEQUENCE public.usergroup_id_seq OWNED BY public.usergroup.id;


--
-- Name: version_input_fileformat; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.version_input_fileformat (
    versionid bigint NOT NULL,
    fileformatid bigint NOT NULL
);


ALTER TABLE public.version_input_fileformat OWNER TO dockstore;

--
-- Name: version_output_fileformat; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.version_output_fileformat (
    versionid bigint NOT NULL,
    fileformatid bigint NOT NULL
);


ALTER TABLE public.version_output_fileformat OWNER TO dockstore;

--
-- Name: version_sourcefile; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.version_sourcefile (
    versionid bigint NOT NULL,
    sourcefileid bigint NOT NULL
);


ALTER TABLE public.version_sourcefile OWNER TO dockstore;

--
-- Name: workflow; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.workflow (
    id bigint NOT NULL,
    author character varying(255),
    defaultversion character varying(255),
    description text,
    email character varying(255),
    giturl character varying(255),
    ispublished boolean,
    lastmodified timestamp without time zone,
    lastupdated timestamp without time zone,
    defaulttestparameterfilepath text,
    defaultworkflowpath text,
    descriptortype character varying(255) NOT NULL,
    mode text DEFAULT 'STUB'::text NOT NULL,
    organization character varying(255) NOT NULL,
    repository character varying(255) NOT NULL,
    workflowname text,
    sourcecontrol text NOT NULL,
    checkerid bigint,
    ischecker boolean DEFAULT false,
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone,
    CONSTRAINT workflow_check CHECK (((ischecker IS TRUE) OR ((ischecker IS FALSE) AND (workflowname !~~ '\_%'::text)))),
    CONSTRAINT workflow_workflowname_notempty CHECK ((workflowname <> ''::text))
);


ALTER TABLE public.workflow OWNER TO dockstore;

--
-- Name: workflow_workflowversion; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.workflow_workflowversion (
    workflowid bigint NOT NULL,
    workflowversionid bigint NOT NULL
);


ALTER TABLE public.workflow_workflowversion OWNER TO dockstore;

--
-- Name: workflowversion; Type: TABLE; Schema: public; Owner: dockstore
--

CREATE TABLE public.workflowversion (
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
    doiurl character varying(255),
    dbcreatedate timestamp without time zone,
    dbupdatedate timestamp without time zone,
    referencetype text DEFAULT 'UNSET'::text NOT NULL,
    versioneditor_id bigint,
    commitid text
);


ALTER TABLE public.workflowversion OWNER TO dockstore;

--
-- Name: enduser id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.enduser ALTER COLUMN id SET DEFAULT nextval('public.enduser_id_seq'::regclass);


--
-- Name: fileformat id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.fileformat ALTER COLUMN id SET DEFAULT nextval('public.fileformat_id_seq'::regclass);


--
-- Name: label id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.label ALTER COLUMN id SET DEFAULT nextval('public.label_id_seq'::regclass);


--
-- Name: sourcefile id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.sourcefile ALTER COLUMN id SET DEFAULT nextval('public.sourcefile_id_seq'::regclass);


--
-- Name: token id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.token ALTER COLUMN id SET DEFAULT nextval('public.token_id_seq'::regclass);


--
-- Name: usergroup id; Type: DEFAULT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.usergroup ALTER COLUMN id SET DEFAULT nextval('public.usergroup_id_seq'::regclass);


--
-- Name: container_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.container_id_seq', 101, true);


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-1', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.894584', 1, 'EXECUTED', '7:45eddb8745751992c52a60a4837da953', 'createSequence sequenceName=container_id_seq', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-2', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.914276', 2, 'EXECUTED', '7:cf8318665e9225d32fd3aac343ef329e', 'createSequence sequenceName=tag_id_seq', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-3', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.947451', 3, 'EXECUTED', '7:4e88a3a005e06c39586e9b9cb841f9c4', 'createTable tableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-4', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.95828', 4, 'EXECUTED', '7:857c5c872f1dd7d5e40f5fdad75b36c2', 'createTable tableName=endusergroup', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-5', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.971068', 5, 'EXECUTED', '7:2077be1344f33e3e60c6728f0e1948bc', 'createTable tableName=entry_label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-6', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:48.993357', 6, 'EXECUTED', '7:acda3ed025cca7431c507ec5c24efc80', 'createTable tableName=label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-7', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.024609', 7, 'EXECUTED', '7:0a1fd7e5df8286dd18889cfa9824d74e', 'createTable tableName=sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-8', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.041809', 8, 'EXECUTED', '7:39f7133dc4e636d91ed03e90f6e466d1', 'createTable tableName=starred', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-9', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.0648', 9, 'EXECUTED', '7:de62b75c40bed7906f0a2a07fcfe798a', 'createTable tableName=tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-10', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.101411', 10, 'EXECUTED', '7:34123af99b249b83326a030f09289361', 'createTable tableName=token', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-11', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.124831', 11, 'EXECUTED', '7:59558bfce3acb7c2c8a37de2d78b3cff', 'createTable tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-12', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.141314', 12, 'EXECUTED', '7:4fa35dd2f319c47cc572ac3ef9db9e01', 'createTable tableName=tool_tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-13', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.15083', 13, 'EXECUTED', '7:550fe0f4db75f0385176a18350674cc2', 'createTable tableName=user_entry', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-14', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.171975', 14, 'EXECUTED', '7:940ac305506d20beaf1e7a7ba1d5c823', 'createTable tableName=usergroup', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-15', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.184509', 15, 'EXECUTED', '7:3232bf9686b9a2351fddcc9f99718b82', 'createTable tableName=version_sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-16', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.212966', 16, 'EXECUTED', '7:55c3cd8734c4e60616017dd4dc3984ac', 'createTable tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-17', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.22254', 17, 'EXECUTED', '7:d2a41c88e8854a65a830ff5bbb38a2f1', 'createTable tableName=workflow_workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-18', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.244385', 18, 'EXECUTED', '7:c7f7fd98188f9b5d29cafd992cc87e78', 'createTable tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-19', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.264563', 19, 'EXECUTED', '7:127d247cb20a76c99d356cc7618017e3', 'addPrimaryKey constraintName=endusergroup_pkey, tableName=endusergroup', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-20', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.284108', 20, 'EXECUTED', '7:86a7318e76a64872c5b763a3aaa46de3', 'addPrimaryKey constraintName=entry_label_pkey, tableName=entry_label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-21', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.303926', 21, 'EXECUTED', '7:6a2dd4c27116dc6c1f31875bbfb9507c', 'addPrimaryKey constraintName=starred_pkey, tableName=starred', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-22', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.324215', 22, 'EXECUTED', '7:f7fed41b485e3ccf42a788806021690d', 'addPrimaryKey constraintName=tag_pkey, tableName=tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-23', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.349086', 23, 'EXECUTED', '7:5eb5cd32f40dd0599195075e121a60e8', 'addPrimaryKey constraintName=tool_pkey, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-24', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.368474', 24, 'EXECUTED', '7:76fa5d53a4f9fff8f107af89e36ba6fb', 'addPrimaryKey constraintName=tool_tag_pkey, tableName=tool_tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-25', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.387882', 25, 'EXECUTED', '7:f0af74b60138b0c95bbe9a7f9a72d8cf', 'addPrimaryKey constraintName=user_entry_pkey, tableName=user_entry', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-26', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.407307', 26, 'EXECUTED', '7:d54d0357d7259be4ef17e7388e22edc1', 'addPrimaryKey constraintName=version_sourcefile_pkey, tableName=version_sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-27', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.427266', 27, 'EXECUTED', '7:e5b8415233c835299adf2e27b156111f', 'addPrimaryKey constraintName=workflow_pkey, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-28', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.446986', 28, 'EXECUTED', '7:2190163d7e905b4bfb466d45a6dd04c7', 'addPrimaryKey constraintName=workflow_workflowversion_pkey, tableName=workflow_workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-29', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.466597', 29, 'EXECUTED', '7:681c290ba322c816d89ac5d27c6c8ed0', 'addPrimaryKey constraintName=workflowversion_pkey, tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-30', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.487882', 30, 'EXECUTED', '7:18962c12c14f2d23d3dc3fb8fe56aa5e', 'addUniqueConstraint constraintName=uk_9vcoeu4nuu2ql7fh05mn20ydd, tableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-31', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.507283', 31, 'EXECUTED', '7:59b6bd3c5e90087868e9a5338e06f7cf', 'addUniqueConstraint constraintName=uk_9xhsn1bsea2csoy3l0gtq41vv, tableName=label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-32', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.526678', 32, 'EXECUTED', '7:d70e892c49df4198946af35f061eb526', 'addUniqueConstraint constraintName=uk_e2j71kjdot9b8l5qmjw2ve38o, tableName=version_sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-33', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.545829', 33, 'EXECUTED', '7:ecb3169946e4abde6e7db3b7b90320e3', 'addUniqueConstraint constraintName=uk_encl8hnebnkcaxj9tlugr9cxh, tableName=workflow_workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-34', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.56573', 34, 'EXECUTED', '7:f8af27a12385a1e0b9dc9bb328dded15', 'addUniqueConstraint constraintName=uk_jdgfioq44aqox39xrs1wceow1, tableName=tool_tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-35', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.584902', 35, 'EXECUTED', '7:ead6ee106e254c3e02aebc4a1c41d825', 'addUniqueConstraint constraintName=ukbq5vy17y4ocaist3d3r3imcus, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-36', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.60399', 36, 'EXECUTED', '7:b9f1f2a6e1a96d75938e8827a7dd559d', 'addUniqueConstraint constraintName=ukkprrtg54h6rjca5l1navospm8, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511391708947-37', 'dyuen (generated)-edited', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.624468', 37, 'EXECUTED', '7:c5e97c896ebc74e8b1aa39b406015c6d', 'createIndex indexName=full_tool_name, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511391708947-38', 'dyuen (generated)-edited', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.644936', 38, 'EXECUTED', '7:1f5307dbadad2ccff5a663422137dd71', 'createIndex indexName=full_workflow_name, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511391708947-39', 'dyuen (generated)-edited', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.664768', 39, 'EXECUTED', '7:310ec5a6dacbe61af9d19013512ffd83', 'createIndex indexName=partial_tool_name, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511391708947-40', 'dyuen (generated)-edited', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.68334', 40, 'EXECUTED', '7:cf8d1c10cd33f299b42ac2240c728e4d', 'createIndex indexName=partial_workflow_name, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-41', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.696176', 41, 'EXECUTED', '7:0c7ce6a127a9012aed693363dac772d5', 'addForeignKeyConstraint baseTableName=starred, constraintName=fkdcfqiy0arvxmmh5e68ix75gwo, referencedTableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-42', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.706865', 42, 'EXECUTED', '7:6b9100d7e34bb424f76158d403a3c0b8', 'addForeignKeyConstraint baseTableName=user_entry, constraintName=fkhdtovkjeuj2u4adc073nh02w, referencedTableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-43', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.717102', 43, 'EXECUTED', '7:a60712d9bf2d992fa02f898683b8243c', 'addForeignKeyConstraint baseTableName=workflow_workflowversion, constraintName=fkibmeux3552ua8dwnqdb8w6991, referencedTableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-44', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.729006', 44, 'EXECUTED', '7:f734d3e7053aaff7c596cdfe6563c316', 'addForeignKeyConstraint baseTableName=tool_tag, constraintName=fkjkn6qubuvn25bun52eqjleyl6, referencedTableName=tag', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-45', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.739748', 45, 'EXECUTED', '7:4ff9f7720b66915d552d0c219cfd9750', 'addForeignKeyConstraint baseTableName=tool_tag, constraintName=fkjtsjg6jdnwxoeicd27ujmeeaj, referencedTableName=tool', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-46', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.749921', 46, 'EXECUTED', '7:0d16cb7474dee760b2a3c474a193d8d3', 'addForeignKeyConstraint baseTableName=workflow_workflowversion, constraintName=fkl8yg13ahjhtn0notrlf3amwwi, referencedTableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-47', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.762168', 47, 'EXECUTED', '7:e7a65a95719d4640ac9140b392c17b88', 'addForeignKeyConstraint baseTableName=endusergroup, constraintName=fkm0exig2r3dsxqafwaraf7rnr3, referencedTableName=usergroup', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-48', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.772623', 48, 'EXECUTED', '7:ce3c42746474158bdd5058658709e3c5', 'addForeignKeyConstraint baseTableName=version_sourcefile, constraintName=fkmby5o476bdwrx07ax2keoyttn, referencedTableName=sourcefile', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-49', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.783349', 49, 'EXECUTED', '7:148319c1373ed2e5ae8105df4a593e8d', 'addForeignKeyConstraint baseTableName=endusergroup, constraintName=fkrxn6hh2max4sk4ceehyv7mt2e, referencedTableName=enduser', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1511468490651-50', 'dyuen (generated)', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.3.0.generated.xml', '2018-01-12 11:40:49.793651', 50, 'EXECUTED', '7:77453359c92cf134f8aec571ea785714', 'addForeignKeyConstraint baseTableName=entry_label, constraintName=fks71c9mk0f98015eqgtyvs0ewp, referencedTableName=label', '', NULL, '3.5.3', NULL, NULL, '5775248835');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflowWorkflownameConvertEmptyStringToNull', 'gluu', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.584697', 51, 'EXECUTED', '7:fefcc071200d5dadf0907bd192dc88da', 'update tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('addWorkflowWorkflownameNotEmptyConstraint', 'gluu', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.598251', 52, 'EXECUTED', '7:3e6ef47c3241d3027c8198dad0ce3260', 'sql', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('custom_tool_sequence1', 'dyuen', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.661272', 54, 'EXECUTED', '7:ffea8875af6c3a7152e257cb080494bd', 'sql', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('custom_tag_sequence2', 'dyuen', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.672744', 55, 'EXECUTED', '7:d6953fc6a3408ee815050f0dd762cf03', 'sql', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflowWorkflownameConvertEmptyStringToNull', 'gluu', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:38:55.122412', 1, 'EXECUTED', '7:fefcc071200d5dadf0907bd192dc88da', 'update tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '5775135109');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('addWorkflowWorkflownameNotEmptyConstraint', 'gluu', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:38:55.137851', 2, 'EXECUTED', '7:3e6ef47c3241d3027c8198dad0ce3260', 'sql', '', NULL, '3.5.3', NULL, NULL, '5775135109');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('addCustomDockerRegistryPath', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.014385', 56, 'EXECUTED', '7:be0c4b6e5be6b34bef2459aa61a6fbd6', 'addColumn tableName=tool', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('updateAmazonCustomDockerRegistryPath', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.043835', 57, 'EXECUTED', '7:abfaad1c15020be7c1ac1d07408034db', 'sql', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('dropWorkflowPath', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.070145', 58, 'EXECUTED', '7:319cd9e44b15d6760d6cc5acad01f4cc', 'dropColumn columnName=path, tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('dropToolPath', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.095693', 59, 'EXECUTED', '7:a1a29cd690ef5ef4c75cc3a23312f0b8', 'dropColumn columnName=path, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-1', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.204314', 60, 'EXECUTED', '7:d8d8a4d446e1c3a4fe0bb622eb141221', 'addColumn tableName=tag', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-2', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.302286', 61, 'EXECUTED', '7:9dd05a2ade4a535bd3a3911950a2b084', 'addColumn tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-3', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.325685', 62, 'EXECUTED', '7:59ac9ed5e01b10c07ef316723271fd01', 'addColumn tableName=tag', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-4', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.349088', 63, 'EXECUTED', '7:c4107502953ffeb230d9470f04e20c1e', 'addColumn tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516220040864-6', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.373742', 64, 'EXECUTED', '7:c2e8572dacac26a58d8290df8a9bb15b', 'addNotNullConstraint columnName=doistatus, tableName=tag', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516220040864-7', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-14 15:39:56.398913', 65, 'EXECUTED', '7:b0138c55c539c1421b9e5791a228dff3', 'addNotNullConstraint columnName=doistatus, tableName=workflowversion', '', NULL, '3.5.3', NULL, NULL, '8640795994');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('3424324325r3r3g45g-8', 'aduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-23 14:35:18.771811', 66, 'EXECUTED', '7:e4d51fe173245a0a03a827747674e6eb', 'sql; sql; sql; sql; sql; sql; sql; dropColumn columnName=customdockerregistrypath, tableName=tool', '', NULL, '3.5.3', NULL, NULL, '9414518746');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('n4io234ni23o4nio33r-1', 'agduncan', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-27 10:10:32.301753', 67, 'EXECUTED', '7:73b67459612bc9f1de12b1a422fb333c', 'addColumn tableName=tool; addColumn tableName=workflow; addColumn tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '9744232136');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflow-jpa-dbcreate', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-27 10:10:32.327151', 68, 'EXECUTED', '7:076afe9518fa17c967b6f4947f08f185', 'addColumn tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '9744232136');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflow-jpa-dbupdate', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-27 10:10:32.351077', 69, 'EXECUTED', '7:ba02911ddbd98eb5f4fc11fba21dbf84', 'addColumn tableName=workflow', '', NULL, '3.5.3', NULL, NULL, '9744232136');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('tool-jpa-dbcreate', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-27 10:10:32.375836', 70, 'EXECUTED', '7:a74182295f270443128215ade086a3d2', 'addColumn tableName=tool', '', NULL, '3.5.3', NULL, NULL, '9744232136');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('tool-jpa-dbupdate', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-27 10:10:32.40098', 71, 'EXECUTED', '7:773d4bccae8c403a013729c43e5508f0', 'addColumn tableName=tool', '', NULL, '3.5.3', NULL, NULL, '9744232136');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('more-dates', 'dyuen (generated)', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-27 10:10:32.430996', 72, 'EXECUTED', '7:afe5039a4fe370bcbe3a5a47e06dfc15', 'addColumn tableName=usergroup; addColumn tableName=label; addColumn tableName=sourcefile; addColumn tableName=token; addColumn tableName=enduser; addColumn tableName=workflowversion; addColumn tableName=tag', '', NULL, '3.5.3', NULL, NULL, '9744232136');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('mutate-tool-modified-timestamp', 'dyuen', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-27 10:10:32.590327', 73, 'EXECUTED', '7:02fabf8d219a9eb9af3021adbc1ea1d1', 'sql', '', NULL, '3.5.3', NULL, NULL, '9744232136');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('mutate-workflow-modified-timestamp', 'dyuen', '../dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-02-27 10:10:32.754087', 74, 'EXECUTED', '7:3dde38db6057354c1ecdfd758a9b3dd2', 'sql', '', NULL, '3.5.3', NULL, NULL, '9744232136');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1520436537629-2', 'aduncan (generated)', 'dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-03-26 12:53:47.112821', 75, 'EXECUTED', '7:f92da822adb927187555c9f054fd622b', 'addForeignKeyConstraint baseTableName=workflow, constraintName=fk_checkerid_with_workflow, referencedTableName=workflow', '', NULL, '3.5.3', NULL, NULL, '2083227088');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1520436537629-3', 'aduncan (generated)', 'dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-03-26 12:53:47.128173', 76, 'EXECUTED', '7:b247682ede0cf5b6a44bb7fda57eebeb', 'addForeignKeyConstraint baseTableName=tool, constraintName=fk_checkerid_with_tool, referencedTableName=workflow', '', NULL, '3.5.3', NULL, NULL, '2083227088');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('constraint-for-underscore-workflow-and-tool-names', 'agduncan', 'dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-03-26 12:53:47.148171', 77, 'EXECUTED', '7:ff45c59a12b61110acb018acdbbd4437', 'sql; sql; sql', '', NULL, '3.5.3', NULL, NULL, '2083227088');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('fix_rogue_git_urls', 'dyuen', 'dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-03-26 12:53:47.156562', 78, 'EXECUTED', '7:0a58187fe000b278c408feb559d32d10', 'sql', '', NULL, '3.5.3', NULL, NULL, '2083227088');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('drop-toolname-null-constraint-update-check-constraint', 'agduncan', 'dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-03-26 12:53:47.171878', 79, 'EXECUTED', '7:78ea1afeb92bb869c882608d083e71fb', 'dropNotNullConstraint columnName=toolname, tableName=tool; dropDefaultValue columnName=toolname, tableName=tool; sql; sql', '', NULL, '3.5.3', NULL, NULL, '2083227088');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('create reference type', 'dyuen (generated)', 'migrations.1.5.0.xml', '2018-05-08 14:35:17.274028', 80, 'EXECUTED', '7:c5d6bec11d36146b1471f7632f916fa7', 'addColumn tableName=tag; addColumn tableName=workflowversion; addNotNullConstraint columnName=referencetype, tableName=tag; addNotNullConstraint columnName=referencetype, tableName=workflowversion', '', NULL, '3.5.4', NULL, NULL, '5804517195');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('74274923472389478923', 'agduncan', '/home/gluu/dockstore/dockstore-webservice/src/main/resources/migrations.1.4.0.xml', '2018-01-12 11:40:59.650556', 53, 'EXECUTED', '7:d7456a463382261c64fa34dc37729272', 'addColumn tableName=workflow; sql; sql; sql; sql; sql; sql; addNotNullConstraint columnName=sourcecontrol, tableName=workflow; sql; sql; sql; sql; sql; sql', '', NULL, '3.5.3', NULL, NULL, '5775259574');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflowWorkflownameConvertEmptyStringToNull', 'gluu', 'migrations.1.4.0.xml', '2018-05-08 14:46:17.614554', 81, 'EXECUTED', '7:fefcc071200d5dadf0907bd192dc88da', 'update tableName=workflow', '', NULL, '3.5.4', NULL, NULL, '5805177590');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('addWorkflowWorkflownameNotEmptyConstraint', 'gluu', 'migrations.1.4.0.xml', '2018-05-08 14:52:06.124293', 82, 'EXECUTED', '7:3e6ef47c3241d3027c8198dad0ce3260', 'sql', '', NULL, '3.5.4', NULL, NULL, '5805526074');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('74274923472389478923', 'agduncan', 'migrations.1.4.0.xml', '2018-05-08 14:52:38.475241', 83, 'EXECUTED', '7:d7456a463382261c64fa34dc37729272', 'addColumn tableName=workflow; sql; sql; sql; sql; sql; sql; addNotNullConstraint columnName=sourcecontrol, tableName=workflow; sql; sql; dropIndex indexName=full_workflow_name, tableName=workflow; sql; dropIndex indexName=partial_workflow_name, ta...', '', NULL, '3.5.4', NULL, NULL, '5805558425');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('custom_tool_sequence1', 'dyuen', 'migrations.1.4.0.xml', '2018-05-08 14:52:43.611274', 84, 'EXECUTED', '7:ffea8875af6c3a7152e257cb080494bd', 'sql', '', NULL, '3.5.4', NULL, NULL, '5805563573');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('custom_tag_sequence2', 'dyuen', 'migrations.1.4.0.xml', '2018-05-08 14:52:43.6261', 85, 'EXECUTED', '7:d6953fc6a3408ee815050f0dd762cf03', 'sql', '', NULL, '3.5.4', NULL, NULL, '5805563573');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('addCustomDockerRegistryPath', 'agduncan', 'migrations.1.4.0.xml', '2018-05-08 14:52:43.641171', 86, 'EXECUTED', '7:be0c4b6e5be6b34bef2459aa61a6fbd6', 'addColumn tableName=tool', '', NULL, '3.5.4', NULL, NULL, '5805563573');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('updateAmazonCustomDockerRegistryPath', 'agduncan', 'migrations.1.4.0.xml', '2018-05-08 14:53:14.732208', 87, 'EXECUTED', '7:abfaad1c15020be7c1ac1d07408034db', 'sql', '', NULL, '3.5.4', NULL, NULL, '5805594685');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('dropWorkflowPath', 'agduncan', 'migrations.1.4.0.xml', '2018-05-08 14:53:57.838763', 88, 'EXECUTED', '7:319cd9e44b15d6760d6cc5acad01f4cc', 'dropColumn columnName=path, tableName=workflow', '', NULL, '3.5.4', NULL, NULL, '5805637782');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('dropToolPath', 'agduncan', 'migrations.1.4.0.xml', '2018-05-08 14:54:12.021723', 89, 'EXECUTED', '7:a1a29cd690ef5ef4c75cc3a23312f0b8', 'dropColumn columnName=path, tableName=tool', '', NULL, '3.5.4', NULL, NULL, '5805651963');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-1', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:54:32.984832', 90, 'EXECUTED', '7:d8d8a4d446e1c3a4fe0bb622eb141221', 'addColumn tableName=tag', '', NULL, '3.5.4', NULL, NULL, '5805672934');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-2', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:54:49.060161', 91, 'EXECUTED', '7:9dd05a2ade4a535bd3a3911950a2b084', 'addColumn tableName=workflowversion', '', NULL, '3.5.4', NULL, NULL, '5805689007');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-3', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:55:01.074699', 92, 'EXECUTED', '7:59ac9ed5e01b10c07ef316723271fd01', 'addColumn tableName=tag', '', NULL, '3.5.4', NULL, NULL, '5805701033');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516219456530-4', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:55:12.000629', 93, 'EXECUTED', '7:c4107502953ffeb230d9470f04e20c1e', 'addColumn tableName=workflowversion', '', NULL, '3.5.4', NULL, NULL, '5805711954');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516220040864-6', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:55:17.139183', 94, 'EXECUTED', '7:c2e8572dacac26a58d8290df8a9bb15b', 'addNotNullConstraint columnName=doistatus, tableName=tag', '', NULL, '3.5.4', NULL, NULL, '5805717114');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1516220040864-7', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:55:17.152387', 95, 'EXECUTED', '7:b0138c55c539c1421b9e5791a228dff3', 'addNotNullConstraint columnName=doistatus, tableName=workflowversion', '', NULL, '3.5.4', NULL, NULL, '5805717114');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('3424324325r3r3g45g-8', 'aduncan', 'migrations.1.4.0.xml', '2018-05-08 14:55:17.17288', 96, 'EXECUTED', '7:e4d51fe173245a0a03a827747674e6eb', 'sql; sql; sql; sql; sql; sql; sql; dropColumn columnName=customdockerregistrypath, tableName=tool', '', NULL, '3.5.4', NULL, NULL, '5805717114');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('n4io234ni23o4nio33r-1', 'agduncan', 'migrations.1.4.0.xml', '2018-05-08 14:55:25.720645', 97, 'EXECUTED', '7:73b67459612bc9f1de12b1a422fb333c', 'addColumn tableName=tool; addColumn tableName=workflow; addColumn tableName=workflow', '', NULL, '3.5.4', NULL, NULL, '5805725677');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflow-jpa-dbcreate', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:55:38.19353', 98, 'EXECUTED', '7:076afe9518fa17c967b6f4947f08f185', 'addColumn tableName=workflow', '', NULL, '3.5.4', NULL, NULL, '5805738146');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('workflow-jpa-dbupdate', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.326949', 99, 'EXECUTED', '7:ba02911ddbd98eb5f4fc11fba21dbf84', 'addColumn tableName=workflow', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('tool-jpa-dbcreate', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.337498', 100, 'EXECUTED', '7:a74182295f270443128215ade086a3d2', 'addColumn tableName=tool', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('tool-jpa-dbupdate', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.342906', 101, 'EXECUTED', '7:773d4bccae8c403a013729c43e5508f0', 'addColumn tableName=tool', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('more-dates', 'dyuen (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.347776', 102, 'EXECUTED', '7:afe5039a4fe370bcbe3a5a47e06dfc15', 'addColumn tableName=usergroup; addColumn tableName=label; addColumn tableName=sourcefile; addColumn tableName=token; addColumn tableName=enduser; addColumn tableName=workflowversion; addColumn tableName=tag', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('mutate-tool-modified-timestamp', 'dyuen', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.353405', 103, 'EXECUTED', '7:02fabf8d219a9eb9af3021adbc1ea1d1', 'sql', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('mutate-workflow-modified-timestamp', 'dyuen', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.359052', 104, 'EXECUTED', '7:3dde38db6057354c1ecdfd758a9b3dd2', 'sql', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1520436537629-2', 'aduncan (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.365063', 105, 'EXECUTED', '7:f92da822adb927187555c9f054fd622b', 'addForeignKeyConstraint baseTableName=workflow, constraintName=fk_checkerid_with_workflow, referencedTableName=workflow', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('1520436537629-3', 'aduncan (generated)', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.370068', 106, 'EXECUTED', '7:b247682ede0cf5b6a44bb7fda57eebeb', 'addForeignKeyConstraint baseTableName=tool, constraintName=fk_checkerid_with_tool, referencedTableName=workflow', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('constraint-for-underscore-workflow-and-tool-names', 'agduncan', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.375101', 107, 'EXECUTED', '7:ff45c59a12b61110acb018acdbbd4437', 'sql; sql; sql', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('fix_rogue_git_urls', 'dyuen', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.38177', 108, 'EXECUTED', '7:0a58187fe000b278c408feb559d32d10', 'sql', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('drop-toolname-null-constraint-update-check-constraint', 'agduncan', 'migrations.1.4.0.xml', '2018-05-08 14:56:29.38747', 109, 'EXECUTED', '7:78ea1afeb92bb869c882608d083e71fb', 'dropNotNullConstraint columnName=toolname, tableName=tool; dropDefaultValue columnName=toolname, tableName=tool; sql; sql', '', NULL, '3.5.4', NULL, NULL, '5805789307');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('create-fileformat-tables', 'gluu (generated)', 'migrations.1.5.0.xml', '2018-06-04 13:59:33.962975', 110, 'EXECUTED', '7:3f5097e0e5b8e3ed86d3189b35d69a29', 'createTable tableName=fileformat; createTable tableName=version_input_fileformat; createTable tableName=version_output_fileformat; addUniqueConstraint constraintName=unique_fileformat, tableName=fileformat; addForeignKeyConstraint baseTableName=ve...', '', NULL, '3.5.4', NULL, NULL, '8135173906');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('version editor', 'dyuen (generated)', 'migrations.1.5.0.xml', '2018-06-04 13:59:33.974563', 111, 'EXECUTED', '7:e6acc1adbb76fe5fdfaa9ee927365400', 'addColumn tableName=tag; addColumn tableName=workflowversion; addForeignKeyConstraint baseTableName=workflowversion, constraintName=versionEditorForWorkflows, referencedTableName=enduser; addForeignKeyConstraint baseTableName=tag, constraintName=v...', '', NULL, '3.5.4', NULL, NULL, '8135173906');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('add commit ids to versions', 'dyuen (generated)', 'migrations.1.5.0.xml', '2018-06-04 13:59:33.980369', 112, 'EXECUTED', '7:257d2e22ca5374e9536359aa3625ca44', 'addColumn tableName=tag; addColumn tableName=workflowversion', '', NULL, '3.5.4', NULL, NULL, '8135173906');
INSERT INTO public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) VALUES ('verification_metadata', 'dyuen (generated)', 'migrations.1.5.0.xml', '2018-06-13 13:56:14.527219', 113, 'EXECUTED', '7:b2f0b9e12b5c019e948128be040066ec', 'createTable tableName=sourcefile_verified; addColumn tableName=enduser; addForeignKeyConstraint baseTableName=sourcefile_verified, constraintName=foreign_key, referencedTableName=sourcefile', '', NULL, '3.5.4', NULL, NULL, '8912574484');


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.databasechangeloglock (id, locked, lockgranted, lockedby) VALUES (1, false, NULL, NULL);


--
-- Data for Name: enduser; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.enduser (id, avatarurl, bio, company, email, isadmin, location, username, dbcreatedate, dbupdatedate, curator) VALUES (1, NULL, NULL, NULL, NULL, true, NULL, 'user_A', NULL, NULL, true);
INSERT INTO public.enduser (id, avatarurl, bio, company, email, isadmin, location, username, dbcreatedate, dbupdatedate, curator) VALUES (2, '', NULL, '', '', false, NULL, 'potato', NULL, NULL, false);
INSERT INTO public.enduser (id, avatarurl, bio, company, email, isadmin, location, username, dbcreatedate, dbupdatedate, curator) VALUES (3, NULL, NULL, NULL, NULL, true, NULL, 'user_admin', NULL, NULL, false);
INSERT INTO public.enduser (id, avatarurl, bio, company, email, isadmin, location, username, dbcreatedate, dbupdatedate, curator) VALUES (4, NULL, NULL, NULL, NULL, false, NULL, 'user_curator', NULL, NULL, true);



--
-- Name: enduser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.enduser_id_seq', 2, true);


--
-- Data for Name: endusergroup; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Data for Name: entry_label; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Data for Name: fileformat; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Name: fileformat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.fileformat_id_seq', 1, false);


--
-- Data for Name: label; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Name: label_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.label_id_seq', 1, false);


--
-- Data for Name: sourcefile; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (1, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (2, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (3, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (4, 'task hello {
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
', '/Dockstore.wdl', 'DOCKSTORE_WDL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (5, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (6, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (7, 'task hello {
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
', '/Dockstore.wdl', 'DOCKSTORE_WDL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (8, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (9, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (10, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (11, 'cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []', '/Dockstore.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (12, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (13, 'task hello {
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
', '/Dockstore.wdl', 'DOCKSTORE_WDL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (14, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (15, 'task hello {
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
', '/Dockstore.wdl', 'DOCKSTORE_WDL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (16, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (17, 'class: s:SoftwareSourceCode
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

', 'alea-metadata.yaml', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (18, 'class: EnvVarRequirement
envDef:
  - envName: "PATH"
    envValue: "/usr/local/bin/:/usr/bin:/bin"
', 'envvar-global.yml', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (19, 'class: DockerRequirement
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
', 'alea-docker.yml', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (28, 'cwlVersion: v1.0
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
', '/1st-workflow.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (29, '#!/usr/bin/env cwl-runner
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
', 'grep.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (30, '#!/usr/bin/env cwl-runner
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
', 'wc.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (20, '#!/usr/bin/env cwl-runner

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
', '/Dockstore.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (21, 'FROM ubuntu:12.04
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (22, 'class: s:SoftwareSourceCode
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

', 'alea-metadata.yaml', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (23, 'class: EnvVarRequirement
envDef:
  - envName: "PATH"
    envValue: "/usr/local/bin/:/usr/bin:/bin"
', 'envvar-global.yml', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (24, 'class: DockerRequirement
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
', 'alea-docker.yml', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (25, '#!/usr/bin/env cwl-runner

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
', '/Dockstore.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (26, 'FROM ubuntu:12.04
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (27, 'class: Workflow
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
', 'grep-and-count.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (31, 'cwlVersion: v1.0
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
', 'arguments.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (32, 'cwlVersion: v1.0
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
', 'tar-param.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (35, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/testDir/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (36, 'FROM docker/whalesay:latest

RUN apt-get -y update && apt-get install -y fortunes

CMD /usr/games/fortune -a | cowsay
', '/testDir/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (39, '#!/usr/bin/env cwl-runner

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
', '/cwls/cgpmap-cramOut.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (40, 'FROM  ubuntu:16.04 as builder

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
', '/Dockerfile', 'DOCKERFILE', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (41, '{
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
', '/examples/cgpmap/cramOut/fastq_gz_input.json', 'CWL_TEST_JSON', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (70, 'cwlVersion: v1.0
class: Workflow

inputs:
  input_file: File

outputs:
  output_file:
    type: File
    outputSource: md5sum/output_file

steps:
  md5sum:
    run: md5sum-tool.cwl
    in:
      input_file: input_file
    out: [output_file]
', 'md5sum-workflow.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (71, '#!/usr/bin/env cwl-runner

class: CommandLineTool
id: Md5sum
label: Simple md5sum tool
cwlVersion: v1.0

$namespaces:
  dct: http://purl.org/dc/terms/
  foaf: http://xmlns.com/foaf/0.1/

requirements:
- class: DockerRequirement
  dockerPull: quay.io/agduncan94/my-md5sum
- class: InlineJavascriptRequirement

hints:
- class: ResourceRequirement
  # The command really requires very little resources.
  coresMin: 1
  ramMin: 1024
  outdirMin: 512

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
', 'md5sum-tool.cwl', 'DOCKSTORE_CWL', NULL, NULL);

INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (60, 'version: 1.2
workflows:
   - subclass: cwl
     primaryDescriptorPath: /dockstore.cwl
', '/.dockstore.yml', 'DOCKSTORE_YML', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (61, 'cwlVersion: v1.0
class: Workflow

inputs:
  input_file: File

outputs:
  output_file:
    type: File
    outputSource: md5sum/output_file

steps:
  md5sum:
    run: md5sum-tool.cwl
    in:
      input_file: input_file
    out: [output_file]
', '/Dockstore.cwl', 'DOCKSTORE_CWL', NULL, NULL);
INSERT INTO public.sourcefile (id, content, path, type, dbcreatedate, dbupdatedate) VALUES (62, '#!/usr/bin/env cwl-runner

class: CommandLineTool
id: Md5sum
label: Simple md5sum tool
cwlVersion: v1.0

requirements:
- class: DockerRequirement
  dockerPull: quay.io/agduncan94/my-md5sum
- class: InlineJavascriptRequirement

hints:
- class: ResourceRequirement
  # The command really requires very little resources.
  coresMin: 1
  ramMin: 1024
  outdirMin: 512

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
', 'md5sum-tool.cwl', 'DOCKSTORE_CWL', NULL, NULL);

--
-- Name: sourcefile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.sourcefile_id_seq', 41, true);


--
-- Data for Name: sourcefile_verified; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Data for Name: starred; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (1, false, false, '2016-02-04 16:44:00', 'test', 'feature/test', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '84fc64995896cd90f9b9732e28d4115e82dd471c40925b0ba34c9a419fbe2fa8', 108608297, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (2, false, false, '2016-02-16 17:06:55', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'e919f2df4a7b01f3be3dc74483544cd9ee8396714dfdbb2e41679039de7cc3e1', 108608275, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (3, false, false, '2016-02-16 17:06:56', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'e919f2df4a7b01f3be3dc74483544cd9ee8396714dfdbb2e41679039de7cc3e1', 108608275, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (4, false, false, '2016-03-15 15:41:00', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '2cf0cccd32556daf9a0137277938d6f033b7a7c5d65628b582b2ed9afdde40f5', 108722095, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (5, false, false, '2016-03-15 15:41:03', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '2cf0cccd32556daf9a0137277938d6f033b7a7c5d65628b582b2ed9afdde40f5', 108722095, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (8, false, true, '2016-03-15 15:42:04', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'f92aa8edcc265e4d5faabf7f89157008d52d514f8f6d7c1b833024f58f126e9d', 108722128, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (9, false, false, '2016-03-15 15:42:05', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', 'f92aa8edcc265e4d5faabf7f89157008d52d514f8f6d7c1b833024f58f126e9d', 108722128, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (10, false, false, '2016-06-08 14:08:08', 'master', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '9227b87c1304b9ce746d06d0eb8144ec17a253f5b8e00a3922d86b538c8296c0', 44363874, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (11, false, false, '2016-06-08 14:08:08', 'latest', 'master', true, false, NULL, true, '/Dockstore.cwl', '/Dockerfile', '9227b87c1304b9ce746d06d0eb8144ec17a253f5b8e00a3922d86b538c8296c0', 44363874, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (6, false, false, '2016-03-15 15:39:17', 'master', 'master', false, false, NULL, true, '/Dockstore.cwl', '/testDir/Dockerfile', '8079f14d756280940d56957f0e1ddb14b8d3124a8d1d195f4a51f2a051d84726', 108722088, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (7, false, false, '2016-03-15 15:39:19', 'latest', 'master', false, false, NULL, true, '/Dockstore.cwl', '/testDir/Dockerfile', '8079f14d756280940d56957f0e1ddb14b8d3124a8d1d195f4a51f2a051d84726', 108722088, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);
INSERT INTO public.tag (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, automated, cwlpath, dockerfilepath, imageid, size, wdlpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (52, false, false, '2018-02-12 15:49:28', '3.0.0-rc8', '3.0.0-rc8', true, false, NULL, true, '/cwls/cgpmap-cramOut.cwl', '/Dockerfile', 'c387f22e65f066c42ccaf11392fdbd640aa2b7627eb40ac06a0dbaca2ca323cb', 138844180, '/Dockstore.wdl', 'NOT_REQUESTED', NULL, '2016-02-04 16:44:00', '2016-02-04 16:44:00', 'UNSET', NULL, NULL);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.tag_id_seq', 101, true);


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.token (id, content, refreshtoken, tokensource, userid, username, dbcreatedate, dbupdatedate) VALUES (1, 'imamafakedockstoretoken', NULL, 'dockstore', 1, 'user_A', NULL, NULL);
INSERT INTO public.token (id, content, refreshtoken, tokensource, userid, username, dbcreatedate, dbupdatedate) VALUES (2, 'imamafakegithubtoken', NULL, 'github.com', 1, 'user_A', NULL, NULL);
INSERT INTO public.token (id, content, refreshtoken, tokensource, userid, username, dbcreatedate, dbupdatedate) VALUES (4, 'imamafakequaytoken', NULL, 'quay.io', 1, 'user_A', NULL, NULL);
INSERT INTO public.token (id, content, refreshtoken, tokensource, userid, username, dbcreatedate, dbupdatedate) VALUES (5, 'imamafakedockstoretoken2', NULL, 'dockstore', 4, 'user_curator', NULL, NULL);
INSERT INTO public.token (id, content, refreshtoken, tokensource, userid, username, dbcreatedate, dbupdatedate) VALUES (6, 'imamafakegithubtoken2', NULL, 'github.com', 4, 'user_curator', NULL, NULL);
INSERT INTO public.token (id, content, refreshtoken, tokensource, userid, username, dbcreatedate, dbupdatedate) VALUES (7, 'imamafakequaytoken2', NULL, 'quay.io', 4, 'user_curator', NULL, NULL);


--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.token_id_seq', 10, true);


--
-- Data for Name: tool; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, checkerid, dbcreatedate, dbupdatedate) VALUES (52, NULL, NULL, NULL, NULL, 'git@github.com:garyluu/dockstore-cgpmap.git', true, NULL, '2018-02-12 15:55:42.691', '/cwls/cgpmap-cramOut.cwl', '/Dockerfile', '/examples/cgpmap/cramOut/fastq_gz_input.json', '/test.wdl.json', '/Dockstore.wdl', '2018-02-12 15:40:19', 'MANUAL_IMAGE_PATH', 'dockstore-cgpmap', 'garyluu', false, 'quay.io', '', 'cgpmap-cramOut', NULL, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, checkerid, dbcreatedate, dbupdatedate) VALUES (2, 'testuser2', NULL, 'Whalesay deep quotes', NULL, 'git@github.com:A2/b1.git', false, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-03-15 15:35:29', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b1', 'A2', false, 'quay.io', '', NULL, NULL, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, checkerid, dbcreatedate, dbupdatedate) VALUES (5, NULL, NULL, '', NULL, 'git@github.com:A2/a.git', true, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-06-08 14:06:36', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'a', 'A2', false, 'quay.io', '', NULL, NULL, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, checkerid, dbcreatedate, dbupdatedate) VALUES (4, NULL, NULL, NULL, NULL, 'git@github.com:A2/b3.git', true, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-03-15 15:36:22', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b3', 'A2', false, 'quay.io', '', NULL, NULL, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, checkerid, dbcreatedate, dbupdatedate) VALUES (3, NULL, NULL, NULL, NULL, 'git@github.com:A2/b2.git', false, NULL, '2016-11-28 15:02:48.557', '/Dockstore.cwl', '/testDir/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-03-15 15:35:57', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'b2', 'A2', false, 'quay.io', '', NULL, NULL, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, checkerid, dbcreatedate, dbupdatedate) VALUES (1, 'testuser', NULL, 'Whalesay deep quotes', NULL, 'git@github.com:A/a.git', false, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-02-16 17:04:59', 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS', 'a', 'A', true, 'amazon.dkr.ecr.test.amazonaws.com', 'test@email.com', NULL, NULL, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.tool (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaultcwlpath, defaultdockerfilepath, defaulttestcwlparameterfile, defaulttestwdlparameterfile, defaultwdlpath, lastbuild, mode, name, namespace, privateaccess, registry, toolmaintaineremail, toolname, checkerid, dbcreatedate, dbupdatedate) VALUES (100, 'testuser2', NULL, 'Whalesay deep quotes', NULL, NULL, false, NULL, '2016-11-28 15:00:43.873', '/Dockstore.cwl', '/Dockerfile', NULL, NULL, '/Dockstore.wdl', '2016-03-15 15:35:29', 'HOSTED', 'ht', 'hosted-tool', false, 'quay.io', '', NULL, NULL, '2016-06-08 14:06:36', '2016-06-08 14:06:36');

--
-- Data for Name: tool_tag; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.tool_tag (toolid, tagid) VALUES (1, 1);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (1, 2);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (1, 3);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (2, 4);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (2, 5);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (3, 6);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (3, 7);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (4, 8);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (4, 9);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (5, 10);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (5, 11);
INSERT INTO public.tool_tag (toolid, tagid) VALUES (52, 52);


--
-- Data for Name: user_entry; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.user_entry (userid, entryid) VALUES (1, 1);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 2);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 3);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 4);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 5);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 6);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 7);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 8);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 9);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 10);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 11);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 12);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 13);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 14);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 16);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 17);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 18);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 19);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 20);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 21);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 22);
INSERT INTO public.user_entry (userid, entryid) VALUES (1, 30);
INSERT INTO public.user_entry (userid, entryid) VALUES (2, 52);


--
-- Data for Name: usergroup; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Name: usergroup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.usergroup_id_seq', 1, false);


--
-- Data for Name: version_input_fileformat; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Data for Name: version_output_fileformat; Type: TABLE DATA; Schema: public; Owner: dockstore
--



--
-- Data for Name: version_sourcefile; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (1, 2);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (1, 1);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (2, 4);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (2, 3);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (2, 5);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (3, 8);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (3, 6);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (3, 7);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (4, 10);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (4, 9);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (5, 12);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (5, 11);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (8, 13);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (8, 14);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (9, 16);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (9, 15);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (10, 17);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (10, 19);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (10, 20);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (10, 18);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (10, 21);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (11, 26);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (11, 23);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (11, 22);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (11, 24);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (11, 25);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (13, 27);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (13, 28);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (13, 30);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (13, 32);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (13, 29);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (13, 31);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (14, 70);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (14, 71);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (6, 35);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (7, 36);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (52, 39);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (52, 40);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (52, 41);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (20, 60);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (20, 61);
INSERT INTO public.version_sourcefile (versionid, sourcefileid) VALUES (20, 62);


--
-- Data for Name: workflow; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (7, NULL, NULL, NULL, NULL, 'git@github.com:A/c.git', false, NULL, '2016-11-28 15:00:57.315', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'c', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (8, NULL, NULL, NULL, NULL, 'git@github.com:A/f.git', false, NULL, '2016-11-28 15:00:57.419', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'f', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (9, NULL, NULL, NULL, NULL, 'git@github.com:A/k.git', false, NULL, '2016-11-28 15:00:57.482', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'k', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (10, NULL, NULL, NULL, NULL, 'git@github.com:A/e.git', false, NULL, '2016-11-28 15:00:57.593', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'e', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (12, NULL, NULL, NULL, NULL, 'git@github.com:A/g.git', false, NULL, '2016-11-28 15:00:57.788', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'g', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (13, NULL, NULL, NULL, NULL, 'git@github.com:A/j.git', false, NULL, '2016-11-28 15:00:57.792', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'j', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (14, NULL, NULL, NULL, NULL, 'git@github.com:A/m.git', false, NULL, '2016-11-28 15:00:57.859', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'm', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (16, NULL, NULL, NULL, NULL, 'git@github.com:A/d.git', false, NULL, '2016-11-28 15:00:58.068', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'd', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (17, NULL, NULL, NULL, NULL, 'git@github.com:A/i.git', false, NULL, '2016-11-28 15:00:58.073', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'i', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (18, NULL, NULL, NULL, NULL, 'git@github.com:A/b.git', false, NULL, '2016-11-28 15:00:58.153', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'b', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (19, NULL, NULL, NULL, NULL, 'git@github.com:A/h.git', false, NULL, '2016-11-28 15:00:58.157', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'h', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (20, NULL, NULL, NULL, NULL, 'git@github.com:A/a.git', false, NULL, '2016-11-28 15:00:57.948', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'A', 'a', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (11, NULL, NULL, NULL, NULL, 'git@github.com:A/l.git', true, NULL, '2016-11-28 15:00:57.688', NULL, '/1st-workflow.cwl', 'cwl', 'FULL', 'A', 'l', NULL, 'github.com', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (6, NULL, NULL, NULL, NULL, 'git@bitbucket.org:a/a.git', false, NULL, '2016-11-28 15:00:57.148', NULL, '/Dockstore.cwl', 'cwl', 'STUB', 'a', 'a', NULL, 'bitbucket.org', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (21, NULL, NULL, NULL, NULL, NULL, false, NULL, '2016-11-28 15:00:57.315', NULL, '/Dockstore.wdl', 'wdl', 'HOSTED', 'A', 'hosted-workflow', NULL, 'dockstore.org', NULL, false, '2016-06-08 14:06:36', '2016-06-08 14:06:36');
INSERT INTO public.workflow (id, author, defaultversion, description, email, giturl, ispublished, lastmodified, lastupdated, defaulttestparameterfilepath, defaultworkflowpath, descriptortype, mode, organization, repository, workflowname, sourcecontrol, checkerid, ischecker, dbcreatedate, dbupdatedate) VALUES (30, NULL, NULL, NULL, NULL, 'git@github.com:B/z.git', false, NULL, '2020-01-28 15:00:57.315', NULL, '/Dockstore.cwl', 'cwl', 'DOCKSTORE_YML', 'B', 'z', NULL, 'github.com', NULL, false, '2020-01-08 14:06:36', '2020-01-08 14:06:36');



--
-- Data for Name: workflow_workflowversion; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.workflow_workflowversion (workflowid, workflowversionid) VALUES (11, 13);
INSERT INTO public.workflow_workflowversion (workflowid, workflowversionid) VALUES (11, 14);
INSERT INTO public.workflow_workflowversion (workflowid, workflowversionid) VALUES (30, 20);


--
-- Data for Name: workflowversion; Type: TABLE DATA; Schema: public; Owner: dockstore
--

INSERT INTO public.workflowversion (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, workflowpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (13, false, false, '2016-11-28 15:01:57.003', 'master', 'master', true, false, NULL, '/1st-workflow.cwl', 'NOT_REQUESTED', NULL, '2016-11-28 15:01:59.003', '2016-11-28 15:01:59.003', 'UNSET', NULL, NULL);
INSERT INTO public.workflowversion (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, workflowpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (14, false, true, '2016-11-28 15:01:57.003', 'test', 'test', true, false, NULL, '/1st-workflow.cwl', 'NOT_REQUESTED', NULL, '2016-11-28 15:01:57.003', '2016-11-28 15:01:57.003', 'UNSET', NULL, NULL);
INSERT INTO public.workflowversion (id, dirtybit, hidden, lastmodified, name, reference, valid, verified, verifiedsource, workflowpath, doistatus, doiurl, dbcreatedate, dbupdatedate, referencetype, versioneditor_id, commitid) VALUES (20, false, true, '2020-01-28 15:01:57.003', 'master', 'master', true, false, NULL, '/Dockstore.cwl', 'NOT_REQUESTED', NULL, '2020-01-28 15:01:57.003', '2020-01-28 15:01:57.003', 'BRANCH', NULL, NULL);


--
-- Name: enduser enduser_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.enduser
    ADD CONSTRAINT enduser_pkey PRIMARY KEY (id);


--
-- Name: endusergroup endusergroup_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.endusergroup
    ADD CONSTRAINT endusergroup_pkey PRIMARY KEY (userid, groupid);


--
-- Name: entry_label entry_label_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.entry_label
    ADD CONSTRAINT entry_label_pkey PRIMARY KEY (entryid, labelid);


--
-- Name: fileformat fileformat_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.fileformat
    ADD CONSTRAINT fileformat_pkey PRIMARY KEY (id);


--
-- Name: label label_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT label_pkey PRIMARY KEY (id);


--
-- Name: databasechangeloglock pk_databasechangeloglock; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT pk_databasechangeloglock PRIMARY KEY (id);


--
-- Name: sourcefile sourcefile_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.sourcefile
    ADD CONSTRAINT sourcefile_pkey PRIMARY KEY (id);


--
-- Name: sourcefile_verified sourcefile_verified_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.sourcefile_verified
    ADD CONSTRAINT sourcefile_verified_pkey PRIMARY KEY (id, source);


--
-- Name: starred starred_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.starred
    ADD CONSTRAINT starred_pkey PRIMARY KEY (entryid, userid);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: tool tool_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tool
    ADD CONSTRAINT tool_pkey PRIMARY KEY (id);


--
-- Name: tool_tag tool_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tool_tag
    ADD CONSTRAINT tool_tag_pkey PRIMARY KEY (toolid, tagid);


--
-- Name: enduser uk_9vcoeu4nuu2ql7fh05mn20ydd; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.enduser
    ADD CONSTRAINT uk_9vcoeu4nuu2ql7fh05mn20ydd UNIQUE (username);


--
-- Name: label uk_9xhsn1bsea2csoy3l0gtq41vv; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT uk_9xhsn1bsea2csoy3l0gtq41vv UNIQUE (value);


--
-- Name: version_sourcefile uk_e2j71kjdot9b8l5qmjw2ve38o; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.version_sourcefile
    ADD CONSTRAINT uk_e2j71kjdot9b8l5qmjw2ve38o UNIQUE (sourcefileid);


--
-- Name: workflow_workflowversion uk_encl8hnebnkcaxj9tlugr9cxh; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflow_workflowversion
    ADD CONSTRAINT uk_encl8hnebnkcaxj9tlugr9cxh UNIQUE (workflowversionid);


--
-- Name: tool_tag uk_jdgfioq44aqox39xrs1wceow1; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tool_tag
    ADD CONSTRAINT uk_jdgfioq44aqox39xrs1wceow1 UNIQUE (tagid);


--
-- Name: tool ukbq5vy17y4ocaist3d3r3imcus; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tool
    ADD CONSTRAINT ukbq5vy17y4ocaist3d3r3imcus UNIQUE (registry, namespace, name, toolname);


--
-- Name: workflow uknlbos7i98icbaql5cyt5bhhy2; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflow
    ADD CONSTRAINT uknlbos7i98icbaql5cyt5bhhy2 UNIQUE (sourcecontrol, organization, repository, workflowname);


--
-- Name: fileformat unique_fileformat; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.fileformat
    ADD CONSTRAINT unique_fileformat UNIQUE (value);


--
-- Name: user_entry user_entry_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.user_entry
    ADD CONSTRAINT user_entry_pkey PRIMARY KEY (entryid, userid);


--
-- Name: usergroup usergroup_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.usergroup
    ADD CONSTRAINT usergroup_pkey PRIMARY KEY (id);


--
-- Name: version_input_fileformat version_input_fileformat_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.version_input_fileformat
    ADD CONSTRAINT version_input_fileformat_pkey PRIMARY KEY (versionid, fileformatid);


--
-- Name: version_output_fileformat version_outputfileformat_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.version_output_fileformat
    ADD CONSTRAINT version_outputfileformat_pkey PRIMARY KEY (versionid, fileformatid);


--
-- Name: version_sourcefile version_sourcefile_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.version_sourcefile
    ADD CONSTRAINT version_sourcefile_pkey PRIMARY KEY (versionid, sourcefileid);


--
-- Name: workflow workflow_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflow
    ADD CONSTRAINT workflow_pkey PRIMARY KEY (id);


--
-- Name: workflow_workflowversion workflow_workflowversion_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflow_workflowversion
    ADD CONSTRAINT workflow_workflowversion_pkey PRIMARY KEY (workflowid, workflowversionid);


--
-- Name: workflowversion workflowversion_pkey; Type: CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflowversion
    ADD CONSTRAINT workflowversion_pkey PRIMARY KEY (id);


--
-- Name: full_tool_name; Type: INDEX; Schema: public; Owner: dockstore
--

CREATE UNIQUE INDEX full_tool_name ON public.tool USING btree (registry, namespace, name, toolname) WHERE (toolname IS NOT NULL);


--
-- Name: full_workflow_name; Type: INDEX; Schema: public; Owner: dockstore
--

CREATE UNIQUE INDEX full_workflow_name ON public.workflow USING btree (sourcecontrol, organization, repository, workflowname) WHERE (workflowname IS NOT NULL);


--
-- Name: partial_tool_name; Type: INDEX; Schema: public; Owner: dockstore
--

CREATE UNIQUE INDEX partial_tool_name ON public.tool USING btree (registry, namespace, name) WHERE (toolname IS NULL);


--
-- Name: partial_workflow_name; Type: INDEX; Schema: public; Owner: dockstore
--

CREATE UNIQUE INDEX partial_workflow_name ON public.workflow USING btree (sourcecontrol, organization, repository) WHERE (workflowname IS NULL);


--
-- Name: tool fk_checkerid_with_tool; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tool
    ADD CONSTRAINT fk_checkerid_with_tool FOREIGN KEY (checkerid) REFERENCES public.workflow(id);


--
-- Name: workflow fk_checkerid_with_workflow; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflow
    ADD CONSTRAINT fk_checkerid_with_workflow FOREIGN KEY (checkerid) REFERENCES public.workflow(id);


--
-- Name: version_input_fileformat fk_fileformatid_with_version_input_fileformat; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.version_input_fileformat
    ADD CONSTRAINT fk_fileformatid_with_version_input_fileformat FOREIGN KEY (fileformatid) REFERENCES public.fileformat(id);


--
-- Name: version_output_fileformat fk_fileformatid_with_version_output_fileformat; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.version_output_fileformat
    ADD CONSTRAINT fk_fileformatid_with_version_output_fileformat FOREIGN KEY (fileformatid) REFERENCES public.fileformat(id);


--
-- Name: starred fkdcfqiy0arvxmmh5e68ix75gwo; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.starred
    ADD CONSTRAINT fkdcfqiy0arvxmmh5e68ix75gwo FOREIGN KEY (userid) REFERENCES public.enduser(id);


--
-- Name: workflow_workflowversion fkibmeux3552ua8dwnqdb8w6991; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflow_workflowversion
    ADD CONSTRAINT fkibmeux3552ua8dwnqdb8w6991 FOREIGN KEY (workflowversionid) REFERENCES public.workflowversion(id);


--
-- Name: tool_tag fkjkn6qubuvn25bun52eqjleyl6; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tool_tag
    ADD CONSTRAINT fkjkn6qubuvn25bun52eqjleyl6 FOREIGN KEY (tagid) REFERENCES public.tag(id);


--
-- Name: tool_tag fkjtsjg6jdnwxoeicd27ujmeeaj; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tool_tag
    ADD CONSTRAINT fkjtsjg6jdnwxoeicd27ujmeeaj FOREIGN KEY (toolid) REFERENCES public.tool(id);


--
-- Name: workflow_workflowversion fkl8yg13ahjhtn0notrlf3amwwi; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflow_workflowversion
    ADD CONSTRAINT fkl8yg13ahjhtn0notrlf3amwwi FOREIGN KEY (workflowid) REFERENCES public.workflow(id);


--
-- Name: endusergroup fkm0exig2r3dsxqafwaraf7rnr3; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.endusergroup
    ADD CONSTRAINT fkm0exig2r3dsxqafwaraf7rnr3 FOREIGN KEY (groupid) REFERENCES public.usergroup(id);


--
-- Name: version_sourcefile fkmby5o476bdwrx07ax2keoyttn; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.version_sourcefile
    ADD CONSTRAINT fkmby5o476bdwrx07ax2keoyttn FOREIGN KEY (sourcefileid) REFERENCES public.sourcefile(id);


--
-- Name: endusergroup fkrxn6hh2max4sk4ceehyv7mt2e; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.endusergroup
    ADD CONSTRAINT fkrxn6hh2max4sk4ceehyv7mt2e FOREIGN KEY (userid) REFERENCES public.enduser(id);


--
-- Name: entry_label fks71c9mk0f98015eqgtyvs0ewp; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.entry_label
    ADD CONSTRAINT fks71c9mk0f98015eqgtyvs0ewp FOREIGN KEY (labelid) REFERENCES public.label(id);


--
-- Name: sourcefile_verified foreign_key; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.sourcefile_verified
    ADD CONSTRAINT foreign_key FOREIGN KEY (id) REFERENCES public.sourcefile(id);


--
-- Name: tag versionEditorForTools; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "versionEditorForTools" FOREIGN KEY (versioneditor_id) REFERENCES public.enduser(id);


--
-- Name: workflowversion versionEditorForWorkflows; Type: FK CONSTRAINT; Schema: public; Owner: dockstore
--

ALTER TABLE ONLY public.workflowversion
    ADD CONSTRAINT "versionEditorForWorkflows" FOREIGN KEY (versioneditor_id) REFERENCES public.enduser(id);


--
-- PostgreSQL database dump complete
--

