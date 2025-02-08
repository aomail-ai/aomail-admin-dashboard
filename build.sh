export FRONTEND_PORT=8085
export VITE_BACKEND_SUBDOMAIN_ENV="app"

docker build \
    --build-arg VITE_BACKEND_SUBDOMAIN_ENV=$VITE_BACKEND_SUBDOMAIN_ENV \
    -t aomail-admin-dashboard .

docker stop aomail-admin-dashboard-container || true
docker rm aomail-admin-dashboard-container || true

docker run -d \
    -p $FRONTEND_PORT:4173 \
    --env VITE_BACKEND_SUBDOMAIN_ENV=$VITE_BACKEND_SUBDOMAIN_ENV \
    --name aomail-admin-dashboard-container \
    aomail-admin-dashboard
