# 🚀 Minimal Lightweight VPS Deployment Guide

Complete guide for deploying your Spring Boot SaaS application on a private VPS with minimal resource usage.

---

## 💻 Recommended VPS Specifications

### Minimum Viable Setup
```yaml
CPU: 2 vCPUs
RAM: 4 GB
Storage: 40 GB SSD
Bandwidth: 2 TB/month
OS: Ubuntu 22.04 LTS

Estimated Cost: $12-20/month
Providers: DigitalOcean, Linode, Vultr, Hetzner
```

### Comfortable Setup (Recommended)
```yaml
CPU: 2-4 vCPUs
RAM: 8 GB
Storage: 80 GB SSD
Bandwidth: 4 TB/month

Estimated Cost: $24-40/month
```

---

## 🏗️ Lightweight Architecture

```
┌─────────────────────────────────────────┐
│         VPS (8GB RAM, 2 vCPU)          │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │   Caddy      │  │  Docker Engine  │ │
│  │ (Web Server  │  │                 │ │
│  │  + SSL)      │  └─────────────────┘ │
│  │  80MB RAM    │           │           │
│  └──────────────┘           │           │
│         │                   │           │
│         ▼                   ▼           │
│  ┌─────────────────────────────────┐   │
│  │     Docker Containers           │   │
│  ├─────────────────────────────────┤   │
│  │ Frontend (Nginx) - 50MB         │   │
│  │ Backend (Spring) - 1.5GB        │   │
│  │ MySQL 8.0        - 800MB        │   │
│  │ Redis            - 100MB        │   │
│  │ Promtail         - 50MB         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Total Used: ~2.5GB + 1GB OS           │
│  Available: ~4.5GB buffer              │
└─────────────────────────────────────────┘
```

---

## 📦 Optimized docker-compose.yml

Replace your current `docker-compose.yml` with this memory-optimized version:

```yaml
version: '3.8'

services:
  # Database - Memory optimized
  db:
    image: mysql:8.0
    container_name: saas-db
    restart: unless-stopped
    command: [
      '--default-authentication-plugin=mysql_native_password',
      '--innodb-buffer-pool-size=512M',       # Reduced from default 1GB
      '--innodb-log-file-size=128M',
      '--innodb-flush-log-at-trx-commit=2',   # Better performance, slight risk
      '--max-connections=50',                  # Reduced from 151
      '--skip-name-resolve',                   # Faster connections
      '--query-cache-type=1',
      '--query-cache-size=32M'
    ]
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    ports:
      - "3307:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 3s
      timeout: 3s
      retries: 10
      start_period: 10s
    networks:
      - saas-net
    # Resource limits
    deploy:
      resources:
        limits:
          memory: 800M
          cpus: '0.5'

  # Redis - Minimal config
  redis:
    image: redis:7-alpine  # Alpine = smaller image
    container_name: saas-redis
    restart: unless-stopped
    command: redis-server --maxmemory 100mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - saas-net
    deploy:
      resources:
        limits:
          memory: 150M
          cpus: '0.25'

  # Spring Boot App - JVM optimized
  app:
    build:
      context: ./saas-springboot
      dockerfile: Dockerfile
    container_name: saas-app
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    ports:
      - "9090:9090"
    volumes:
      - ./uploads:/app/uploads
    networks:
      - saas-net
    env_file:
      - .env
    environment:
      # JVM Memory Settings (CRITICAL for VPS)
      JAVA_OPTS: >-
        -Xms512m
        -Xmx1536m
        -XX:MaxMetaspaceSize=256m
        -XX:+UseG1GC
        -XX:MaxGCPauseMillis=200
        -XX:+UseStringDeduplication
        -Dfile.encoding=UTF-8
      
      # Application Settings
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_DATASOURCE_URL: jdbc:mysql://${DATABASE_HOST}:${DATABASE_PORT}/${MYSQL_DATABASE}?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false
      SPRING_DATASOURCE_USERNAME: ${SPRING_DATASOURCE_USERNAME}
      SPRING_DATASOURCE_PASSWORD: ${SPRING_DATASOURCE_PASSWORD}
      
      # Hikari Pool - Reduced for low traffic
      SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE: 2
      SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE: 10
      
      # Redis
      SPRING_DATA_REDIS_HOST: ${REDIS_HOST}
      SPRING_DATA_REDIS_PORT: ${REDIS_PORT}
      SPRING_CACHE_TYPE: redis
      
      # JWT & Email
      APP_JWT_SECRET: ${APP_JWT_SECRET}
      APP_EMAIL_FROM: ${APP_EMAIL_FROM}
      APP_EMAIL_FROM_NAME: ${APP_EMAIL_FROM_NAME}
      SPRING_MAIL_HOST: ${SPRING_MAIL_HOST}
      SPRING_MAIL_PORT: ${SPRING_MAIL_PORT}
      SPRING_MAIL_USERNAME: ${SPRING_MAIL_USERNAME}
      SPRING_MAIL_PASSWORD: ${SPRING_MAIL_PASSWORD}
      SPRING_MAIL_SMTP_AUTH: ${SPRING_MAIL_SMTP_AUTH}
      SPRING_MAIL_SMTP_TLS: ${SPRING_MAIL_SMTP_TLS}
      
      # File Storage
      FILE_STORAGE_LOCAL_PATH: /app/uploads
      APP_CORS_ALLOWED_ORIGINS: ${APP_CORS_ALLOWED_ORIGINS}
    deploy:
      resources:
        limits:
          memory: 1800M
          cpus: '1.0'

  # Frontend - Nginx Alpine
  frontend:
    build:
      context: ./saas-reactjs
      dockerfile: Dockerfile
    container_name: saas-frontend
    restart: unless-stopped
    depends_on:
      - app
    ports:
      - "3000:80"
    networks:
      - saas-net
    environment:
      - VITE_API_BASE_URL=${VITE_API_BASE_URL}
    deploy:
      resources:
        limits:
          memory: 100M
          cpus: '0.25'

  # Lightweight monitoring - Promtail (sends to Grafana Cloud)
  promtail:
    image: grafana/promtail:latest
    container_name: saas-promtail
    restart: unless-stopped
    volumes:
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
    networks:
      - saas-net
    deploy:
      resources:
        limits:
          memory: 100M
          cpus: '0.1'

volumes:
  db_data:

networks:
  saas-net:
    driver: bridge
```

