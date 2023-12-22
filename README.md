# Tinder For Reuse: A Circular Economy Application

Tinder For Reuse is an innovative application designed to facilitate a sustainable circular economy by connecting owners of reclaimed building elements with collectors and contractors skilled in deconstruction. Our mission is to substantially reduce waste from building construction and demolition, promoting the reuse of reclaimed materials. The application streamlines this process through the following workflow:

1. Building owners list reclaimed elements on the app.
2. Collectors browse these listings, engage with owners, and arrange for the purchase and collection of deconstructed materials.
3. Owners connect with contractors through the app to deconstruct these elements efficiently and safely.

## Features

The application primarily revolves around three entities: reclaimed building elements, collectors, and contractors. It offers functionalities for uploading, searching, and browsing these entities.

### Reclaimed Building Elements (Items)

**Search and Filter:** Users can explore items using criteria like worksheets, units, material type, health status, reuse potential, waste codes, and recycling potential. Those filter criteria are based on the French diagnostic method for building deconstruction.

![items search](./screenshots/items-search.png)

**Upload:** Uploading items is straightforward through an Excel file format according to a predefined template. This template is based on the French diagnostic method for building deconstruction. The application parses the file and creates items based on the data.

![items upload](./screenshots/items-upload-2.png)

### Collectors

**Search and Filter:** Locate collectors by their material preferences, waste codes, authorized vehicles, and circular strategies.

![collectors search](./screenshots/collectors-search.png)

**Upload:** Collectors can register their details via an upload form.

![collectors upload](./screenshots/collectors-upload.png)

### Contractors

**Search and Filter:** Find contractors by their specialization in materials, waste codes, and circular services.

![contractors search](./screenshots/contractors-search.png)

**Upload:** Contractors can easily join the platform through an upload form.

![contractors upload](./screenshots/contractors-upload.png)

### Matches

**Interactive Mapping:** The match feature allows users to find synergies between items, collectors, and contractors. The map visually represents all entities, refining to show only matched entities based on filter criteria. Users can click on map markers for detailed information.

![matches search](./screenshots/matches-search.png)

All supported filter criteria are defined in the [types.py file](./backend/app/types.py).

## Run It Locally

This application is structured with [Next.js](https://nextjs.org/) for the frontend, [FastAPI](https://fastapi.tiangolo.com/) for the backend, and uses [PostgreSQL](https://www.postgresql.org/) for database management. The PostgreSQL database is containerized using [Docker](https://www.docker.com/).

### Pre-Installation Requirements

Ensure these tools are installed on your machine:

- **[Git](https://git-scm.com/):** Required for cloning the repository.
- **[Docker](https://www.docker.com/):** Essential for managing the containerized database.
- **[Node.js](https://nodejs.org/en/):** Required for frontend operation.
- **[Python](https://www.python.org/):** Needed to run the backend.
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

### Launching the Application

**Step 1: Launch the Database**

Ensure Docker is running. Run the following command in the project's root directory in your terminal:

```bash
sh run_local_db.sh
```

If your database is not already up to date, you will need to run the migration upgrade script. To do this, open a new terminal and execute the following command in the project's root directory:

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

The application should now be accessible at http://localhost:3000.

### Optional: Import Valobat Collectors

If you want to import Valobat collectors, first make sure the application is running. Then, in a new terminal, execute:

```bash
cd ./backend
sh run_crawler.sh
```
