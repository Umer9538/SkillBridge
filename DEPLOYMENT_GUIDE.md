# 🚢 SkillBridge - Deployment Guide

Complete guide for deploying SkillBridge to production environments.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Popular Hosting Options](#popular-hosting-options)
7. [Security Considerations](#security-considerations)
8. [Post-Deployment Tasks](#post-deployment-tasks)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All features tested in development
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificate obtained
- [ ] Domain name configured
- [ ] Email service configured
- [ ] Admin account created
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Backup strategy in place

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create `backend/.env` for production:

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=<strong-random-secret-key-here>
DEBUG=False

# Database - Use PostgreSQL for production
DATABASE_URL=postgresql://username:password@localhost:5432/skillbridge

# JWT Configuration
JWT_SECRET_KEY=<strong-jwt-secret-key-here>
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=<your-app-password>
MAIL_DEFAULT_SENDER=noreply@yourdomain.com

# File Upload
MAX_CONTENT_LENGTH=10485760
UPLOAD_FOLDER=/var/www/skillbridge/uploads

# Security
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Lax
```

### Frontend Environment Variables

Create `frontend/.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=SkillBridge
VITE_APP_VERSION=1.0.0
```

### Generating Secret Keys

```python
# Generate SECRET_KEY and JWT_SECRET_KEY
import secrets
print(secrets.token_urlsafe(32))
```

---

## 🗄️ Database Setup

### Option 1: PostgreSQL (Recommended)

#### Install PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
```

#### Create Database:
```bash
sudo -u postgres psql

CREATE DATABASE skillbridge;
CREATE USER skillbridge_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE skillbridge TO skillbridge_user;
\q
```

#### Update Backend:
```bash
# Install PostgreSQL adapter
pip install psycopg2-binary

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://skillbridge_user:your-secure-password@localhost:5432/skillbridge
```

### Option 2: MySQL

```bash
# Install MySQL
sudo apt install mysql-server

# Create database
sudo mysql

CREATE DATABASE skillbridge;
CREATE USER 'skillbridge_user'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON skillbridge.* TO 'skillbridge_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Install MySQL adapter
pip install pymysql

# Update DATABASE_URL
DATABASE_URL=mysql+pymysql://skillbridge_user:your-secure-password@localhost:3306/skillbridge
```

### Initialize Production Database

```bash
cd backend
source venv/bin/activate
python run.py  # Creates tables

# Create admin user
python -c "
from app import create_app, db
from app.models import User, Admin
from werkzeug.security import generate_password_hash

app = create_app()
with app.app_context():
    admin_user = User(
        email='admin@yourdomain.com',
        password=generate_password_hash('your-secure-admin-password'),
        name='System Admin',
        role='admin',
        is_active=True
    )
    db.session.add(admin_user)
    db.session.flush()

    admin = Admin(user_id=admin_user.id)
    db.session.add(admin)
    db.session.commit()
    print('Admin user created successfully!')
"
```

---

## 🐍 Backend Deployment

### Option 1: Using Gunicorn (Production WSGI Server)

#### Install Gunicorn:
```bash
pip install gunicorn
```

#### Create gunicorn config (`backend/gunicorn_config.py`):
```python
import multiprocessing

bind = "0.0.0.0:5001"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
timeout = 120
keepalive = 5
errorlog = "/var/log/skillbridge/error.log"
accesslog = "/var/log/skillbridge/access.log"
loglevel = "info"
```

#### Run with Gunicorn:
```bash
cd backend
gunicorn -c gunicorn_config.py run:app
```

### Option 2: Using uWSGI

#### Install uWSGI:
```bash
pip install uwsgi
```

#### Create uWSGI config (`backend/uwsgi.ini`):
```ini
[uwsgi]
module = run:app
master = true
processes = 4
socket = /tmp/skillbridge.sock
chmod-socket = 660
vacuum = true
die-on-term = true
```

#### Run with uWSGI:
```bash
uwsgi --ini uwsgi.ini
```

### Create Systemd Service

Create `/etc/systemd/system/skillbridge-backend.service`:

```ini
[Unit]
Description=SkillBridge Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/skillbridge/backend
Environment="PATH=/var/www/skillbridge/backend/venv/bin"
ExecStart=/var/www/skillbridge/backend/venv/bin/gunicorn -c gunicorn_config.py run:app

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable skillbridge-backend
sudo systemctl start skillbridge-backend
sudo systemctl status skillbridge-backend
```

---

## ⚛️ Frontend Deployment

### Build for Production

```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`.

### Option 1: Nginx

#### Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

#### Create Nginx config (`/etc/nginx/sites-available/skillbridge`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    root /var/www/skillbridge/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/skillbridge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Apache

#### Install Apache:
```bash
sudo apt install apache2
```

#### Create Apache config (`/etc/apache2/sites-available/skillbridge.conf`):
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem

    DocumentRoot /var/www/skillbridge/frontend/dist

    <Directory /var/www/skillbridge/frontend/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # React Router support
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Proxy API requests to backend
    ProxyPass /api http://localhost:5001/api
    ProxyPassReverse /api http://localhost:5001/api
</VirtualHost>
```

#### Enable modules and site:
```bash
sudo a2enmod rewrite ssl proxy proxy_http
sudo a2ensite skillbridge
sudo systemctl restart apache2
```

---

## 🌐 Popular Hosting Options

### 1. DigitalOcean Droplet

**Cost**: Starting at $6/month

**Setup**:
1. Create Ubuntu droplet
2. SSH into server
3. Clone repository
4. Follow backend and frontend deployment steps
5. Configure Nginx/Apache
6. Set up SSL with Let's Encrypt

### 2. AWS EC2

**Cost**: Variable (Free tier available)

**Setup**:
1. Launch EC2 instance (Ubuntu)
2. Configure security groups (ports 80, 443, 22)
3. SSH into instance
4. Deploy application
5. Use Route 53 for DNS
6. Set up CloudFront for CDN

### 3. Heroku

**Cost**: Starting at $7/month per dyno

#### Backend (Heroku):
```bash
# Install Heroku CLI
heroku login

# Create app
cd backend
heroku create skillbridge-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=your-secret-key

# Create Procfile
echo "web: gunicorn run:app" > Procfile

# Deploy
git init
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Frontend (Vercel/Netlify):
```bash
# Build frontend
cd frontend
npm run build

# Deploy to Vercel
vercel deploy --prod

# Or deploy to Netlify
netlify deploy --prod
```

### 4. Railway.app

**Cost**: Pay-as-you-go

Easy deployment with Git integration and automatic SSL.

### 5. Render.com

**Cost**: Free tier available

Supports both backend and frontend deployment with automatic SSL.

---

## 🔒 Security Considerations

### 1. SSL Certificate

#### Using Let's Encrypt (Free):
```bash
sudo apt install certbot python3-certbot-nginx

# For Nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For Apache
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 2. Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
sudo ufw status
```

### 3. Security Headers

Add to Nginx config:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 4. Environment Variables

- Never commit `.env` files
- Use strong random keys
- Rotate secrets regularly
- Use environment-specific configs

### 5. Database Security

- Use strong passwords
- Limit database access to localhost
- Regular backups
- Enable SSL for database connections
- Use prepared statements (SQLAlchemy does this)

---

## 📋 Post-Deployment Tasks

### 1. Create Admin Account

```bash
python -c "from app import create_app, db; from app.models import User, Admin; ..."
```

### 2. Test Application

- [ ] Access frontend URL
- [ ] Login functionality
- [ ] API endpoints
- [ ] File uploads
- [ ] Email notifications
- [ ] Database operations
- [ ] SSL certificate

### 3. Set Up Monitoring

- Application performance monitoring (New Relic, Datadog)
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Log aggregation (Papertrail, Loggly)

### 4. Configure Backups

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump skillbridge > /backups/skillbridge_$DATE.sql
find /backups -name "skillbridge_*.sql" -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /usr/local/bin/backup-database.sh
```

### 5. Set Up CDN (Optional)

- CloudFlare (Free)
- AWS CloudFront
- Fastly

---

## 📊 Monitoring & Maintenance

### Application Logs

```bash
# Backend logs
tail -f /var/log/skillbridge/error.log
tail -f /var/log/skillbridge/access.log

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# System logs
journalctl -u skillbridge-backend -f
```

### Health Checks

Create health check endpoint monitoring:
```bash
# Add to crontab
*/5 * * * * curl https://yourdomain.com/api/health || echo "API Down" | mail -s "SkillBridge Alert" admin@yourdomain.com
```

### Database Maintenance

```bash
# PostgreSQL
# Vacuum
sudo -u postgres psql skillbridge -c "VACUUM ANALYZE;"

# Check database size
sudo -u postgres psql skillbridge -c "SELECT pg_size_pretty(pg_database_size('skillbridge'));"
```

### Updates

```bash
# Pull latest code
cd /var/www/skillbridge
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart skillbridge-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

---

## 🚨 Troubleshooting Production Issues

### 502 Bad Gateway

- Check backend service is running: `sudo systemctl status skillbridge-backend`
- Check backend logs for errors
- Verify proxy_pass configuration in Nginx

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check database service is running
- Test connection: `psql -h localhost -U skillbridge_user -d skillbridge`

### High Memory Usage

- Reduce number of Gunicorn workers
- Enable database query optimization
- Add caching layer (Redis)

### Slow Performance

- Enable Gzip compression
- Set up CDN for static assets
- Optimize database queries
- Add database indexing
- Enable frontend code splitting

---

## 📚 Additional Resources

- [Flask Deployment Options](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)

---

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] Production database set up
- [ ] Backend deployed with WSGI server
- [ ] Frontend built and deployed
- [ ] Nginx/Apache configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Admin account created
- [ ] Application tested
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team notified

---

## 🎉 Deployment Complete!

Your SkillBridge platform is now live in production!

**Next Steps**:
- Monitor application performance
- Set up regular backups
- Keep dependencies updated
- Review security regularly

**Need help?** Contact the development team or check the documentation.

**Happy Deploying! 🚀**