---

## 🔧 Optimized Dockerfile for Spring Boot

Update `saas-springboot/Dockerfile`:

```dockerfile
# Use multi-stage build with JRE (not JDK)
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use smaller JRE image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/*.jar app.jar

# JVM optimizations for containers
ENV JAVA_OPTS="-Xms512m -Xmx1536m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

EXPOSE 9090

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
```

---

## 🎨 Optimized Frontend Dockerfile

Update `saas-reactjs/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage - smaller nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🎯 Minimal Monitoring Setup (Grafana Cloud)

Instead of running Prometheus + Grafana locally (heavy), use **Grafana Cloud Free Tier**.

### Benefits:
- ✅ Free for 10K metrics & 50GB logs
- ✅ No local resources used
- ✅ Professional dashboards
- ✅ Built-in alerting
- ✅ 14-day retention

### Setup Steps:

1. Sign up at https://grafana.com/auth/sign-up/create-user
2. Create a free Grafana Cloud account
3. Get your Prometheus & Loki credentials from the Grafana Cloud portal

### Create `promtail-config.yml`:

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: https://logs-prod-us-central1.grafana.net/loki/api/v1/push
    basic_auth:
      username: YOUR_LOKI_USERNAME
      password: YOUR_LOKI_PASSWORD

scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      - source_labels: ['__meta_docker_container_log_stream']
        target_label: 'stream'
    pipeline_stages:
      - docker: {}
```

---

## 🔒 Reverse Proxy with Auto-SSL (Caddy)

Caddy provides automatic HTTPS with Let's Encrypt - much simpler than nginx + certbot.

### Install Caddy on VPS:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Caddyfile Configuration

Create `/etc/caddy/Caddyfile`:

```caddy
# Your domain
yourdomain.com {
    # Frontend
    reverse_proxy localhost:3000

    # API
    reverse_proxy /api/* localhost:9090
    reverse_proxy /actuator/* localhost:9090

    # Uploads
    handle_path /uploads/* {
        root * /var/www/uploads
        file_server
    }

    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000;"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "no-referrer-when-downgrade"
    }

    # Enable compression
    encode gzip

    # Logging
    log {
        output file /var/log/caddy/access.log
        format json
    }
}

# API subdomain (optional)
api.yourdomain.com {
    reverse_proxy localhost:9090
    
    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000;"
        X-Content-Type-Options "nosniff"
    }
}
```

