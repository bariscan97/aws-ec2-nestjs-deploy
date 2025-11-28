# Product API

This project is a robust backend service built with **NestJS**, designed to manage products with advanced features like PostgreSQL persistence, Redis caching, and AWS S3 image uploads. It is containerized using Docker for easy deployment.

## 🛠 Tech Stack

-   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
-   **Language**: TypeScript
-   **Database**: PostgreSQL (via TypeORM)
-   **Caching**: Redis
-   **Object Storage**: AWS S3
-   **Containerization**: Docker & Docker Compose
-   **Reverse Proxy**: Nginx

## 🏗 Architecture

The application follows a modular architecture:

-   **ProductModule**: Core logic for product management (CRUD operations).
-   **S3Module**: Handles image uploads to AWS S3.
-   **ConfigModule**: Centralized configuration management using environment variables.
-   **Database**: PostgreSQL is used as the primary data store.
-   **Caching Layer**: Redis is implemented to cache product data for improved performance.

## 🚀 Getting Started

### Prerequisites

-   Docker & Docker Compose
-   Node.js (v20+) & npm (for local development)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aws-ec2-nestjs-deploy
    ```

2.  **Environment Configuration:**
    Copy the example environment file and configure your credentials.
    ```bash
    cp example.env .env
    ```
    Update `.env` with your PostgreSQL, Redis, and AWS S3 credentials.

### Running with Docker (Recommended)

Build and start the services using Docker Compose:

```bash
docker-compose up -d --build
```

This will start:
-   `product-api`: The NestJS application (exposed on port 3000 via Nginx on port 80).
-   `redis`: Redis cache server.
-   `nginx`: Reverse proxy.

### Running Locally

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the application:
    ```bash
    npm run start:dev
    ```

## 📝 Environment Variables

Refer to `example.env` for the complete list of required variables:

-   **Application**: `PORT`
-   **Database**: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
-   **AWS S3**: `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
-   **Redis**: `REDIS_HOST`, `REDIS_PORT`, `REDIS_TTL_SECONDS`

## 📂 Project Structure

```
├── src/
│   ├── config/         # Configuration logic
│   ├── product/        # Product business logic (Controller, Service, Entity)
│   ├── s3/             # AWS S3 integration
│   ├── app.module.ts   # Main application module
│   └── main.ts         # Application entry point
├── docker-compose.yml  # Docker services configuration
├── Dockerfile          # Application container definition
└── nginx.conf          # Nginx configuration
```
