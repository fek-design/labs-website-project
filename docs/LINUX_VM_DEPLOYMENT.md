# 🐧 Zealand Labs — Linux VM Produktionsdeployeringsvejledning (Runbook)

Denne runbook beskriver trin-for-trin opsætningen og idriftsættelsen af **Zealand Labs** på en selvhostet Linux server/virtuel maskine (Ubuntu 22.04 / 24.04 LTS eller Debian 12).

Projektet er bygget efter princippet om **Strict Zero Cloud Dependency** — al data, billeder, PDF-manualer og forretningslogik kører 100% lokalt i skolens eget netværk.

---

## 📋 Oversigt over Arkitektur

```
  [ Internet / Skolenet ]
             │ (HTTPS: 443)
             ▼
      [ Nginx Reverse Proxy ]
             │ (HTTP: 127.0.0.1:3000)
             ▼
    [ Node.js (Next.js Standalone via PM2 / Systemd) ]
             │ (Port 3306 - Kun 127.0.0.1)
             ▼
    [ MariaDB 10.11+ / MySQL 8.0 (TDE Kryptering) ]
             ▲
             │ (Daglig mysqldump cronjob)
      [ /var/backups/zealand-labs/ ]
```

---

## 🛠️ 1. Server Forudsætninger & Pakkeinstallation

Opdater systempakker og installer Node.js 20 LTS, Nginx, MariaDB og hjælpeværktøjer:

```bash
# Opdater server
sudo apt update && sudo apt upgrade -y

# Installer hjælpepakker
sudo apt install -y curl git ufw build-essential nginx

# Installer Node.js 20 LTS (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificer versioner (kræver Node >= 20.0.0)
node -v   # Skal være v20.x.x eller nyere
npm -v

# Installer PM2 globalt til procesovervågning
sudo npm install -g pm2
```

---

## 🗄️ 2. MariaDB Installation & Hardening (Zero-Leakage)

### 2.1 Installer MariaDB Server
```bash
sudo apt install -y mariadb-server
sudo mysql_secure_installation
```
*(Fjern anonyme brugere, deaktiver remote root login, og fjern testdatabasen).*

### 2.2 Sikr Netværksbinding (Kun 127.0.0.1)
Åbn `/etc/mysql/mariadb.conf.d/50-server.cnf` (eller `/etc/mysql/my.cnf`):
```ini
[mysqld]
# Tving databasen til UDELUKKENDE at lytte på lokal loopback
bind-address = 127.0.0.1
port = 3306
```

### 2.3 Aktiver Kryptering af Data i Hvile (TDE / Data-at-Rest Encryption)
MariaDB understøtter Transparent Data Encryption (TDE). Tilføj følgende til `/etc/mysql/mariadb.conf.d/60-encryption.cnf`:

```ini
[mysqld]
# TDE Fil-nøglehåndtering
plugin-load-add = file_key_management
file_key_management_filename = /etc/mysql/encryption/keyfile.key
file_key_management_filekey = FILE:/etc/mysql/encryption/keyfile.pass
innodb_encrypt_tables = FORCE
innodb_encrypt_log = ON
innodb_encryption_threads = 4
```

Opret krypteringsnøgler med restriktive rettigheder:
```bash
sudo mkdir -p /etc/mysql/encryption
# Generer tilfældig AES nøgle
echo "1;$(openssl rand -hex 32)" | sudo tee /etc/mysql/encryption/keyfile.key
# Generer adgangskode til nøglefilen
openssl rand -hex 16 | sudo tee /etc/mysql/encryption/keyfile.pass

sudo chmod 600 /etc/mysql/encryption/*
sudo chown -R mysql:mysql /etc/mysql/encryption
sudo systemctl restart mariadb
```

### 2.4 Opret Dedikeret Database & Bruger
Log ind i MariaDB med `sudo mysql`:
```sql
CREATE DATABASE zealand_labs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Opret app-bruger med begrænset adgang (KUN localhost)
CREATE USER 'zealand_app'@'127.0.0.1' IDENTIFIED BY 'GENERER_ET_STÆRKT_KODEORD_HER';
GRANT ALL PRIVILEGES ON zealand_labs.* TO 'zealand_app'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📁 3. Klon Projekt & Miljøkonfiguration

Klon kildekoden til `/var/www/zealand-labs`:

```bash
sudo mkdir -p /var/www/zealand-labs
sudo chown -R $USER:$USER /var/www/zealand-labs
git clone https://github.com/din-organisation/labs-website-project.git /var/www/zealand-labs
cd /var/www/zealand-labs

# Kopiér miljøfil template
cp .env.example .env
```

### 3.1 Konfigurer `.env`
Åbn `.env` med `nano .env`:

```env
NODE_ENV="production"
PORT=3000