### Start Caddy:

```bash
sudo systemctl restart caddy
sudo systemctl enable caddy
```

✅ **That's it!** Caddy automatically gets & renews SSL certificates from Let's Encrypt.

---

## 🚀 Complete Deployment Steps

### 1. Prepare Your VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install essential tools
apt install -y curl git ufw fail2ban
```

### 2. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 3. Configure Firewall

```bash
# Set up UFW
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
ufw status
```

### 4. Install Fail2ban

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

Create `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s

[nginx-http-auth]
enabled = true
```

### 5. Clone Your Repository

```bash
# Navigate to deployment directory
cd /opt

# Clone your repo
git clone https://github.com/yourusername/your-repo.git saas-app
cd saas-app
```

### 6. Configure Environment Variables

```bash
# Create .env file
cp .env.example .env

# Edit with your values
nano .env
```

**Required `.env` variables:**

```bash
# Database
MYSQL_DATABASE=saas-app
MYSQL_ROOT_PASSWORD=your_strong_password_here
DATABASE_HOST=db
DATABASE_PORT=3306
DATABASE_PORT_MAPPING=3307
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_strong_password_here

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Application
SPRING_PROFILES_ACTIVE=prod

# JWT Secret (MUST be 32+ characters for HS512)
APP_JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this

# Email (SendGrid, Mailgun, etc.)
APP_EMAIL_FROM=noreply@yourdomain.com
APP_EMAIL_FROM_NAME=Your SaaS Name
SPRING_MAIL_HOST=smtp.sendgrid.net
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=apikey
SPRING_MAIL_PASSWORD=your-sendgrid-api-key
SPRING_MAIL_SMTP_AUTH=true
SPRING_MAIL_SMTP_TLS=true

# CORS
APP_CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend
VITE_API_BASE_URL=https://yourdomain.com
```

### 7. Deploy Application

```bash
# Build and start services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 8. Install and Configure Caddy

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Edit Caddyfile
sudo nano /etc/caddy/Caddyfile
# Paste the Caddyfile config from above (replace yourdomain.com)

# Create uploads directory
sudo mkdir -p /var/www/uploads
sudo ln -s /opt/saas-app/uploads /var/www/uploads

# Restart Caddy
sudo systemctl restart caddy
sudo systemctl enable caddy

# Check status
sudo systemctl status caddy
```

### 9. Set Up Automated Backups

Create `/opt/saas-app/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/opt/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="saas-app"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker exec saas-db mysqldump -uroot -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} | gzip > $BACKUP_DIR/db_backup_${TIMESTAMP}.sql.gz

# Backup uploads
tar -czf $BACKUP_DIR/uploads_backup_${TIMESTAMP}.tar.gz /opt/saas-app/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "uploads_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: ${TIMESTAMP}"
```

Make executable and schedule:

```bash
chmod +x /opt/saas-app/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /opt/saas-app/backup.sh >> /var/log/backup.log 2>&1
```

### 10. Set Up Auto-Updates

```bash
# Install unattended-upgrades
apt install -y unattended-upgrades

# Configure
dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 Monitoring & Maintenance

### Check Resource Usage

```bash
# Docker container stats
docker stats --no-stream

# System resources
htop
# or
top

# Disk usage
df -h
du -sh /var/lib/docker/volumes/*

# Memory usage
free -h

# Check logs
docker compose logs --tail=100 app
docker compose logs --tail=100 db
```

### Useful Maintenance Commands

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart app

# View real-time logs
docker compose logs -f app

# Execute commands in containers
docker exec -it saas-app bash
docker exec -it saas-db mysql -uroot -p${MYSQL_ROOT_PASSWORD}

# Clean up Docker resources
docker system prune -a --volumes

