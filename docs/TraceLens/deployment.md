---
sidebar_position: 2
sidebar_label: Deployment
title: Deployment
---

# Deploying TraceLens

The TraceLens containers ship everything you need to collect and inspect telemetry data. This guide explains how to stand up the service with Docker Compose (recommended for local evaluation) and how to run the standalone image when you already have supporting infrastructure.

## Docker Compose Getting Started

The repository includes a ready-to-run `docker-compose.yml` file. It provisions PostgreSQL for persistence, a PlantUML server for diagram rendering, and the TraceLens container itself. Exposed ports let you reach the UI on `http://localhost:5001`, the collector at `http://localhost:4317`, and the PlantUML server on `http://localhost:8080` so you can inspect or troubleshoot diagram rendering if needed.

```yaml title="docker-compose.yml"
version: '3.7'
services:
  postgres:
    image: postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: tracelens
      POSTGRES_USER: tracelens
      POSTGRES_PASSWORD: tracelens

  plantuml-server:
    image: plantuml/plantuml-server:tomcat
    container_name: plantuml-server
    ports:
      - 8080:8080

  trace-lens:
    image: docker.io/rogeralsing/tracelens:latest
    pull_policy: always
    ports:
      - 5001:5001 # Web UI
      - 4317:4317 # OpenTelemetry gRPC collector
    environment:
      - PlantUml__RemoteUrl=
      - ConnectionStrings__DefaultConnection=USER ID=tracelens;PASSWORD=tracelens;HOST=host.docker.internal;PORT=5432;DATABASE=tracelens;POOLING=true;
```

> 💡 The default connection string assumes you are running Docker Desktop on macOS or Windows. Adjust the `HOST` segment when the PostgreSQL container runs on a different host.

Bring everything online with a single command:

```bash
docker compose up
```

Docker Compose will pull the latest TraceLens image, launch PostgreSQL and PlantUML, and wire the containers together. Once the stack is running you can browse to `http://localhost:5001` to verify that the UI is available and start sending telemetry to the collector on port `4317`.

## Standalone container

If you already manage PostgreSQL elsewhere (for example in a cloud database) you can run the TraceLens container on its own. Expose the same UI and collector ports, then pass the appropriate environment variables for the database and, if necessary, a remote PlantUML endpoint.

```bash
# Replace the connection string with your PostgreSQL settings.
docker run -p 5001:5001 -p 4317:4317 \
  --env ConnectionStrings__DefaultConnection="USER ID=tracelens;PASSWORD=tracelens;HOST=host.docker.internal;PORT=5432;DATABASE=tracelens;POOLING=true;" \
  docker.io/rogeralsing/tracelens:latest
```

Add `--env PlantUml__RemoteUrl=<your-plantuml-url>` when you want TraceLens to rely on an existing PlantUML server instead of the public service that the container uses by default.

## Data privacy reminders

TraceLens does not ship your telemetry outside of your environment. All data is stored in the PostgreSQL database you configure, and diagram rendering stays on the PlantUML server you control. When evaluating the beta, review the EULA and privacy posture to make sure they align with your compliance requirements.
