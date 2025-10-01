# ----------------------------------------------------------------------
# STAGE 1: BUILD - Untuk menginstal Node.js dan mengompilasi aset frontend
# ----------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Salin package.json dan package-lock.json untuk cache
COPY package.json package-lock.json ./

# Instal dependensi Node.js, termasuk devDependencies untuk build
RUN npm ci

# Salin sisa kode (termasuk kode React/Inertia)
COPY . .

# Jalankan build frontend menggunakan Vite
RUN npm run build

# ----------------------------------------------------------------------
# STAGE 2: RUNTIME - Lingkungan Produksi (PHP-FPM & Nginx)
# ----------------------------------------------------------------------
FROM richarvey/nginx-php-fpm:latest

# Atur variabel lingkungan dari base image
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config untuk production
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow Composer run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Salin kode PHP/Laravel (tanpa node_modules yang sudah tidak diperlukan)
COPY . /var/www/html/

# Hapus node_modules jika ada (dari copy awal)
RUN rm -rf /var/www/html/node_modules

# Salin aset frontend yang sudah di-build dari stage builder
COPY --from=builder /app/public/build /var/www/html/public/build

# Instal Composer dependencies (non-dev untuk produksi)
RUN composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

# Permissions untuk Laravel storage dan bootstrap cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Jalankan migrasi dan cache konfigurasi
RUN php artisan migrate --force
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# Expose port
EXPOSE 80

# Start script dari image (Nginx + PHP-FPM)
CMD ["/start.sh"]