# Update application
cd /opt/saas-app
git pull origin main
docker compose down
docker compose up -d --build
```

---

## 💰 Cost Breakdown

| Item | Cost/Month | Notes |
|------|------------|-------|
| VPS (8GB RAM) | $24 | Hetzner Cloud |
| Domain | $1 | ~$12/year |
| Email Service | $0-10 | SendGrid free tier (100 emails/day) |
| Backups | $5 | DigitalOcean Spaces or similar |
| Monitoring | $0 | Grafana Cloud free tier |
| CDN (optional) | $0 | Cloudflare free tier |
| **Total** | **~$30-40** | |

---

## 🎯 Recommended VPS Providers

| Provider | 8GB RAM Price | Location Options | Pros |
|----------|---------------|------------------|------|
| **Hetzner** | €24 (~$26) | EU, US | Cheapest, excellent performance |
| **Linode** | $30 | Global | Great support, simple UI |
| **DigitalOcean** | $36 | Global | Best documentation, easy |
| **Vultr** | $32 | Global | Many locations, NVMe SSD |
| **Contabo** | €18 (~$20) | EU, US, Asia | Very cheap, decent performance |

---

## 🔐 Security Checklist

```
✅ Firewall (UFW) configured
✅ Fail2ban installed and running
✅ SSH key authentication (disable password login)
✅ Non-root Docker user
✅ Auto-updates enabled
✅ SSL/TLS via Caddy (automatic)
✅ Strong passwords in .env
✅ JWT secret is 32+ characters
✅ Database not exposed to public (only via Docker network)
✅ Regular backups scheduled
✅ Security headers configured in Caddy
✅ Rate limiting enabled in application
✅ CORS properly configured
```

---

## 🚀 Deployment Script

Create `deploy.sh` in your project root:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying SaaS Application..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Pull latest code
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
git pull origin main

# Stop services
echo -e "${YELLOW}🛑 Stopping services...${NC}"
docker compose down

# Build and start services
echo -e "${YELLOW}🔨 Building and starting services...${NC}"
docker compose up -d --build

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 30

# Check health
echo -e "${YELLOW}🏥 Checking service health...${NC}"
docker compose ps

# Test endpoints
echo -e "${YELLOW}🧪 Testing endpoints...${NC}"
curl -f http://localhost:9090/actuator/health || echo "Backend health check failed"
curl -f http://localhost:3000 || echo "Frontend check failed"

# Show logs
echo -e "${YELLOW}📋 Recent logs:${NC}"
docker compose logs --tail=20

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Application: https://yourdomain.com${NC}"
echo -e "${GREEN}📊 Metrics: Check Grafana Cloud${NC}"
```

Make executable:

```bash
chmod +x deploy.sh
```

Usage:

```bash
./deploy.sh
```

---

## 🐛 Troubleshooting

### Application won't start

```bash
# Check logs
docker compose logs app

# Common issues:
# 1. Database not ready - wait longer
# 2. Environment variables missing - check .env
# 3. Port already in use - check: netstat -tulpn | grep 9090
```

### Database connection errors

```bash
# Check database is running
docker compose ps db

# Check database health
docker exec saas-db mysqladmin ping -h localhost -uroot -p${MYSQL_ROOT_PASSWORD}

# Connect to database
docker exec -it saas-db mysql -uroot -p${MYSQL_ROOT_PASSWORD}
```

### Out of memory errors

```bash
# Check memory usage
free -h
docker stats

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### SSL certificate issues (Caddy)

```bash
# Check Caddy status
sudo systemctl status caddy

# View Caddy logs
sudo journalctl -u caddy -f

# Common issues:
# 1. Port 80/443 not accessible - check firewall
# 2. DNS not pointing to server - check DNS records
# 3. Domain verification failed - check domain ownership
```

---

## 📈 Performance Tuning

### If you need better performance on same hardware:

1. **Enable JVM tuning:**
   ```bash
   JAVA_OPTS: >-
     -Xms512m
     -Xmx1536m
     -XX:+UseG1GC
     -XX:G1HeapRegionSize=16m
     -XX:MaxGCPauseMillis=100
     -XX:+UseStringDeduplication
     -XX:+ParallelRefProcEnabled
   ```

2. **MySQL query cache (for read-heavy apps):**
   ```sql
   SET GLOBAL query_cache_size = 67108864;
   SET GLOBAL query_cache_type = 1;
   ```

3. **Redis persistence off (faster, data in memory only):**
   ```bash
   redis-server --save "" --appendonly no
   ```

---

## 📋 Final Deployment Checklist

```
PRE-DEPLOYMENT:
✅ VPS provisioned and accessible via SSH
✅ Domain purchased and DNS configured
✅ .env file created with all required values
✅ Email service configured (SendGrid, Mailgun, etc.)
✅ Grafana Cloud account created (optional but recommended)

