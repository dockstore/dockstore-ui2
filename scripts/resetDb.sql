/*
 *    Copyright 2019 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
BEGIN;
    /* Remove all locks except for this one process */
    SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pid IN (SELECT pid FROM pg_locks) AND query NOT LIKE '%pg_stat_activity%';
    /* Ultimately drops all tables (better than dropping database on a running webservice connected to it) */
    DROP SCHEMA public CASCADE;
    /* Recreate the schema for the tables */
    CREATE SCHEMA public;
    /* Recreate the permissions on everything (just in case) */
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
    GRANT ALL ON SCHEMA public TO dockstore;
COMMIT;
