export FRONTEND_PORT=8085  
export BACKEND_SUBDOMAIN_ENV="app"

docker build -t aomail-admin-dashboard .

docker stop aomail-admin-dashboard-container || true
docker rm aomail-admin-dashboard-container || true

docker run -d \
    -p $FRONTEND_PORT:$FRONTEND_PORT \
    --env BACKEND_SUBDOMAIN_ENV=$BACKEND_SUBDOMAIN_ENV \
    --name aomail-admin-dashboard-container \
    aomail-admin-dashboard
