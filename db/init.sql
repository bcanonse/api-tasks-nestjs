-- CREATE DATABASE IF NOT EXISTS codrrdb
SELECT 'CREATE DATABASE apitasks'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'apitasks')\gexec