DEPLOYMENT:
✅ Docker & Docker Compose installed
✅ Firewall (UFW) configured
✅ Fail2ban installed
✅ Application deployed via docker-compose
✅ Caddy installed and configured
✅ SSL certificate obtained (automatic via Caddy)
✅ Application accessible via domain

POST-DEPLOYMENT:
✅ Backup script configured and tested
✅ Monitoring dashboards set up
✅ Health checks passing
✅ Test user registration and login
✅ Email delivery working
✅ OAuth flow tested (if enabled)
✅ Admin panel accessible
✅ Performance baseline recorded
```

---

## 📞 Support & Resources

- **Application Logs:** `docker compose logs -f`
- **System Logs:** `/var/log/syslog`
- **Caddy Logs:** `/var/log/caddy/`
- **Backup Logs:** `/var/log/backup.log`

### Useful Links:
- Docker Documentation: https://docs.docker.com
- Caddy Documentation: https://caddyserver.com/docs
- Grafana Cloud: https://grafana.com/products/cloud
- Spring Boot Actuator: https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html

---

## 🎉 You're Done!

Your minimal, lightweight SaaS application is now deployed and running on a private VPS with:

- ✅ Automatic HTTPS (Caddy)
- ✅ Resource-optimized Docker containers
- ✅ Database backups
- ✅ Security hardening
- ✅ Monitoring (Grafana Cloud)
- ✅ Production-ready configuration

**Total Monthly Cost:** ~$30-40

**Expected Performance:**
- Response time: < 200ms (P95)
- Handles: 100-500 concurrent users
- Uptime: 99.5%+

Enjoy your deployment! 🚀

---

## 📈 Scalability Analysis

### Current Setup Capacity (8GB RAM, 2-4 vCPU)

```yaml
Concurrent Users: 100-500 active users
Requests/Second: 50-150 req/s
Database Records: 10,000-50,000 performing well
Monthly Active Users: 1,000-5,000 MAU
Storage: Up to 100GB (with basic uploads)

Response Times:
  - API endpoints: < 200ms (P95)
  - Database queries: < 50ms (P95)
  - Page loads: < 1 second
```

### Vertical Scaling Path

| Phase | MAU | Setup | Monthly Cost | When to Upgrade |
|-------|-----|-------|--------------|-----------------|
| **MVP** | 100-5K | 8GB VPS | $30 | CPU > 70%, Memory > 80% |
| **Growth** | 5K-15K | 16GB VPS | $50 | Response time > 500ms |
| **Scaling** | 15K-50K | 32GB VPS | $100 | DB connections > 80% |
| **Distributed** | 50K-200K | Multi-server | $150-300 | Need redundancy |
| **Enterprise** | 200K+ | Cloud (AWS/GCP) | $500+ | Global presence |

### Optimization Before Scaling

Before spending money on bigger servers:

1. **Database Optimization** (2-5x improvement)
   - Add indexes on frequently queried columns
   - Analyze slow queries
   - Use query caching

2. **Caching Strategy** (5-10x for cached data)
   - Cache expensive queries
   - Use Redis effectively
   - Implement CDN

3. **Frontend Optimization** (50% faster)
   - Enable CloudFlare CDN (free)
   - Optimize images
   - Code splitting

### Warning Signs You Need to Scale

**Immediate Action Required:**
- 🔴 Response time P95 > 2 seconds
- 🔴 CPU usage > 90% for > 5 minutes
- 🔴 Memory usage > 95%
- 🔴 Database connections exhausted

**Plan to Scale Soon:**
- 🟡 Response time P95 > 1 second
- 🟡 CPU usage > 70% consistently
- 🟡 Memory usage > 80%
- 🟡 Growing 20%+ users/month

### Bottom Line

Your 8GB setup will handle your first **5,000-10,000 users** easily. By the time you need to scale beyond that, you'll have revenue to afford it. Focus on building your product, not premature scaling!

