
#!/bin/bash

# Variables
PG_VERSION="14" # Change this to your PostgreSQL version
DB_NAME="maroon_audit" # Replace with your database name
PG_CONTAINER_NAME="postgres_pgaudit"
PG_PORT="5432" # PostgreSQL default port
PG_USER="postgres"
PG_PASSWORD="rootpass" # Replace with your PostgreSQL password

# Pull PostgreSQL Docker image
echo "Pulling PostgreSQL Docker image..."
docker pull postgres:$PG_VERSION

# Start PostgreSQL container
echo "Starting PostgreSQL container..."
docker run --name $PG_CONTAINER_NAME -e POSTGRES_PASSWORD=$PG_PASSWORD -p $PG_PORT:5432 -d postgres:$PG_VERSION

# Wait for PostgreSQL to initialize
echo "Waiting for PostgreSQL to initialize..."
sleep 10

# Install dependencies and pgAudit in the container
echo "Installing dependencies and pgAudit in the container..."
docker exec -it $PG_CONTAINER_NAME bash -c "apt-get update && apt-get install -y postgresql-server-dev-$PG_VERSION build-essential git"
docker exec -it $PG_CONTAINER_NAME bash -c "git clone https://github.com/pgaudit/pgaudit.git && cd pgaudit && make && make install"

# Configure PostgreSQL to load pgAudit
echo "Configuring PostgreSQL to load pgAudit..."
docker exec -it $PG_CONTAINER_NAME bash -c "echo \"shared_preload_libraries = 'pgaudit'\" >> /var/lib/postgresql/data/postgresql.conf"
docker exec -it $PG_CONTAINER_NAME bash -c "echo \"pgaudit.log = 'read, write'\" >> /var/lib/postgresql/data/postgresql.conf"

# Restart PostgreSQL service in the container
echo "Restarting PostgreSQL service in the container..."
docker exec -it $PG_CONTAINER_NAME bash -c "pg_ctlcluster $PG_VERSION main restart"

# Enable pgAudit in the specified database
echo "Enabling pgAudit in the database..."
docker exec -it $PG_CONTAINER_NAME psql -U $PG_USER -d $DB_NAME -c "CREATE EXTENSION pgaudit;"

# Verify pgAudit setup
echo "Verifying pgAudit setup..."
LOG_PATH=$(docker exec -it $PG_CONTAINER_NAME psql -U $PG_USER -d $DB_NAME -c "SHOW log_directory;" -t | tr -d ' ')
LOG_FILE=$(docker exec -it $PG_CONTAINER_NAME psql -U $PG_USER -d $DB_NAME -c "SHOW log_filename;" -t | tr -d ' ')
LOG_FULL_PATH="/var/lib/postgresql/data/${LOG_PATH}/${LOG_FILE}"

echo "Please check the log file at $LOG_FULL_PATH for audit logs."

echo "pgAudit setup in Docker container completed successfully."
