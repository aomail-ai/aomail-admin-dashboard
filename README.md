# Aomail Admin Dashboard
A dashboard to manage users and their subscriptions plans and get overview of the platform.


> A dashboard to manage users and their subscriptions plans and get overview of the platform.
>
> 📧 Support: aomailaipro@gmail.com
  

<div align="center">

[![Discord](https://discord.com/api/guilds/1303091825900257341/widget.png?style=shield)](https://discord.com/invite/JxbPZNDd)
[![License](https://img.shields.io/badge/license-Custom-blue.svg)](LICENSE)

</div>

## ✨ Features
TODO


## 🛠 Self-Hosting Guide

⚠️ **Compatibility Note**: Tested on WSL 2, Docker Desktop, and Debian servers. Other platforms may work but are untested.



### Quick Start

1. **Clone and Install:**
```bash
git clone https://github.com/aomail-ai/aomail-admin-dashboard
cd aomail-admin-dashboard
npm install
npm run dev -- --host 0.0.0.0 --port 8085
```
Create a superuser to access the dashboard
```bash
docker exec -it aomail_project-backend_dev-1 python manage.py createsuperuser
```

Access at [http://localhost:8085/](http://localhost:8085/)








## Launch in Production

```bash
./build.sh
```

## Run in development

Stop the container aomail-admin-dashboard-container
```bash
npm install
npm run dev
```

 