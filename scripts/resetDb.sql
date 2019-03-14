SELECT pg_cancel_backend(pid) FROM pg_stat_activity WHERE pid IN (SELECT pid FROM pg_locks) AND query NOT LIKE '%pg_stat_activity%';
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO dockstore;
