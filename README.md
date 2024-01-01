# Tinder For Reuse: An Application to Empower Circular Economy for Construction

This `README.md` gives a short introduction and focuses on technical aspects of how to run and configure the application on your computer. For a more in-depth description of challenges and implication, decisions we made, functionalities, and future work, please consult our [Wiki](https://github.com/pemmenegger/tinder-for-reuse/wiki).

## Introduction

The construction sector significantly contributes to global CO2 emissions, partially because most demolished building materials are sent to landfills instead of recycled. This increases environmental damage and overlooks the potential for a circular economy. Although there are marketplaces for selling deconstructed building components, they have not yet gained widespread acceptance, leaving a gap in the market for a viable solution. Consequently, we developed Tinder For Reuse, an application that facilitates the reuse of reclaimed building elements by connecting and matching building owners, contractors specializing in deconstruction and element reclamation, and collectors dedicated to reintegrating these reclaimed elements into the construction market. Our goal with this solution is to significantly reduce construction waste, decrease carbon emissions, and promote sustainable building practices.

## Run It Locally

This application is using [Next.js](https://nextjs.org/) for the frontend, [FastAPI](https://fastapi.tiangolo.com/) for the backend, and uses [PostgreSQL](https://www.postgresql.org/) for database management. The PostgreSQL database is containerized using [Docker](https://www.docker.com/).

### Pre-Installation Requirements

Ensure these tools are installed on your machine before proceeding:

- **[Git](https://git-scm.com/):** Required for cloning the repository.
- **[Docker](https://www.docker.com/):** Essential for managing the containerized database.
- **[Node.js](https://nodejs.org/en/):** Required for frontend operation.
- **[Python3](https://www.python.org/downloads/):** Needed to run the backend.
- Obtain a Google Maps API key (if you don't have one, get it [here](https://developers.google.com/maps/documentation/javascript/get-api-key)).

### Initial Setup

**Step 1: Clone the Repository**

Clone this repository to your local machine. You can do this by executing the command below in your terminal, ensuring you're in the desired directory for the project's storage:

```bash
git clone https://github.com/pemmenegger/tinder-for-reuse.git
```

**Step 2: Environment File Creation**

In the cloned project's root directory, create a .env file with the following content:

```
# FOR FRONTEND
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8081
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<YOUR_GOOGLE_MAPS_API_KEY>

# FOR BACKEND
FRONTEND_URL=http://localhost:3000
POSTGRES_CONNECTION_STRING=postgresql://tfr_admin:XsHEhc8TnGjeL0YiMUZIE@127.0.0.1:5432/tfr_db

# FOR LOCAL DEVELOPMENT
BACKEND_PORT=8081
POSTGRES_HOST=tfr_postgres
POSTGRES_USER=tfr_admin
POSTGRES_PASSWORD=XsHEhc8TnGjeL0YiMUZIE
POSTGRES_DB=tfr_db
POSTGRES_PORT=5432
ENV=debug # debug or prod
```

Replace `<YOUR_GOOGLE_MAPS_API_KEY>` with your Google Maps API key.

### Launching the Application

**Step 1: Launch the Database**

Ensure Docker is running. Run the following command in the project's root directory in your terminal:

```bash
sh run_local_db.sh
```

If your database is not already up to date, you will need to run the migration upgrade script. You probably only need to do this once for the very first launch of the application. To do this, open a new terminal and execute the following command in the project's root directory:

```bash
cd ./backend
sh run_local_migration_upgrade.sh
```

You can close the terminal once the migration is complete but keep the database running.

**Step 2: Launch the Backend**

In a new terminal, run the following command in the project's root directory:

```bash
cd ./backend
sh run_local.sh
```

**Step 3: Launch the Frontend**

In a new terminal, run the following command in the project's root directory:

```bash
cd ./frontend
sh run_local.sh
```

The application should now be accessible at [http://localhost:3000](http://localhost:3000).

### Optional: Import Valobat Collectors

If you want to import Valobat collectors, first make sure the application is running. Then, in a new terminal, execute:

```bash
cd ./backend
sh run_crawler.sh
```
