
LCSC Scheduler

Internal scheduler tool for the Langara Computer Science Club. 

## Run Locally

Clone the project

```bash
  git clone https://github.com/LMSAIH/LCSCScheduler
```

Go to the project directory

```bash
  backend terminal 
  cd backend

  frontend terminal 
  cd frontend
```

Install dependencies

```bash
  frontend terminal
  npm install
```

Start the server

```bash
  backend terminal
  docker-compose up --build

  frontend terminal
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SUPABASE_URL`

`SUPABASE_KEY`

`REDIS_HOST`

`REDIS_PORT`

`FRONTEND_URL`

`ADMIN_PASSWORD`