# Forbindelse til den lokale database
DATABASE_URL="mysql://zealand_app:DIT_KODEORD@127.0.0.1:3306/zealand_labs"

# Generer en stærk 64-karakters hex-nøgle: openssl rand -hex 32
SESSION_SECRET="e9b04c8f42a1789c62391039da57d42b9183490bca782167deea98341258fa10"
NEXTAUTH_SECRET="e9b04c8f42a1789c62391039da57d42b9183490bca782167deea98341258fa10"

# Dit produktionsdomæne eller interne IP
NEXTAUTH_URL="https://labs.zealand.dk"
```

> **Sikkerhedsbemærkning:** I produktionsmode (`NODE_ENV="production"`) vil applikationen **nægte at starte**, hvis `SESSION_SECRET` mangler eller er sat til fallback-værdier.

---

## 📦 4. Installation, Migration & Build

Kør installationen:

```bash
# Installer afhængigheder (postinstall kører automatisk 'prisma generate')
npm install

# Udrul databaseskemaet
npx prisma db push

# Opret eller nulstil SuperAdmin brugeren med stærkt kodeord (min. 10 tegn)
npm run setup:admin

# Byg Next.js produktionsbundle
npm run build

# Kør testsuite for at verificere alle sikkerheds- og invariants-tjek
npm test
```

---

## 🚀 5. Processtyring (PM2 eller Systemd)

### Mulighed A: PM2 (Anbefalet til hurtig drift)
```bash
# Start Next.js via PM2
pm2 start npm --name "zealand-labs" -- start

# Konfigurer PM2 til automatisk genstart ved server-reboot
pm2 save
pm2 startup systemd
# Kør den 'sudo env ...' kommando som PM2 udskriver
```

### Mulighed B: Systemd Service Unit
Opret `/etc/systemd/system/zealand-labs.service`:
```ini
[Unit]
Description=Zealand Labs Web Application
After=network.target mariadb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/zealand-labs
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Aktivér servicen:
```bash
sudo systemctl daemon-reload
sudo systemctl enable zealand-labs
sudo systemctl start zealand-labs
```

---

## 🌐 6. Nginx Reverse Proxy & SSL Opsætning

Opret Nginx konfigurationsfilen `/etc/nginx/sites-available/zealand-labs`:

```nginx
server {
    listen 80;
    server_name labs.zealand.dk; # Eller din servers IP/hostname

    # Tillad PDF-uploads op til 25 MB
    client_max_body_size 25M;

    # Sikkerhedsheadere
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    # Statiske filer og uploads caching
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        access_log off;
    }

    # Reverse proxy til Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Real-IP forwarding til in-memory rate limiting
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktivér sitet og test Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/zealand-labs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL-certifikat (Certbot / HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d labs.zealand.dk
```

---

## 🔒 7. Firewall (UFW) Opsætning

Åbn kun for nødvendige porte:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```
*(Bemærk: Port 3306 for MariaDB og port 3000 for Node.js forbliver lukket for omverdenen).*

---

## 💾 8. Automatiseret Daglig Backup (Cronjob)

Opret et automatisk backup script `/usr/local/bin/backup-zealand-labs.sh`:

```bash
#!/bin/bash
set -e

BACKUP_DIR="/var/backups/zealand-labs"
DATE=$(date +%Y-%m-%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# 1. Sikkerhedskopiér MariaDB database
mysqldump -u zealand_app -p'DIT_KODEORD' -h 127.0.0.1 zealand_labs | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# 2. Sikkerhedskopiér uploadede PDF-manualer og billeder
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C /var/www/zealand-labs/public uploads data

# 3. Slet backups ældre end 14 dage (rotation)
find "$BACKUP_DIR" -type f -mtime +14 -delete

echo "[$DATE] Backup fuldført med succes." >> /var/log/zealand-backup.log
```

Gør scriptet eksekverbart:
```bash
sudo chmod +x /usr/local/bin/backup-zealand-labs.sh
```

Tilføj til crontab for automatisk kørsel hver nat kl. 02:00:
```bash
# Åbn crontab
sudo crontab -e

# Tilføj linje:
0 2 * * * /usr/local/bin/backup-zealand-labs.sh
```

---

## 🔄 9. Opdateringsrutine ved Nye Versioner (Deploy Updates)

Når der pushes nye ændringer til Git, opdateres serveren med denne hurtige sekvens:

```bash
cd /var/www/zealand-labs
git pull origin main
npm install
npx prisma db push
npm run build
pm2 reload zealand-labs # Eller: sudo systemctl restart zealand-labs
```

Alt er nu klar til stabil, selvkørende produktion! 🛡️
