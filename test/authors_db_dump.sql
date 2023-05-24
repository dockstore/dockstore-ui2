--
-- PostgreSQL database dump
--

-- Dumped from database version 13.7 (Debian 13.7-1.pgdg110+1)
-- Dumped by pg_dump version 13.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: author; Type: TABLE DATA; Schema: public; Owner: dockstore
--

COPY public.author (id, affiliation, dbcreatedate, dbupdatedate, email, name, role, versionid) FROM stdin;
1	\N	\N	\N	Muhammad.Lee@oicr.on.ca	Muhammed Lee	\N	13
\.


--
-- Name: author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dockstore
--

SELECT pg_catalog.setval('public.author_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

