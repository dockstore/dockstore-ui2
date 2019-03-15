/* Remove all locks except for this one process */
SELECT pg_cancel_backend(pid) FROM pg_stat_activity WHERE pid IN (SELECT pid FROM pg_locks) AND query NOT LIKE '%pg_stat_activity%';
/* Ultimately drops all tables (better than dropping database on a running webservice connected to it) */
DROP SCHEMA public CASCADE;
/* Recreate the schema for the tables */
CREATE SCHEMA public;
/* Recreate the permissions on everything (just in case) */
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO dockstore;
