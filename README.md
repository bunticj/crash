# Crash

### Project Overview

The **Crash** project is developed using a containerized-modular approach. This architecture leverages Docker containers to encapsulate key components, providing portability and isolation. The system comprises an SQL database and two Node.js apps written in TypeScript:

1. **MariaDB Container**:
   - Responsible for data storage and retrieval. Initialize database using 'DbCreate.sql' script in init directory.

2. **API Server**:
   - Manages HTTP interactions, acting as the interface between clients and the database.

3. **Game Server**:
   - Manages real-time communication with clients using Socket.IO and handles bet and game logic.

Each component follows an object-oriented and layered approach, promoting maintainability and scalability.

### Orchestration

The project is orchestrated using Docker Compose, allowing for seamless management of the containers. The `compose.yml` file defines the configuration and relationships between the containers, simplifying deployment and ensuring consistent behavior across different environments.

### Project Setup
To start the project, Docker and Docker Compose are required, and .env files in directories.
Run the following command:

```
docker compose up
```


Api docs [click here](api-server/README.md).
Socket event docs [click here](game-server/README.md).