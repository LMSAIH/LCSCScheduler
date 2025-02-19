# LCSC Scheduler backend

This is a FastAPI backend for the LCSC Scheduler, running with Docker and Redis.

## Prerequisites
Make sure you have the following installed on your system:
- Python
- Docker

## How to Run

1. **Clone the repository**:
   ```
   git clone https://github.com/LMSAIH/LCSCScheduler.git
   cd LCSCScheduler/backend
   ```

2. **Create a .env file**
- Follow the structure provided in the `.env.sample` file

3. **Start the application using Docker Compose**
    ```
    docker-compose up --build
    ```

4. **Access the API**
- The API will be available at: `http://localhost:8000`