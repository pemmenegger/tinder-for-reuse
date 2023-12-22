# Backend

## How to Update the Database Schema

1. Do your changes in `/app/models/`
2. Make sure that the application is running locally (database must be running)
3. Run `sh run_migration_create.sh <migration_name>`
4. Check in `migrations/versions/` if the migration is correct. Sometimes you need to change the migration manually or add some code to the migration file.
5. Run `sh run_migration_upgrade.sh` to apply the migration to the database

If you made a mistake, you can run `sh run_migration_downgrade.sh` to revert the last migration and then run `sh run_migration_upgrade.sh` again with the updated migration. Note: Close all open database sessions, i.e. DBeaver connection, before running downgrade, otherwise it will not work.
