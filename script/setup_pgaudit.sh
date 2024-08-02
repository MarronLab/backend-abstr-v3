
#!/bin/bash

# Variables
PG_VERSION="14" # Change this to your PostgreSQL version
DB_NAME="your_database" # Replace with your database name
PG_USER="postgres"

# Install PostgreSQL development packages
echo "Installing PostgreSQL development packages..."
sudo apt-get update
sudo apt-get install -y postgresql-server-dev-$PG_VERSION

# Install pgAudit
echo "Cloning and installing pgAudit..."
git clone https://github.com/pgaudit/pgaudit.git
cd pgaudit || exit
make
sudo make install
cd ..

# Configure PostgreSQL to load pgAudit
echo "Configuring PostgreSQL to load pgAudit..."
PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
sudo sed -i "/#shared_preload_libraries = ''/a shared_preload_libraries = 'pgaudit'" $PG_CONF

# Set pgAudit logging options
echo "Setting pgAudit logging options..."
sudo bash -c "echo \"pgaudit.log = 'read, write'\" >> $PG_CONF"

# Restart PostgreSQL to apply changes
echo "Restarting PostgreSQL..."
sudo systemctl restart postgresql

# Enable pgAudit in the specified database
echo "Enabling pgAudit in the database..."
sudo -u $PG_USER psql -d $DB_NAME -c "CREATE EXTENSION pgaudit;"

# Verify pgAudit setup
echo "Verifying pgAudit setup..."
LOG_PATH=$(sudo -u $PG_USER psql -d $DB_NAME -c "SHOW log_directory;" -t | tr -d ' ')
LOG_FILE=$(sudo -u $PG_USER psql -d $DB_NAME -c "SHOW log_filename;" -t | tr -d ' ')
LOG_FULL_PATH="/var/lib/postgresql/$PG_VERSION/main/${LOG_PATH}/${LOG_FILE}"

echo "Please check the log file at $LOG_FULL_PATH for audit logs."

echo "pgAudit setup completed successfully."
