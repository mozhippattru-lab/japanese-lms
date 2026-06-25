#!/bin/bash
# ============================================================
# Mozhippattru Japanese LMS — Contabo Server Setup
# Run as root on a fresh Ubuntu 22.04 server
# ============================================================

set -e

DOMAIN="mozhippattru.org"
REPO_URL="https://github.com/mozhippattru-lab/japanese-lms.git"
APP_DIR="/var/www/japanese-lms"

echo ""
echo "============================================"
echo "  Mozhippattru LMS — Server Setup"
echo "============================================"
echo ""

# ── 1. System update ──────────────────────────────────────
echo "[1/9] Updating system..."
apt-get update -qq
apt-get upgrade -y -qq

# ── 2. Node.js 20 ─────────────────────────────────────────
echo "[2/9] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt-get install -y nodejs > /dev/null 2>&1
echo "      Node $(node -v) installed."

# ── 3. Tools ──────────────────────────────────────────────
echo "[3/9] Installing PM2, Nginx, Certbot, Git..."
npm install -g pm2 > /dev/null 2>&1
apt-get install -y nginx certbot python3-certbot-nginx git > /dev/null 2>&1

# ── 4. Clone repo ─────────────────────────────────────────
echo "[4/9] Cloning repository..."
echo ""
echo "  Is your GitHub repo PRIVATE? (y/n)"
read -p "  > " IS_PRIVATE

if [ "$IS_PRIVATE" = "y" ] || [ "$IS_PRIVATE" = "Y" ]; then
  echo ""
  echo "  Enter your GitHub Personal Access Token"
  echo "  (Create at: github.com → Settings → Developer settings → Personal access tokens)"
  read -p "  Token: " GH_TOKEN
  CLONE_URL="https://${GH_TOKEN}@github.com/mozhippattru-lab/japanese-lms.git"
else
  CLONE_URL="$REPO_URL"
fi

[ -d "$APP_DIR" ] && rm -rf "$APP_DIR"
git clone "$CLONE_URL" "$APP_DIR"
echo "      Cloned to $APP_DIR"

# ── 5. Environment variables ──────────────────────────────
echo ""
echo "[5/9] Setting up environment variables..."
echo ""
echo "  Enter your Supabase Service Role Key"
echo "  (Supabase dashboard → Project Settings → API → service_role key)"
read -p "  Service Role Key: " SERVICE_KEY

cat > "$APP_DIR/.env.local" << EOF
NEXT_PUBLIC_SUPABASE_URL=https://dersmankgmytcftifuwm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcnNtYW5rZ215dGNmdGlmdXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMTU1ODMsImV4cCI6MjA5NzU5MTU4M30.DeMT2ZSzu8n3-tqA0VTr574PSuDe0HDH5-SvEvTjFbM
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
EOF

echo "      .env.local created."

# ── 6. Install & build ────────────────────────────────────
echo ""
echo "[6/9] Installing dependencies (this takes ~2 min)..."
cd "$APP_DIR"
npm install --legacy-peer-deps > /dev/null 2>&1

echo "      Building app (this takes ~2 min)..."
npm run build

# ── 7. PM2 process manager ────────────────────────────────
echo ""
echo "[7/9] Starting app with PM2..."
pm2 delete japanese-lms 2>/dev/null || true
pm2 start npm --name "japanese-lms" -- start
pm2 save
STARTUP_CMD=$(pm2 startup systemd -u root --hp /root | grep "sudo")
eval "$STARTUP_CMD" 2>/dev/null || true
echo "      App running on port 3000."

# ── 8. Nginx reverse proxy ────────────────────────────────
echo ""
echo "[8/9] Configuring Nginx..."
cat > /etc/nginx/sites-available/japanese-lms << 'NGINX'
server {
    listen 80;
    server_name mozhippattru.org www.mozhippattru.org;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/japanese-lms /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx
echo "      Nginx configured."

# ── 9. SSH deploy key (for GitHub Actions auto-deploy) ────
echo ""
echo "[9/9] Generating deploy SSH key..."
mkdir -p /root/.ssh
ssh-keygen -t ed25519 -f /root/.ssh/deploy_key -N "" -C "mozhippattru-deploy" -q
cat /root/.ssh/deploy_key.pub >> /root/.ssh/authorized_keys
chmod 700 /root/.ssh
chmod 600 /root/.ssh/authorized_keys

# ── Done ──────────────────────────────────────────────────
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo "============================================"
echo "  SETUP COMPLETE!"
echo "============================================"
echo ""
echo "  App URL : http://mozhippattru.org"
echo "  Status  : pm2 status"
echo "  Logs    : pm2 logs japanese-lms"
echo ""
echo "--------------------------------------------"
echo "  STEP A — Enable HTTPS (run this now):"
echo "--------------------------------------------"
echo ""
echo "  certbot --nginx -d mozhippattru.org -d www.mozhippattru.org"
echo ""
echo "--------------------------------------------"
echo "  STEP B — GitHub Actions auto-deploy setup:"
echo "--------------------------------------------"
echo ""
echo "  Add these 2 secrets in your GitHub repo:"
echo "  (Settings → Secrets and variables → Actions → New secret)"
echo ""
echo "  Secret name : SSH_HOST"
echo "  Secret value: $SERVER_IP"
echo ""
echo "  Secret name : SSH_PRIVATE_KEY"
echo "  Secret value: (copy everything below, including the BEGIN/END lines)"
echo ""
cat /root/.ssh/deploy_key
echo ""
echo "============================================"
