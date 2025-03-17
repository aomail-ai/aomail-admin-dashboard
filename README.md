# 📊 Aomail Admin Dashboard

> An administrative dashboard for managing Aomail users, subscriptions, and platform analytics. Used for  your [Aomail deployment](https://github.com/aomail-ai/aomail-app).
>
> 📧 Support: aomailaipro@gmail.com
  

<div align="center">

[![Discord](https://discord.com/api/guilds/1303091825900257341/widget.png?style=shield)](https://discord.com/invite/XHTcEDbvh9)

</div>

## ✨ Features

- **👥 User Management**: Search, update plans, and manage user access
- **📊 Platform Analytics**: Monitor usage, costs, and growth metrics
- **👮 Admin Controls**: Manage admin accounts and access levels

## 🛠 Self-Hosting Guide

⚠️ **Compatibility Note**: Tested on WSL 2, Docker Desktop, and Debian servers. Other platforms may work but are untested.

### Quick Start

1. **Clone and Install:**
```bash
git clone https://github.com/aomail-ai/aomail-admin-dashboard
cd aomail-admin-dashboard
npm install
npm run dev
```

2. **Create Admin User:**
```bash
docker exec -it aomail_project-backend_dev-1 python manage.py createsuperuser
```

Access the dashboard at [http://localhost:8085/](http://localhost:8085/)

## 🚀 Production Deployment

1. Update environment configuration if needed:
```bash
VITE_BACKEND_SUBDOMAIN_ENV=your-subdomain
```

2. Build and deploy:
```bash
./build.sh
```

## 🔧 Frequently Asked Questions

### How do I grant unlimited access to a user?
1. Navigate to "Update User Info"
2. Search for the target user
3. Update their plan to "Premium"
4. Save changes

### How do I manage multiple email links?
The Premium plan automatically enables multiple email account linking. Grant Premium access through the user management interface.
