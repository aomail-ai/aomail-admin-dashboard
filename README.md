# Aomail Admin Dashboard

## Tech Stack

- Frontend: Svelte
- Containerization: Docker
- Web Server: Nginx

## Launch in Production

```bash
./build.sh
```

## Run in development

Stop the container aomail-admin-dashboard-container
```bash
npm install
npm run dev -- --host 0.0.0.0 --port 8085
```
